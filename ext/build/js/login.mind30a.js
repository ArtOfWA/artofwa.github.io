// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3.0
!function(e){var t={};function n(s){if(t[s])return t[s].exports;var a=t[s]={i:s,l:!1,exports:{}};return e[s].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(s,a,function(t){return e[t]}.bind(null,a));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=73)}({73:function(e,t){document.addEventListener("DOMContentLoaded",(function(){var e=new function(){return{addEvent:function(e,t,n){e.attachEvent?e.attachEvent("on, ".concat(t,", ").concat(n)):e.addEventListener(t,n)},setupLoginFormsSubmitEvent:function(){var e=document.getElementsByClassName("login-form")[0];e&&this.addEvent(e,"submit",(function(){event.preventDefault();var t=e.getElementsByClassName("input-email")[0],n=e.getElementsByClassName("username-error")[0];if(""===t.value)return n.innerHTML="Please enter email address",void t.classList.add("error-field");var s=e.getElementsByClassName("input-password")[0],a=e.getElementsByClassName("password-error")[0],r=e.getElementsByClassName("reset-password")[0];if(""===s.value)return a.innerHTML="Please enter password",s.classList.add("error-field"),void r.classList.add("hidden");var o=window.location.origin,i=e.querySelector(".login-referer"),d=e.querySelector('input[type="checkbox"]:checked'),l=e.querySelector(".input-submit"),c=new FormData;c.append("username",t.value),c.append("password",s.value),c.append("remember",null!==d),c.append("referer",i.value),c.append("login",!0),c.append("submit_by_js",!0);var u=new XMLHttpRequest;u.open("POST.html",e.action,!0),l.setAttribute("disabled","disabled"),u.onreadystatechange=function(){if(4===u.readyState){var e=JSON.parse(u.responseText);if("ok"===e.status)window.location.href="".concat(e.referer);else{l.removeAttribute("disabled");var t=e.status;"bad_login"===t||"account_locked"===t?(a.innerHTML=e.message,r.classList.add("hidden")):"account_not_verified"===t&&(window.location.href="".concat(o,"/account/login?status=unverified&t=").concat(e.resend_token))}}},u.send(c)}))},setupLoginFormsValidation:function(){var e=this,t=document.getElementsByClassName("login-form")[0];if(t){var n=t.getElementsByClassName("input-email")[0],s=t.getElementsByClassName("input-password")[0],a=t.getElementsByClassName("password-error")[0];n&&this.addEvent(n,"focus",(function(){e.hideErrorMessage(this,a)})),s&&this.addEvent(s,"focus",(function(){e.hideErrorMessage(this,a)}))}},setupPasswordTypeToggle:function(){var e=window.location.origin,t=document.getElementsByClassName("password_icon")[0];t&&(t.src="".concat(window.location.origin,"../images/eye-crossed.svg"),t.alt="View text",this.addEvent(t,"click",(function(){var t=document.getElementsByClassName("input-password")[0];"password"===t.type?(t.type="text",this.src="".concat(e,"../images/eye-2.html"),this.alt="View text"):(t.type="password",this.src="".concat(e,"../images/eye-crossed.svg"),this.alt="Hide text")})))},showErrorMessage:function(e,t,n,s,a){if(e){t.innerHTML=e.message,s.classList.add("error-field"),a.style.backgroundImage="";var r=document.getElementsByClassName("loader-img-signup")[0];if(r){r.style.backgroundImage="";var o=window.location.origin,i=document.getElementsByClassName("proposed-screenname")[0];i&&this.addEvent(i,"click",(function(){var e=this.getAttribute("screenname");"screenname"===s.name&&(s.value=e,s.classList.remove("error-field"),t.innerHTML="",a.style.backgroundImage="url(".concat(o,"/images/check_green.svg)"))}))}}},hideErrorMessage:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;if(e){n&&(n.style.backgroundImage=""),t&&(t.textContent=""),e.classList.remove("error-field");var s=document.getElementsByClassName("reset-password")[0];s&&s.classList.remove("hidden")}},showCookieWarning:function(){var e=document.getElementsByClassName("cookie-warning")[0],t=document.getElementsByClassName("btn-submit")[0],n=document.getElementsByClassName("input-email")[0],s=document.getElementsByClassName("input-password")[0],a=document.getElementsByClassName("input-checkbox")[0],r=document.getElementsByClassName("password_icon")[0];e&&t&&(navigator.cookieEnabled?(e.classList.add("hidden"),t.disabled=!1,n.disabled=!1,s.disabled=!1,a.disabled=!1,r.hidden=!1):(e.classList.remove("hidden"),t.disabled=!0,n.disabled=!0,s.disabled=!0,a.disabled=!0,r.hidden=!0))}}};e.setupLoginFormsSubmitEvent(),e.setupLoginFormsValidation(),e.setupPasswordTypeToggle(),e.showCookieWarning()}))}});
//# sourceMappingURL=login.min.js.map
// @license-end
