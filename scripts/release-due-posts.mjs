#!/usr/bin/env node
/**
 * release-due-posts.mjs
 *
 * Scheduled-release mechanism for the blog. Scans _drafts/queue/*.md for
 * posts whose frontmatter `publishOn: "YYYY-MM-DD"` is <= today (local time),
 * moves each into _posts/ using the existing filename convention
 * (<date>-<YYYY-MM>-<slug>.md), rewrites the frontmatter date to the
 * publishOn date, removes the publishOn key, commits ONLY the affected
 * paths, and pushes to origin/main.
 *
 * Idempotent: nothing due -> logs a line and exits 0 with no commit.
 * Run manually:  node scripts/release-due-posts.mjs
 * Scheduled by:  ~/Library/LaunchAgents/io.midwinter.blog-release.plist
 * Log:           scripts/release-due-posts.log (gitignored)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const QUEUE_DIR = path.join(REPO_ROOT, "_drafts", "queue");
const POSTS_DIR = path.join(REPO_ROOT, "_posts");
const LOG_FILE = path.join(SCRIPT_DIR, "release-due-posts.log");

function log(message) {
    const line = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, line);
}

function git(args, opts = {}) {
    return execFileSync("git", args, {
        cwd: REPO_ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 32 * 1024 * 1024, // pre-commit hook runs a full lint+build

        ...opts,
    });
}

function todayLocalISO() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/** Normalize a publishOn value (string or YAML-parsed Date) to YYYY-MM-DD. */
function normalizePublishOn(value) {
    if (value instanceof Date) {
        // js-yaml parses unquoted dates as UTC-midnight Dates.
        return value.toISOString().slice(0, 10);
    }
    if (typeof value === "string") {
        const m = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
        if (m) return m[1];
    }
    return null;
}

/**
 * Rewrite the raw frontmatter block textually (preserves author formatting):
 * - drop the publishOn line
 * - set the date portion of `date:` / `date_published:` to publishOn
 * - if neither date key exists, add date_published (the key the site reads)
 */
