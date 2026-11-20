# Bundled fonts

Both fonts are shipped **unmodified** (byte-identical to the files in the
google/fonts repository: no subsetting, no format conversion, no renaming),
because OFL Reserved Font Names forbid modified versions using the name.
Each font's `OFL.txt` sits beside it and travels with it into `dist/fonts/`.

| Font | File | Designer / copyright | Licence | Source | SHA-256 |
|---|---|---|---|---|---|
| Graduate | `graduate/Graduate-Regular.ttf` | Eduardo Tunni. Copyright 2012 The Graduate Project Authors, Reserved Font Name "Graduate" | SIL OFL 1.1 (`graduate/OFL.txt`) | https://github.com/google/fonts/tree/main/ofl/graduate (upstream https://github.com/etunni/graduate) | `971222b309851d86f2513f89b510dc52d52ef7798b5f43af2c6f58d43df568e5` |
| Archivo Black | `archivoblack/ArchivoBlack-Regular.ttf` | Omnibus-Type. Copyright 2017 The Archivo Black Project Authors | SIL OFL 1.1 (`archivoblack/OFL.txt`) | https://github.com/google/fonts/tree/main/ofl/archivoblack (upstream https://github.com/Omnibus-Type/ArchivoBlack) | `dd9a89a019b4849f66ab75455fe7bdf931311042cbb0f0f97acc061539703180` |

Fetched 2026-11-18 from `raw.githubusercontent.com/google/fonts/main/ofl/...`.
The fonts are never sold on their own; the UI has a visible Credits section.
The "Grade" font (licence unknown) is not bundled and must not be added.
Users may load their own TTF/OTF/WOFF; it is parsed in the browser and never uploaded.
