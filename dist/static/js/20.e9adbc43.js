(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{1546:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),c=t(22),s=t(25),r=t(28),i=t.n(r),m=t(65),o=t.n(m),d=t(10),u=t(222),b=t(90),E=t(35),p=t(1332),f=t.n(p),g=function(e){switch(e.setting){case"connections":return l.a.createElement(u.w,null);case"wallet":return l.a.createElement(u.y,null);case"blocked":return l.a.createElement(u.v,null);case"moderation":return l.a.createElement(u.x,null);case"airdrop":return l.a.createElement(u.u,null);default:return null}},w=function(e,a){return i()(["f6 ph4 pv2 pointer dim",{"bg-near-white":e===a}])};a.default=Object(c.c)((function(){var e=Object(s.c)(),a=e.uiStore,t=e.walletStore,c=Object(b.h)().setting;return Object(n.useEffect)((function(){return a.setSidebarHidden(!0),function(){a.setSidebarHidden(!1)}}),[]),l.a.createElement(l.a.Fragment,null,l.a.createElement(f.a,null,l.a.createElement("title",null,"Discussions App - Settings")),l.a.createElement("div",{className:"flex flex-row"},l.a.createElement("div",{className:"w-30 vh-75 bg-white card"},l.a.createElement("div",{className:"db"},l.a.createElement("span",{className:"db f6 b black ph4 pt4"},"Settings"),l.a.createElement("ul",{className:"list pa0 ma0 mt3"},l.a.createElement(E.b,{to:"/settings/connections",className:"gray"},l.a.createElement("li",{className:w(c,"connections")},"Connections")),l.a.createElement(E.b,{to:"/settings/wallet",className:"gray"},l.a.createElement("li",{className:w(c,"wallet")},"Wallet ")),l.a.createElement(E.b,{to:"/settings/moderation",className:"gray"},l.a.createElement("li",{className:w(c,"moderation")},"Moderation")),l.a.createElement(E.b,{to:"/settings/airdrop",className:"gray"},l.a.createElement("li",{className:w(c,"airdrop")},"Airdrop ")),l.a.createElement(E.b,{to:"/settings/blocked",className:"gray"},l.a.createElement("li",{className:w(c,"blocked")},"Blocked")))),l.a.createElement("div",{className:"db"},l.a.createElement("span",{className:"db f6 b black ph4 pt4 flex flex-row justify-between items-center"},"Balances",t.refreshAllBalances.pending?l.a.createElement(d.a,{type:"loading"}):l.a.createElement(d.a,{type:"reload",onClick:t.refreshAllBalances})),l.a.createElement(u.D,{className:"ph4"}))),l.a.createElement("div",{className:"fl ml3 w-70 bg-white card pa4"},l.a.createElement("span",{className:"f4 b black db mb3"},o.a.startCase(c)),l.a.createElement(g,{setting:c}))))}))}}]);