function rewriteFrontmatter(raw, publishOn) {
    const lines = raw.split("\n");
    const end = lines.indexOf("---", 1);
    if (lines[0].trim() !== "---" || end === -1) {
        throw new Error("no frontmatter block found");
    }
    const fm = lines.slice(1, end);
    const out = [];
    let sawDateKey = false;
    for (const line of fm) {
        if (/^publishOn\s*:/.test(line)) continue; // remove the key
        let m = line.match(/^(date_published\s*:\s*)(.*)$/);
        if (m) {
            sawDateKey = true;
            const old = m[2].trim().replace(/^["']|["']$/g, "");
            const timeMatch = old.match(/T[\d:.]+Z?$/);
            const time = timeMatch ? timeMatch[0] : "T12:00:00.000Z";
            out.push(`${m[1]}${publishOn}${time}`);
            continue;
        }
        m = line.match(/^(date\s*:\s*)/);
        if (m) {
            sawDateKey = true;
            out.push(`${m[1]}"${publishOn}"`);
            continue;
        }
        out.push(line);
    }
    if (!sawDateKey) {
        out.push(`date_published: ${publishOn}T12:00:00.000Z`);
    }
    return ["---", ...out, "---", ...lines.slice(end + 1)].join("\n");
}

function main() {
    // ---- safety checks -------------------------------------------------
    const branch = git(["branch", "--show-current"]).trim();
    if (branch !== "main") {
        log(`REFUSING to run: current branch is "${branch}", not main.`);
        process.exit(1);
    }
    const gitDir = git(["rev-parse", "--git-dir"]).trim();
    const gitDirAbs = path.isAbsolute(gitDir) ? gitDir : path.join(REPO_ROOT, gitDir);
    for (const marker of ["rebase-merge", "rebase-apply", "MERGE_HEAD", "CHERRY_PICK_HEAD"]) {
        if (fs.existsSync(path.join(gitDirAbs, marker))) {
            log(`REFUSING to run: ${marker} present (rebase/merge in progress).`);
            process.exit(1);
        }
    }

    // ---- find due posts ------------------------------------------------
    const today = todayLocalISO();
    if (!fs.existsSync(QUEUE_DIR)) {
        log(`nothing due (no queue directory) - today=${today}`);
        return;
    }
    const candidates = fs
        .readdirSync(QUEUE_DIR)
        .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
        .sort();

    const due = [];
    for (const file of candidates) {
        const fullPath = path.join(QUEUE_DIR, file);
        const raw = fs.readFileSync(fullPath, "utf8");
        let parsed;
        try {
            parsed = matter(raw);
        } catch (err) {
            log(`WARNING: skipping ${file}: unparseable frontmatter (${err.message})`);
            continue;
        }
        const publishOn = normalizePublishOn(parsed.data.publishOn);
        if (!publishOn) {
            log(`WARNING: skipping ${file}: missing/invalid publishOn`);
            continue;
        }
        if (publishOn <= today) {
            due.push({ file, fullPath, raw, publishOn, title: parsed.data.title || file });
        }
    }

    if (due.length === 0) {
        log(`nothing due - today=${today}`);
        return;
    }

    // ---- release each due post (one commit per post) --------------------
    const released = [];
    for (const post of due) {
        const slug = post.file.replace(/\.md$/, "");
        const yearMonth = post.publishOn.slice(0, 7);
        const postName = `${post.publishOn}-${yearMonth}-${slug}.md`;
        const postPath = path.join(POSTS_DIR, postName);
        const relPost = path.relative(REPO_ROOT, postPath);
        const relQueue = path.relative(REPO_ROOT, post.fullPath);

        if (fs.existsSync(postPath)) {
            log(`ERROR: ${relPost} already exists; leaving ${relQueue} in the queue.`);
            process.exitCode = 1;
            continue;
        }

        const rewritten = rewriteFrontmatter(post.raw, post.publishOn);
        fs.writeFileSync(postPath, rewritten);

        // Is the queue file tracked? (If untracked, its deletion needs no commit.)
        let queueTracked = true;
        try {
            git(["ls-files", "--error-unmatch", relQueue]);
        } catch {
            queueTracked = false;
        }

        fs.rmSync(post.fullPath);

        // Stage and commit ONLY the affected paths. The repo may have other
        // uncommitted changes that must not be swept into this commit.
        const commitPaths = queueTracked ? [relPost, relQueue] : [relPost];
        git(["add", "-A", "--", ...commitPaths]);
        git(
            ["commit", "--no-gpg-sign", "-m", `Publish: ${post.title}`, "--", ...commitPaths],
            { stdio: ["ignore", "pipe", "pipe"] }
        );

        // Verify the commit contains exactly the expected paths.
        const committed = git(["show", "--name-only", "--no-renames", "--pretty=format:", "HEAD"])
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .sort();
        const expected = [...commitPaths].sort();
        if (JSON.stringify(committed) !== JSON.stringify(expected)) {
            log(
                `FATAL: commit HEAD contains unexpected paths [${committed.join(", ")}], ` +
                `expected [${expected.join(", ")}]. NOT pushing. Undo with: git reset --soft HEAD~1`
            );
            process.exit(1);
        }

        released.push({ relPost, title: post.title });
        log(`released ${relQueue} -> ${relPost} ("${post.title}")`);
    }

    if (released.length === 0) {
        return; // every due post errored out; exitCode already set
    }

    // ---- push ------------------------------------------------------------
    try {
        git(["push", "--dry-run", "origin", "main"]);
    } catch (err) {
        log(
            `PUSH DRY-RUN FAILED (auth?): ${err.message.split("\n")[0]}. ` +
            `Commit(s) are safe locally on main - push manually with: git push origin main`
        );
        process.exit(1);
    }
    try {
        git(["push", "origin", "main"]);
    } catch (err) {
        log(
            `PUSH FAILED after successful dry-run: ${err.message.split("\n")[0]}. ` +
            `Commit(s) are safe locally on main - push manually with: git push origin main`
        );
        process.exit(1);
    }
    log(`pushed ${released.length} post(s) to origin/main: ${released.map((r) => r.relPost).join(", ")}`);
}

main();
