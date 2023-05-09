(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[820,894],{9894:function(e,t,n){"use strict";var r=n(4027),a=n(3227),o=n(8361),i=n(5971),u=n(2715),l=n(1193);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var d=n(2648).Z,c=d(n(7294)),s=d(n(6505)),f={400:"Bad Request",404:"This page could not be found",405:"Method Not Allowed",500:"Internal Server Error"};function p(e){var t=e.res,n=e.err;return{statusCode:t&&t.statusCode?t.statusCode:n?n.statusCode:404}}var h={error:{fontFamily:'-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',height:"100vh",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},desc:{display:"inline-block",textAlign:"left",lineHeight:"49px",height:"49px",verticalAlign:"middle"},h1:{display:"inline-block",margin:0,marginRight:"20px",padding:"0 23px 0 0",fontSize:"24px",fontWeight:500,verticalAlign:"top",lineHeight:"49px"},h2:{fontSize:"14px",fontWeight:"normal",lineHeight:"49px",margin:0,padding:0}},m=function(e){i(r,e);var t,n=(t=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}(),function(){var e,n=l(r);if(t){var a=l(this).constructor;e=Reflect.construct(n,arguments,a)}else e=n.apply(this,arguments);return u(this,e)});function r(){return a(this,r),n.apply(this,arguments)}return o(r,[{key:"render",value:function(){var e=this.props,t=e.statusCode,n=e.withDarkMode,r=this.props.title||f[t]||"An unexpected error has occurred";return c.default.createElement("div",{style:h.error},c.default.createElement(s.default,null,c.default.createElement("title",null,t?"".concat(t,": ").concat(r):"Application error: a client-side exception has occurred")),c.default.createElement("div",null,c.default.createElement("style",{dangerouslySetInnerHTML:{__html:"\n                body { margin: 0; color: #000; background: #fff; }\n                .next-error-h1 {\n                  border-right: 1px solid rgba(0, 0, 0, .3);\n                }\n\n                ".concat(void 0===n||n?"@media (prefers-color-scheme: dark) {\n                  body { color: #fff; background: #000; }\n                  .next-error-h1 {\n                    border-right: 1px solid rgba(255, 255, 255, .3);\n                  }\n                }":"")}}),t?c.default.createElement("h1",{className:"next-error-h1",style:h.h1},t):null,c.default.createElement("div",{style:h.desc},c.default.createElement("h2",{style:h.h2},this.props.title||t?r:c.default.createElement(c.default.Fragment,null,"Application error: a client-side exception has occurred (see the browser console for more information)"),"."))))}}]),r}(c.default.Component);m.displayName="ErrorPage",m.getInitialProps=p,m.origGetInitialProps=p,t.default=m,("function"==typeof t.default||"object"===r(t.default)&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7285:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.AmpStateContext=void 0;var r=(0,n(2648).Z)(n(7294)).default.createContext({});t.AmpStateContext=r},354:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isInAmpMode=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.ampFirst,n=e.hybrid,r=e.hasQuery;return void 0!==t&&t||void 0!==n&&n&&void 0!==r&&r}},6505:function(e,t,n){"use strict";var r=n(4027);Object.defineProperty(t,"__esModule",{value:!0}),t.defaultHead=s,t.default=void 0;var a=n(6495).Z,o=n(2648).Z,i=(0,n(1598).Z)(n(7294)),u=o(n(148)),l=n(7285),d=n(523),c=n(354);function s(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[i.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(i.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function f(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===i.default.Fragment?e.concat(i.default.Children.toArray(t.props.children).reduce(function(e,t){return"string"==typeof t||"number"==typeof t?e:e.concat(t)},[])):e.concat(t)}n(2783);var p=["name","httpEquiv","charSet","itemProp"];function h(e,t){var n,r,o,u,l=t.inAmpMode;return e.reduce(f,[]).reverse().concat(s(l).reverse()).filter((n=new Set,r=new Set,o=new Set,u={},function(e){var t=!0,a=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){a=!0;var i=e.key.slice(e.key.indexOf("$")+1);n.has(i)?t=!1:n.add(i)}switch(e.type){case"title":case"base":r.has(e.type)?t=!1:r.add(e.type);break;case"meta":for(var l=0,d=p.length;l<d;l++){var c=p[l];if(e.props.hasOwnProperty(c)){if("charSet"===c)o.has(c)?t=!1:o.add(c);else{var s=e.props[c],f=u[c]||new Set;("name"!==c||!a)&&f.has(s)?t=!1:(f.add(s),u[c]=f)}}}}return t})).reverse().map(function(e,t){var n=e.key||t;if(!l&&"link"===e.type&&e.props.href&&["https://fonts.googleapis.com/css","https://use.typekit.net/"].some(function(t){return e.props.href.startsWith(t)})){var r=a({},e.props||{});return r["data-href"]=r.href,r.href=void 0,r["data-optimized-fonts"]=!0,i.default.cloneElement(e,r)}return i.default.cloneElement(e,{key:n})})}t.default=function(e){var t=e.children,n=i.useContext(l.AmpStateContext),r=i.useContext(d.HeadManagerContext);return i.default.createElement(u.default,{reduceComponentsToState:h,headManager:r,inAmpMode:c.isInAmpMode(n)},t)},("function"==typeof t.default||"object"===r(t.default)&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},148:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t,n=e.headManager,u=e.reduceComponentsToState;function l(){if(n&&n.mountedInstances){var t=r.Children.toArray(Array.from(n.mountedInstances).filter(Boolean));n.updateHead(u(t,e))}}return a&&(null==n||null==(t=n.mountedInstances)||t.add(e.children),l()),o(function(){var t;return null==n||null==(t=n.mountedInstances)||t.add(e.children),function(){var t;null==n||null==(t=n.mountedInstances)||t.delete(e.children)}}),o(function(){return n&&(n._pendingUpdate=l),function(){n&&(n._pendingUpdate=l)}}),i(function(){return n&&n._pendingUpdate&&(n._pendingUpdate(),n._pendingUpdate=null),function(){n&&n._pendingUpdate&&(n._pendingUpdate(),n._pendingUpdate=null)}}),null};var r=(0,n(1598).Z)(n(7294)),a=!1,o=r.useLayoutEffect,i=a?function(){}:r.useEffect},2783:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.warnOnce=void 0,t.warnOnce=function(e){}},1981:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_error",function(){return n(9894)}])}},function(e){e.O(0,[774,888,179],function(){return e(e.s=1981)}),_N_E=e.O()}]);