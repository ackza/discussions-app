/*! For license information please see 25.e4bef5f8.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{1554:function(t,e,r){window,t.exports=function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=16)}([function(t,e,r){"use strict";var n=Object.prototype.hasOwnProperty,o=Object.prototype.toString,s=function(t){return"function"==typeof Array.isArray?Array.isArray(t):"[object Array]"===o.call(t)},i=function(t){if(!t||"[object Object]"!==o.call(t))return!1;var e,r=n.call(t,"constructor"),s=t.constructor&&t.constructor.prototype&&n.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!r&&!s)return!1;for(e in t);return void 0===e||n.call(t,e)};t.exports=function t(){var e,r,n,o,a,h,u=arguments[0],l=1,c=arguments.length,p=!1;for("boolean"==typeof u&&(p=u,u=arguments[1]||{},l=2),(null==u||"object"!=typeof u&&"function"!=typeof u)&&(u={});l<c;++l)if(null!=(e=arguments[l]))for(r in e)n=u[r],u!==(o=e[r])&&(p&&o&&(i(o)||(a=s(o)))?(a?(a=!1,h=n&&s(n)?n:[]):h=n&&i(n)?n:{},u[r]=t(p,h,o)):void 0!==o&&(u[r]=o));return u}},function(t,e,r){var n=Array.prototype.slice,o=r(13),s=r(12),i=t.exports=function(t,e,r){return r||(r={}),t===e||(t instanceof Date&&e instanceof Date?t.getTime()===e.getTime():!t||!e||"object"!=typeof t&&"object"!=typeof e?r.strict?t===e:t==e:function(t,e,r){var u,l;if(a(t)||a(e))return!1;if(t.prototype!==e.prototype)return!1;if(s(t))return!!s(e)&&(t=n.call(t),e=n.call(e),i(t,e,r));if(h(t)){if(!h(e))return!1;if(t.length!==e.length)return!1;for(u=0;u<t.length;u++)if(t[u]!==e[u])return!1;return!0}try{var c=o(t),p=o(e)}catch(t){return!1}if(c.length!=p.length)return!1;for(c.sort(),p.sort(),u=c.length-1;u>=0;u--)if(c[u]!=p[u])return!1;for(u=c.length-1;u>=0;u--)if(l=c[u],!i(t[l],e[l],r))return!1;return typeof t==typeof e}(t,e,r))};function a(t){return null==t}function h(t){return!(!t||"object"!=typeof t||"number"!=typeof t.length||"function"!=typeof t.copy||"function"!=typeof t.slice||t.length>0&&"number"!=typeof t[0])}},function(t,e,r){"use strict";var n=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};t.exports=function(t,e,r,a){return e=e||"&",r=r||"=",null===t&&(t=void 0),"object"==typeof t?s(i(t),(function(i){var a=encodeURIComponent(n(i))+r;return o(t[i])?s(t[i],(function(t){return a+encodeURIComponent(n(t))})).join(e):a+encodeURIComponent(n(t[i]))})).join(e):a?encodeURIComponent(n(a))+r+encodeURIComponent(n(t)):""};var o=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)};function s(t,e){if(t.map)return t.map(e);for(var r=[],n=0;n<t.length;n++)r.push(e(t[n],n));return r}var i=Object.keys||function(t){var e=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r);return e}},function(t,e,r){"use strict";function n(t,e){return Object.prototype.hasOwnProperty.call(t,e)}t.exports=function(t,e,r,s){e=e||"&",r=r||"=";var i={};if("string"!=typeof t||0===t.length)return i;var a=/\+/g;t=t.split(e);var h=1e3;s&&"number"==typeof s.maxKeys&&(h=s.maxKeys);var u=t.length;h>0&&u>h&&(u=h);for(var l=0;l<u;++l){var c,p,f,g,y=t[l].replace(a,"%20"),m=y.indexOf(r);m>=0?(c=y.substr(0,m),p=y.substr(m+1)):(c=y,p=""),f=decodeURIComponent(c),g=decodeURIComponent(p),n(i,f)?o(i[f])?i[f].push(g):i[f]=[i[f],g]:i[f]=g}return i};var o=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},function(t,e,r){"use strict";e.decode=e.parse=r(3),e.encode=e.stringify=r(2)},function(t,e,r){"use strict";t.exports={isString:function(t){return"string"==typeof t},isObject:function(t){return"object"==typeof t&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}}},function(t,e){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e,r){(function(t,n){var o;!function(s){"object"==typeof e&&e&&e.nodeType,"object"==typeof t&&t&&t.nodeType;var i="object"==typeof n&&n;i.global!==i&&i.window!==i&&i.self;var a,h=2147483647,u=36,l=/^xn--/,c=/[^\x20-\x7E]/,p=/[\x2E\u3002\uFF0E\uFF61]/g,f={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},g=Math.floor,y=String.fromCharCode;function m(t){throw new RangeError(f[t])}function v(t,e){for(var r=t.length,n=[];r--;)n[r]=e(t[r]);return n}function b(t,e){var r=t.split("@"),n="";return r.length>1&&(n=r[0]+"@",t=r[1]),n+v((t=t.replace(p,".")).split("."),e).join(".")}function d(t){for(var e,r,n=[],o=0,s=t.length;o<s;)(e=t.charCodeAt(o++))>=55296&&e<=56319&&o<s?56320==(64512&(r=t.charCodeAt(o++)))?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),o--):n.push(e);return n}function x(t){return v(t,(function(t){var e="";return t>65535&&(e+=y((t-=65536)>>>10&1023|55296),t=56320|1023&t),e+y(t)})).join("")}function j(t){return t-48<10?t-22:t-65<26?t-65:t-97<26?t-97:u}function w(t,e){return t+22+75*(t<26)-((0!=e)<<5)}function O(t,e,r){var n=0;for(t=r?g(t/700):t>>1,t+=g(t/e);t>455;n+=u)t=g(t/35);return g(n+36*t/(t+38))}function k(t){var e,r,n,o,s,i,a,l,c,p,f=[],y=t.length,v=0,b=128,d=72;for((r=t.lastIndexOf("-"))<0&&(r=0),n=0;n<r;++n)t.charCodeAt(n)>=128&&m("not-basic"),f.push(t.charCodeAt(n));for(o=r>0?r+1:0;o<y;){for(s=v,i=1,a=u;o>=y&&m("invalid-input"),((l=j(t.charCodeAt(o++)))>=u||l>g((h-v)/i))&&m("overflow"),v+=l*i,!(l<(c=a<=d?1:a>=d+26?26:a-d));a+=u)i>g(h/(p=u-c))&&m("overflow"),i*=p;d=O(v-s,e=f.length+1,0==s),g(v/e)>h-b&&m("overflow"),b+=g(v/e),v%=e,f.splice(v++,0,b)}return x(f)}function A(t){var e,r,n,o,s,i,a,l,c,p,f,v,b,x,j,k=[];for(v=(t=d(t)).length,e=128,r=0,s=72,i=0;i<v;++i)(f=t[i])<128&&k.push(y(f));for(n=o=k.length,o&&k.push("-");n<v;){for(a=h,i=0;i<v;++i)(f=t[i])>=e&&f<a&&(a=f);for(a-e>g((h-r)/(b=n+1))&&m("overflow"),r+=(a-e)*b,e=a,i=0;i<v;++i)if((f=t[i])<e&&++r>h&&m("overflow"),f==e){for(l=r,c=u;!(l<(p=c<=s?1:c>=s+26?26:c-s));c+=u)j=l-p,x=u-p,k.push(y(w(p+j%x,0))),l=g(j/x);k.push(y(w(l,0))),s=O(r,b,n==o),r=0,++n}++r,++e}return k.join("")}a={version:"1.4.1",ucs2:{decode:d,encode:x},decode:k,encode:A,toASCII:function(t){return b(t,(function(t){return c.test(t)?"xn--"+A(t):t}))},toUnicode:function(t){return b(t,(function(t){return l.test(t)?k(t.slice(4).toLowerCase()):t}))}},void 0===(o=function(){return a}.call(e,r,e,t))||(t.exports=o)}()}).call(this,r(7)(t),r(6))},function(t,e,r){"use strict";var n=r(8),o=r(5);function s(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}e.parse=d,e.resolve=function(t,e){return d(t,!1,!0).resolve(e)},e.resolveObject=function(t,e){return t?d(t,!1,!0).resolveObject(e):e},e.format=function(t){return o.isString(t)&&(t=d(t)),t instanceof s?t.format():s.prototype.format.call(t)},e.Url=s;var i=/^([a-z0-9.+-]+:)/i,a=/:[0-9]*$/,h=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,u=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),l=["'"].concat(u),c=["%","/","?",";","#"].concat(l),p=["/","?","#"],f=/^[+a-z0-9A-Z_-]{0,63}$/,g=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,y={javascript:!0,"javascript:":!0},m={javascript:!0,"javascript:":!0},v={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},b=r(4);function d(t,e,r){if(t&&o.isObject(t)&&t instanceof s)return t;var n=new s;return n.parse(t,e,r),n}s.prototype.parse=function(t,e,r){if(!o.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var s=t.indexOf("?"),a=-1!==s&&s<t.indexOf("#")?"?":"#",u=t.split(a);u[0]=u[0].replace(/\\/g,"/");var d=t=u.join(a);if(d=d.trim(),!r&&1===t.split("#").length){var x=h.exec(d);if(x)return this.path=d,this.href=d,this.pathname=x[1],x[2]?(this.search=x[2],this.query=e?b.parse(this.search.substr(1)):this.search.substr(1)):e&&(this.search="",this.query={}),this}var j=i.exec(d);if(j){var w=(j=j[0]).toLowerCase();this.protocol=w,d=d.substr(j.length)}if(r||j||d.match(/^\/\/[^@\/]+@[^@\/]+/)){var O="//"===d.substr(0,2);!O||j&&m[j]||(d=d.substr(2),this.slashes=!0)}if(!m[j]&&(O||j&&!v[j])){for(var k,A,E=-1,C=0;C<p.length;C++)-1!==(I=d.indexOf(p[C]))&&(-1===E||I<E)&&(E=I);for(-1!==(A=-1===E?d.lastIndexOf("@"):d.lastIndexOf("@",E))&&(k=d.slice(0,A),d=d.slice(A+1),this.auth=decodeURIComponent(k)),E=-1,C=0;C<c.length;C++){var I;-1!==(I=d.indexOf(c[C]))&&(-1===E||I<E)&&(E=I)}-1===E&&(E=d.length),this.host=d.slice(0,E),d=d.slice(E),this.parseHost(),this.hostname=this.hostname||"";var P="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!P)for(var S=this.hostname.split(/\./),T=(C=0,S.length);C<T;C++){var L=S[C];if(L&&!L.match(f)){for(var U="",q=0,R=L.length;q<R;q++)L.charCodeAt(q)>127?U+="x":U+=L[q];if(!U.match(f)){var M=S.slice(0,C),N=S.slice(C+1),z=L.match(g);z&&(M.push(z[1]),N.unshift(z[2])),N.length&&(d="/"+N.join(".")+d),this.hostname=M.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),P||(this.hostname=n.toASCII(this.hostname));var _=this.port?":"+this.port:"",D=this.hostname||"";this.host=D+_,this.href+=this.host,P&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==d[0]&&(d="/"+d))}if(!y[w])for(C=0,T=l.length;C<T;C++){var F=l[C];if(-1!==d.indexOf(F)){var W=encodeURIComponent(F);W===F&&(W=escape(F)),d=d.split(F).join(W)}}var Q=d.indexOf("#");-1!==Q&&(this.hash=d.substr(Q),d=d.slice(0,Q));var $=d.indexOf("?");if(-1!==$?(this.search=d.substr($),this.query=d.substr($+1),e&&(this.query=b.parse(this.query)),d=d.slice(0,$)):e&&(this.search="",this.query={}),d&&(this.pathname=d),v[w]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){_=this.pathname||"";var H=this.search||"";this.path=_+H}return this.href=this.format(),this},s.prototype.format=function(){var t=this.auth||"";t&&(t=(t=encodeURIComponent(t)).replace(/%3A/i,":"),t+="@");var e=this.protocol||"",r=this.pathname||"",n=this.hash||"",s=!1,i="";this.host?s=t+this.host:this.hostname&&(s=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(s+=":"+this.port)),this.query&&o.isObject(this.query)&&Object.keys(this.query).length&&(i=b.stringify(this.query));var a=this.search||i&&"?"+i||"";return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||v[e])&&!1!==s?(s="//"+(s||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):s||(s=""),n&&"#"!==n.charAt(0)&&(n="#"+n),a&&"?"!==a.charAt(0)&&(a="?"+a),e+s+(r=r.replace(/[?#]/g,(function(t){return encodeURIComponent(t)})))+(a=a.replace("#","%23"))+n},s.prototype.resolve=function(t){return this.resolveObject(d(t,!1,!0)).format()},s.prototype.resolveObject=function(t){if(o.isString(t)){var e=new s;e.parse(t,!1,!0),t=e}for(var r=new s,n=Object.keys(this),i=0;i<n.length;i++){var a=n[i];r[a]=this[a]}if(r.hash=t.hash,""===t.href)return r.href=r.format(),r;if(t.slashes&&!t.protocol){for(var h=Object.keys(t),u=0;u<h.length;u++){var l=h[u];"protocol"!==l&&(r[l]=t[l])}return v[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r}if(t.protocol&&t.protocol!==r.protocol){if(!v[t.protocol]){for(var c=Object.keys(t),p=0;p<c.length;p++){var f=c[p];r[f]=t[f]}return r.href=r.format(),r}if(r.protocol=t.protocol,t.host||m[t.protocol])r.pathname=t.pathname;else{for(var g=(t.pathname||"").split("/");g.length&&!(t.host=g.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==g[0]&&g.unshift(""),g.length<2&&g.unshift(""),r.pathname=g.join("/")}if(r.search=t.search,r.query=t.query,r.host=t.host||"",r.auth=t.auth,r.hostname=t.hostname||t.host,r.port=t.port,r.pathname||r.search){var y=r.pathname||"",b=r.search||"";r.path=y+b}return r.slashes=r.slashes||t.slashes,r.href=r.format(),r}var d=r.pathname&&"/"===r.pathname.charAt(0),x=t.host||t.pathname&&"/"===t.pathname.charAt(0),j=x||d||r.host&&t.pathname,w=j,O=r.pathname&&r.pathname.split("/")||[],k=(g=t.pathname&&t.pathname.split("/")||[],r.protocol&&!v[r.protocol]);if(k&&(r.hostname="",r.port=null,r.host&&(""===O[0]?O[0]=r.host:O.unshift(r.host)),r.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===g[0]?g[0]=t.host:g.unshift(t.host)),t.host=null),j=j&&(""===g[0]||""===O[0])),x)r.host=t.host||""===t.host?t.host:r.host,r.hostname=t.hostname||""===t.hostname?t.hostname:r.hostname,r.search=t.search,r.query=t.query,O=g;else if(g.length)O||(O=[]),O.pop(),O=O.concat(g),r.search=t.search,r.query=t.query;else if(!o.isNullOrUndefined(t.search))return k&&(r.hostname=r.host=O.shift(),(P=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=P.shift(),r.host=r.hostname=P.shift())),r.search=t.search,r.query=t.query,o.isNull(r.pathname)&&o.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r;if(!O.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r;for(var A=O.slice(-1)[0],E=(r.host||t.host||O.length>1)&&("."===A||".."===A)||""===A,C=0,I=O.length;I>=0;I--)"."===(A=O[I])?O.splice(I,1):".."===A?(O.splice(I,1),C++):C&&(O.splice(I,1),C--);if(!j&&!w)for(;C--;C)O.unshift("..");!j||""===O[0]||O[0]&&"/"===O[0].charAt(0)||O.unshift(""),E&&"/"!==O.join("/").substr(-1)&&O.push("");var P,S=""===O[0]||O[0]&&"/"===O[0].charAt(0);return k&&(r.hostname=r.host=S?"":O.length?O.shift():"",(P=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=P.shift(),r.host=r.hostname=P.shift())),(j=j||r.host&&O.length)&&!S&&O.unshift(""),O.length?r.pathname=O.join("/"):(r.pathname=null,r.path=null),o.isNull(r.pathname)&&o.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=t.auth||r.auth,r.slashes=r.slashes||t.slashes,r.href=r.format(),r},s.prototype.parseHost=function(){var t=this.host,e=a.exec(t);e&&(":"!==(e=e[0])&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},function(t,e,r){"use strict";const n="undefined"==typeof URL?r(9).URL:URL;function o(t,e){return e.some(e=>e instanceof RegExp?e.test(t):e===t)}t.exports=(t,e)=>{e=Object.assign({normalizeProtocol:!0,normalizeHttps:!1,stripFragment:!0,stripWWW:!0,removeQueryParameters:[/^utm_\w+/i],removeTrailingSlash:!0,removeDirectoryIndex:!1,sortQueryParameters:!0},e);const r=(t=t.trim()).startsWith("//");!r&&/^\.*\//.test(t)||(t=t.replace(/^(?!(?:\w+:)?\/\/)|^\/\//,"http://"));const s=new n(t);if(e.normalizeHttps&&"https:"===s.protocol&&(s.protocol="http:"),e.stripFragment&&(s.hash=""),s.pathname&&(s.pathname=s.pathname.replace(/\/{2,}/g,"/")),s.pathname&&(s.pathname=decodeURI(s.pathname)),!0===e.removeDirectoryIndex&&(e.removeDirectoryIndex=[/^index\.[a-z]+$/]),Array.isArray(e.removeDirectoryIndex)&&e.removeDirectoryIndex.length>0){let t=s.pathname.split("/");o(t[t.length-1],e.removeDirectoryIndex)&&(t=t.slice(0,t.length-1),s.pathname=t.slice(1).join("/")+"/")}if(s.hostname&&(s.hostname=s.hostname.replace(/\.$/,""),e.stripWWW&&(s.hostname=s.hostname.replace(/^www\./,""))),Array.isArray(e.removeQueryParameters))for(const t of[...s.searchParams.keys()])o(t,e.removeQueryParameters)&&s.searchParams.delete(t);return e.sortQueryParameters&&s.searchParams.sort(),t=s.toString(),(e.removeTrailingSlash||"/"===s.pathname)&&(t=t.replace(/\/$/,"")),r&&!e.normalizeProtocol&&(t=t.replace(/^http:\/\//,"//")),t}},function(t,e,r){var n=r(1),o=r(0),s={attributes:{compose:function(t,e,r){"object"!=typeof t&&(t={}),"object"!=typeof e&&(e={});var n=o(!0,{},e);for(var s in r||(n=Object.keys(n).reduce((function(t,e){return null!=n[e]&&(t[e]=n[e]),t}),{})),t)void 0!==t[s]&&void 0===e[s]&&(n[s]=t[s]);return Object.keys(n).length>0?n:void 0},diff:function(t,e){"object"!=typeof t&&(t={}),"object"!=typeof e&&(e={});var r=Object.keys(t).concat(Object.keys(e)).reduce((function(r,o){return n(t[o],e[o])||(r[o]=void 0===e[o]?null:e[o]),r}),{});return Object.keys(r).length>0?r:void 0},transform:function(t,e,r){if("object"!=typeof t)return e;if("object"==typeof e){if(!r)return e;var n=Object.keys(e).reduce((function(r,n){return void 0===t[n]&&(r[n]=e[n]),r}),{});return Object.keys(n).length>0?n:void 0}}},iterator:function(t){return new i(t)},length:function(t){return"number"==typeof t.delete?t.delete:"number"==typeof t.retain?t.retain:"string"==typeof t.insert?t.insert.length:1}};function i(t){this.ops=t,this.index=0,this.offset=0}i.prototype.hasNext=function(){return this.peekLength()<1/0},i.prototype.next=function(t){t||(t=1/0);var e=this.ops[this.index];if(e){var r=this.offset,n=s.length(e);if(t>=n-r?(t=n-r,this.index+=1,this.offset=0):this.offset+=t,"number"==typeof e.delete)return{delete:t};var o={};return e.attributes&&(o.attributes=e.attributes),"number"==typeof e.retain?o.retain=t:"string"==typeof e.insert?o.insert=e.insert.substr(r,t):o.insert=e.insert,o}return{retain:1/0}},i.prototype.peek=function(){return this.ops[this.index]},i.prototype.peekLength=function(){return this.ops[this.index]?s.length(this.ops[this.index])-this.offset:1/0},i.prototype.peekType=function(){return this.ops[this.index]?"number"==typeof this.ops[this.index].delete?"delete":"number"==typeof this.ops[this.index].retain?"retain":"insert":"retain"},t.exports=s},function(t,e){var r="[object Arguments]"==function(){return Object.prototype.toString.call(arguments)}();function n(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function o(t){return t&&"object"==typeof t&&"number"==typeof t.length&&Object.prototype.hasOwnProperty.call(t,"callee")&&!Object.prototype.propertyIsEnumerable.call(t,"callee")||!1}(e=t.exports=r?n:o).supported=n,e.unsupported=o},function(t,e){function r(t){var e=[];for(var r in t)e.push(r);return e}(t.exports="function"==typeof Object.keys?Object.keys:r).shim=r},function(t,e){var r=-1;function n(t,e,a){if(t==e)return t?[[0,t]]:[];(a<0||t.length<a)&&(a=null);var u=s(t,e),l=t.substring(0,u);u=i(t=t.substring(u),e=e.substring(u));var c=t.substring(t.length-u),p=function(t,e){var a;if(!t)return[[1,e]];if(!e)return[[r,t]];var h=t.length>e.length?t:e,u=t.length>e.length?e:t,l=h.indexOf(u);if(-1!=l)return a=[[1,h.substring(0,l)],[0,u],[1,h.substring(l+u.length)]],t.length>e.length&&(a[0][0]=a[2][0]=r),a;if(1==u.length)return[[r,t],[1,e]];var c=function(t,e){var r=t.length>e.length?t:e,n=t.length>e.length?e:t;if(r.length<4||2*n.length<r.length)return null;function o(t,e,r){for(var n,o,a,h,u=t.substring(r,r+Math.floor(t.length/4)),l=-1,c="";-1!=(l=e.indexOf(u,l+1));){var p=s(t.substring(r),e.substring(l)),f=i(t.substring(0,r),e.substring(0,l));c.length<f+p&&(c=e.substring(l-f,l)+e.substring(l,l+p),n=t.substring(0,r-f),o=t.substring(r+p),a=e.substring(0,l-f),h=e.substring(l+p))}return 2*c.length>=t.length?[n,o,a,h,c]:null}var a,h,u,l,c,p=o(r,n,Math.ceil(r.length/4)),f=o(r,n,Math.ceil(r.length/2));return p||f?(a=f?p&&p[4].length>f[4].length?p:f:p,t.length>e.length?(h=a[0],u=a[1],l=a[2],c=a[3]):(l=a[0],c=a[1],h=a[2],u=a[3]),[h,u,l,c,a[4]]):null}(t,e);if(c){var p=c[0],f=c[1],g=c[2],y=c[3],m=c[4],v=n(p,g),b=n(f,y);return v.concat([[0,m]],b)}return function(t,e){for(var n=t.length,s=e.length,i=Math.ceil((n+s)/2),a=i,h=2*i,u=new Array(h),l=new Array(h),c=0;c<h;c++)u[c]=-1,l[c]=-1;u[a+1]=0,l[a+1]=0;for(var p=n-s,f=p%2!=0,g=0,y=0,m=0,v=0,b=0;b<i;b++){for(var d=-b+g;d<=b-y;d+=2){for(var x=a+d,j=(E=d==-b||d!=b&&u[x-1]<u[x+1]?u[x+1]:u[x-1]+1)-d;E<n&&j<s&&t.charAt(E)==e.charAt(j);)E++,j++;if(u[x]=E,E>n)y+=2;else if(j>s)g+=2;else if(f&&(k=a+p-d)>=0&&k<h&&-1!=l[k]){var w=n-l[k];if(E>=w)return o(t,e,E,j)}}for(var O=-b+m;O<=b-v;O+=2){for(var k=a+O,A=(w=O==-b||O!=b&&l[k-1]<l[k+1]?l[k+1]:l[k-1]+1)-O;w<n&&A<s&&t.charAt(n-w-1)==e.charAt(s-A-1);)w++,A++;if(l[k]=w,w>n)v+=2;else if(A>s)m+=2;else if(!f&&(x=a+p-O)>=0&&x<h&&-1!=u[x]){var E=u[x];if(j=a+E-x,E>=(w=n-w))return o(t,e,E,j)}}}return[[r,t],[1,e]]}(t,e)}(t=t.substring(0,t.length-u),e=e.substring(0,e.length-u));return l&&p.unshift([0,l]),c&&p.push([0,c]),function t(e){e.push([0,""]);for(var n,o=0,a=0,h=0,u="",l="";o<e.length;)switch(e[o][0]){case 1:h++,l+=e[o][1],o++;break;case r:a++,u+=e[o][1],o++;break;case 0:a+h>1?(0!==a&&0!==h&&(0!==(n=s(l,u))&&(o-a-h>0&&0==e[o-a-h-1][0]?e[o-a-h-1][1]+=l.substring(0,n):(e.splice(0,0,[0,l.substring(0,n)]),o++),l=l.substring(n),u=u.substring(n)),0!==(n=i(l,u))&&(e[o][1]=l.substring(l.length-n)+e[o][1],l=l.substring(0,l.length-n),u=u.substring(0,u.length-n))),0===a?e.splice(o-h,a+h,[1,l]):0===h?e.splice(o-a,a+h,[r,u]):e.splice(o-a-h,a+h,[r,u],[1,l]),o=o-a-h+(a?1:0)+(h?1:0)+1):0!==o&&0==e[o-1][0]?(e[o-1][1]+=e[o][1],e.splice(o,1)):o++,h=0,a=0,u="",l=""}""===e[e.length-1][1]&&e.pop();var c=!1;for(o=1;o<e.length-1;)0==e[o-1][0]&&0==e[o+1][0]&&(e[o][1].substring(e[o][1].length-e[o-1][1].length)==e[o-1][1]?(e[o][1]=e[o-1][1]+e[o][1].substring(0,e[o][1].length-e[o-1][1].length),e[o+1][1]=e[o-1][1]+e[o+1][1],e.splice(o-1,1),c=!0):e[o][1].substring(0,e[o+1][1].length)==e[o+1][1]&&(e[o-1][1]+=e[o+1][1],e[o][1]=e[o][1].substring(e[o+1][1].length)+e[o+1][1],e.splice(o+1,1),c=!0)),o++;c&&t(e)}(p),null!=a&&(p=function(t,e){var n=function(t,e){if(0===e)return[0,t];for(var n=0,o=0;o<t.length;o++){var s=t[o];if(s[0]===r||0===s[0]){var i=n+s[1].length;if(e===i)return[o+1,t];if(e<i){t=t.slice();var a=e-n,h=[s[0],s[1].slice(0,a)],u=[s[0],s[1].slice(a)];return t.splice(o,1,h,u),[o+1,t]}n=i}}throw new Error("cursor_pos is out of bounds!")}(t,e),o=n[1],s=n[0],i=o[s],a=o[s+1];if(null==i)return t;if(0!==i[0])return t;if(null!=a&&i[1]+a[1]===a[1]+i[1])return o.splice(s,2,a,i),h(o,s,2);if(null!=a&&0===a[1].indexOf(i[1])){o.splice(s,2,[a[0],i[1]],[0,i[1]]);var u=a[1].slice(i[1].length);return u.length>0&&o.splice(s+2,0,[a[0],u]),h(o,s,3)}return t}(p,a)),function(t){for(var e=!1,n=function(t){return t.charCodeAt(0)>=56320&&t.charCodeAt(0)<=57343},o=function(t){return t.charCodeAt(t.length-1)>=55296&&t.charCodeAt(t.length-1)<=56319},s=2;s<t.length;s+=1)0===t[s-2][0]&&o(t[s-2][1])&&t[s-1][0]===r&&n(t[s-1][1])&&1===t[s][0]&&n(t[s][1])&&(e=!0,t[s-1][1]=t[s-2][1].slice(-1)+t[s-1][1],t[s][1]=t[s-2][1].slice(-1)+t[s][1],t[s-2][1]=t[s-2][1].slice(0,-1));if(!e)return t;var i=[];for(s=0;s<t.length;s+=1)t[s][1].length>0&&i.push(t[s]);return i}(p)}function o(t,e,r,o){var s=t.substring(0,r),i=e.substring(0,o),a=t.substring(r),h=e.substring(o),u=n(s,i),l=n(a,h);return u.concat(l)}function s(t,e){if(!t||!e||t.charAt(0)!=e.charAt(0))return 0;for(var r=0,n=Math.min(t.length,e.length),o=n,s=0;r<o;)t.substring(s,o)==e.substring(s,o)?s=r=o:n=o,o=Math.floor((n-r)/2+r);return o}function i(t,e){if(!t||!e||t.charAt(t.length-1)!=e.charAt(e.length-1))return 0;for(var r=0,n=Math.min(t.length,e.length),o=n,s=0;r<o;)t.substring(t.length-o,t.length-s)==e.substring(e.length-o,e.length-s)?s=r=o:n=o,o=Math.floor((n-r)/2+r);return o}var a=n;function h(t,e,r){for(var n=e+r-1;n>=0&&n>=e-1;n--)if(n+1<t.length){var o=t[n],s=t[n+1];o[0]===s[1]&&t.splice(n,2,[o[0],o[1]+s[1]])}return t}a.INSERT=1,a.DELETE=r,a.EQUAL=0,t.exports=a},function(t,e,r){var n=r(14),o=r(1),s=r(0),i=r(11),a=String.fromCharCode(0),h=function(t){Array.isArray(t)?this.ops=t:null!=t&&Array.isArray(t.ops)?this.ops=t.ops:this.ops=[]};h.prototype.insert=function(t,e){var r={};return 0===t.length?this:(r.insert=t,null!=e&&"object"==typeof e&&Object.keys(e).length>0&&(r.attributes=e),this.push(r))},h.prototype.delete=function(t){return t<=0?this:this.push({delete:t})},h.prototype.retain=function(t,e){if(t<=0)return this;var r={retain:t};return null!=e&&"object"==typeof e&&Object.keys(e).length>0&&(r.attributes=e),this.push(r)},h.prototype.push=function(t){var e=this.ops.length,r=this.ops[e-1];if(t=s(!0,{},t),"object"==typeof r){if("number"==typeof t.delete&&"number"==typeof r.delete)return this.ops[e-1]={delete:r.delete+t.delete},this;if("number"==typeof r.delete&&null!=t.insert&&(e-=1,"object"!=typeof(r=this.ops[e-1])))return this.ops.unshift(t),this;if(o(t.attributes,r.attributes)){if("string"==typeof t.insert&&"string"==typeof r.insert)return this.ops[e-1]={insert:r.insert+t.insert},"object"==typeof t.attributes&&(this.ops[e-1].attributes=t.attributes),this;if("number"==typeof t.retain&&"number"==typeof r.retain)return this.ops[e-1]={retain:r.retain+t.retain},"object"==typeof t.attributes&&(this.ops[e-1].attributes=t.attributes),this}}return e===this.ops.length?this.ops.push(t):this.ops.splice(e,0,t),this},h.prototype.chop=function(){var t=this.ops[this.ops.length-1];return t&&t.retain&&!t.attributes&&this.ops.pop(),this},h.prototype.filter=function(t){return this.ops.filter(t)},h.prototype.forEach=function(t){this.ops.forEach(t)},h.prototype.map=function(t){return this.ops.map(t)},h.prototype.partition=function(t){var e=[],r=[];return this.forEach((function(n){(t(n)?e:r).push(n)})),[e,r]},h.prototype.reduce=function(t,e){return this.ops.reduce(t,e)},h.prototype.changeLength=function(){return this.reduce((function(t,e){return e.insert?t+i.length(e):e.delete?t-e.delete:t}),0)},h.prototype.length=function(){return this.reduce((function(t,e){return t+i.length(e)}),0)},h.prototype.slice=function(t,e){t=t||0,"number"!=typeof e&&(e=1/0);for(var r=[],n=i.iterator(this.ops),o=0;o<e&&n.hasNext();){var s;o<t?s=n.next(t-o):(s=n.next(e-o),r.push(s)),o+=i.length(s)}return new h(r)},h.prototype.compose=function(t){for(var e=i.iterator(this.ops),r=i.iterator(t.ops),n=new h;e.hasNext()||r.hasNext();)if("insert"===r.peekType())n.push(r.next());else if("delete"===e.peekType())n.push(e.next());else{var o=Math.min(e.peekLength(),r.peekLength()),s=e.next(o),a=r.next(o);if("number"==typeof a.retain){var u={};"number"==typeof s.retain?u.retain=o:u.insert=s.insert;var l=i.attributes.compose(s.attributes,a.attributes,"number"==typeof s.retain);l&&(u.attributes=l),n.push(u)}else"number"==typeof a.delete&&"number"==typeof s.retain&&n.push(a)}return n.chop()},h.prototype.concat=function(t){var e=new h(this.ops.slice());return t.ops.length>0&&(e.push(t.ops[0]),e.ops=e.ops.concat(t.ops.slice(1))),e},h.prototype.diff=function(t,e){if(this.ops===t.ops)return new h;var r=[this,t].map((function(e){return e.map((function(r){if(null!=r.insert)return"string"==typeof r.insert?r.insert:a;throw new Error("diff() called "+(e===t?"on":"with")+" non-document")})).join("")})),s=new h,u=n(r[0],r[1],e),l=i.iterator(this.ops),c=i.iterator(t.ops);return u.forEach((function(t){for(var e=t[1].length;e>0;){var r=0;switch(t[0]){case n.INSERT:r=Math.min(c.peekLength(),e),s.push(c.next(r));break;case n.DELETE:r=Math.min(e,l.peekLength()),l.next(r),s.delete(r);break;case n.EQUAL:r=Math.min(l.peekLength(),c.peekLength(),e);var a=l.next(r),h=c.next(r);o(a.insert,h.insert)?s.retain(r,i.attributes.diff(a.attributes,h.attributes)):s.push(h).delete(r)}e-=r}})),s.chop()},h.prototype.eachLine=function(t,e){e=e||"\n";for(var r=i.iterator(this.ops),n=new h,o=0;r.hasNext();){if("insert"!==r.peekType())return;var s=r.peek(),a=i.length(s)-r.peekLength(),u="string"==typeof s.insert?s.insert.indexOf(e,a)-a:-1;if(u<0)n.push(r.next());else if(u>0)n.push(r.next(u));else{if(!1===t(n,r.next(1).attributes||{},o))return;o+=1,n=new h}}n.length()>0&&t(n,{},o)},h.prototype.transform=function(t,e){if(e=!!e,"number"==typeof t)return this.transformPosition(t,e);for(var r=i.iterator(this.ops),n=i.iterator(t.ops),o=new h;r.hasNext()||n.hasNext();)if("insert"!==r.peekType()||!e&&"insert"===n.peekType())if("insert"===n.peekType())o.push(n.next());else{var s=Math.min(r.peekLength(),n.peekLength()),a=r.next(s),u=n.next(s);if(a.delete)continue;u.delete?o.push(u):o.retain(s,i.attributes.transform(a.attributes,u.attributes,e))}else o.retain(i.length(r.next()));return o.chop()},h.prototype.transformPosition=function(t,e){e=!!e;for(var r=i.iterator(this.ops),n=0;r.hasNext()&&n<=t;){var o=r.peekLength(),s=r.peekType();r.next(),"delete"!==s?("insert"===s&&(n<t||!e)&&(t+=o),n+=o):t-=Math.min(o,t-n)}return t},t.exports=h},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var r=[],n=!0,o=!1,s=void 0;try{for(var i,a=t[Symbol.iterator]();!(n=(i=a.next()).done)&&(r.push(i.value),!e||r.length!==e);n=!0);}catch(t){o=!0,s=t}finally{try{!n&&a.return&&a.return()}finally{if(o)throw s}}return r}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")},o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},s=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=h(r(15)),a=h(r(10));function h(t){return t&&t.__esModule?t:{default:t}}var u={globalRegularExpression:/(https?:\/\/|www\.)[\S]+/g,urlRegularExpression:/(https?:\/\/[\S]+)|(www.[\S]+)/,normalizeRegularExpression:/(https?:\/\/[\S]+)|(www.[\S]+)/,normalizeUrlOptions:{stripFragment:!1,stripWWW:!1}},l=function(){function t(e,r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.quill=e,r=r||{},this.options=o({},u,r),this.registerTypeListener(),this.registerPasteListener()}return s(t,[{key:"registerPasteListener",value:function(){var t=this;this.quill.clipboard.addMatcher(Node.TEXT_NODE,(function(e,r){if("string"==typeof e.data){var n=e.data.match(t.options.globalRegularExpression);if(n&&n.length>0){var o=new i.default,s=e.data;n.forEach((function(e){var r=s.split(e),n=r.shift();o.insert(n),o.insert(e,{link:t.normalize(e)}),s=r.join(e)})),o.insert(s),r.ops=o.ops}return r}}))}},{key:"registerTypeListener",value:function(){var t=this;this.quill.on("text-change",(function(e){var r=e.ops;if(!(!r||r.length<1||r.length>2)){var n=r[r.length-1];n.insert&&"string"==typeof n.insert&&n.insert.match(/\s/)&&t.checkTextForUrl()}}))}},{key:"checkTextForUrl",value:function(){var t=this.quill.getSelection();if(t){var e=this.quill.getLeaf(t.index),r=n(e,1)[0];if(r.text&&"a"!==r.parent.domNode.localName){var o=r.text.match(this.options.urlRegularExpression);if(o){var s=this.quill.getIndex(r)+o.index;this.textToUrl(s,o[0])}}}}},{key:"textToUrl",value:function(t,e){var r=(new i.default).retain(t).delete(e.length).insert(e,{link:this.normalize(e)});this.quill.updateContents(r)}},{key:"normalize",value:function(t){return this.options.normalizeRegularExpression.test(t)?(0,a.default)(t,this.options.normalizeUrlOptions):t}}]),t}();e.default=l,window.Quill&&window.Quill.register("modules/magicUrl",l)}])}}]);