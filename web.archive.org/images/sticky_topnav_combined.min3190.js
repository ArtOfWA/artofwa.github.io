var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

(function(){var attachEvent=document.attachEvent;var isIE=navigator.userAgent.match(/Trident/);var requestFrame=function(){var raf=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(fn){return window.setTimeout(fn,20)};return function(fn){return raf(fn)}}();var cancelFrame=function(){var cancel=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout;return function(id){return cancel(id)}}();function resizeListener(e){var win=e.target||e.srcElement;if(win.__resizeRAF__)cancelFrame(win.__resizeRAF__);win.__resizeRAF__=requestFrame(function(){var trigger=win.__resizeTrigger__;trigger.__resizeListeners__.forEach(function(fn){fn.call(trigger,e)})})}function objectLoad(e){this.contentDocument.defaultView.__resizeTrigger__=this.__resizeElement__;this.contentDocument.defaultView.addEventListener("resize",resizeListener)}window.addResizeListener=function(element,fn){if(!element.__resizeListeners__){element.__resizeListeners__=[]}if(attachEvent){element.__resizeTrigger__=element;element.attachEvent("onresize",resizeListener)}else{if(getComputedStyle(element).position=="static")element.style.position="relative";var obj=element.__resizeTrigger__=document.createElement("object");obj.tabIndex=-1;obj.setAttribute("style","display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; opacity: 0;");obj.__resizeElement__=element;obj.onload=objectLoad;obj.type="text/html";if(isIE)element.appendChild(obj);obj.data="about:blank";if(!isIE)element.appendChild(obj)}element.__resizeListeners__.push(fn)};window.removeResizeListener=function(element,fn){element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn),1);if(!element.__resizeListeners__.length){if(attachEvent)element.detachEvent("onresize",resizeListener);else{element.__resizeTrigger__.contentDocument.defaultView.removeEventListener("resize",resizeListener);element.__resizeTrigger__=!element.removeChild(element.__resizeTrigger__)}}}})();(function(){var STICKY_TOPNAV_CLASS="topnav_sticky",STICKY_TOPNAV_SCROLLED_CLASS="sticky_topnav_scrolled",TOPNAV_DESKTOP_SELECTOR=".topnav_desktop",TOPNAV_MOBILE_SELECTOR=".topnav_mobile",SCROLL_FACTOR=.25;var topnavDesktop,topnavMobile,topnavWrap,contentWrap,prevTopnavHeight,initialPaddingTop;function initialize(config){var topnavWrapSelector=config.topnav_wrap_selector;var contentWrapSelector=config.content_wrap_selector;var excludedPages=config.excluded_pages;var includedPages=config.sticky_included_pages;if(isPageExcluded(excludedPages)){return}topnavDesktop=document.querySelector(TOPNAV_DESKTOP_SELECTOR);if(!(topnavDesktop instanceof Element)){return}topnavMobile=document.querySelector(TOPNAV_MOBILE_SELECTOR);if(!(topnavMobile instanceof Element)){return}topnavWrap=document.querySelector(topnavWrapSelector);contentWrap=document.querySelector(contentWrapSelector);if(!isMobile()||isMobile()&&isPageIncludedToBeSticky(includedPages)){toggleSticky();window.addEventListener("resize",toggleSticky)}}function toggleSticky(){var isSticky=isTopnavSticky();var isVisible=isTopnavVisible();if(!isSticky&&isVisible){enableSticky()}else if(isSticky&&!isVisible){disableSticky()}}function enableSticky(){topnavWrap.classList.add(STICKY_TOPNAV_CLASS);initialPaddingTop=window.getComputedStyle(contentWrap).paddingTop;prevTopnavHeight=topnavWrap.getBoundingClientRect().bottom;contentWrap.style.paddingTop=prevTopnavHeight+"px";if(isTopnavBgTransparent()){toggleScrolledClass();document.addEventListener("scroll",toggleScrolledClass)}window.addEventListener("load",adjustContentPaddingTop);window.addResizeListener(topnavWrap,handleTopnavResize);document.addEventListener("webkitfullscreenchange",handleTopnavResize)}function disableSticky(){topnavWrap.classList.remove(STICKY_TOPNAV_CLASS);contentWrap.style.paddingTop=initialPaddingTop;if(isTopnavBgTransparent()){toggleScrolledClass();document.removeEventListener("scroll",toggleScrolledClass)}window.removeEventListener("load",adjustContentPaddingTop);window.removeResizeListener(topnavWrap,handleTopnavResize);document.removeEventListener("webkitfullscreenchange",handleTopnavResize)}function handleTopnavResize(){if(!isTopnavVisible()){return}var heightChange=topnavWrap.getBoundingClientRect().bottom-prevTopnavHeight;if(window.pageYOffset>prevTopnavHeight){window.scrollBy(0,Math.round(heightChange))}setTimeout(function(){prevTopnavHeight=topnavWrap.getBoundingClientRect().bottom;contentWrap.style.paddingTop=prevTopnavHeight+"px"},0)}function toggleScrolledClass(){if(window.getComputedStyle(document.body).position==="fixed"){return}var scrollRatio=window.pageYOffset/topnavWrap.offsetHeight;var toggle=scrollRatio>=SCROLL_FACTOR?"add":"remove";topnavWrap.classList[toggle](STICKY_TOPNAV_SCROLLED_CLASS)}function adjustContentPaddingTop(){contentWrap.style.paddingTop=topnavWrap.getBoundingClientRect().bottom+"px"}function isTopnavVisible(){return window.getComputedStyle(topnavDesktop).display!=="none"||window.getComputedStyle(topnavMobile).display!=="none"}function isMobile(){return window.getComputedStyle(topnavMobile).display!=="none"}function isTopnavSticky(){return topnavWrap.classList.contains(STICKY_TOPNAV_CLASS)}function isPageIncludedToBeSticky(includedPages){var isRouteIncluded=includedPages.indexOf(window.vimeo_esi.config.route)!==-1;var isControllerIncluded=includedPages.indexOf(window.vimeo_esi.config.controller)!==-1;return isRouteIncluded||isControllerIncluded}function isPageExcluded(excludedPages){var isRouteExcluded=excludedPages.indexOf(window.vimeo_esi.config.route)!==-1;var isControllerExcluded=excludedPages.indexOf(window.vimeo_esi.config.controller)!==-1;return isRouteExcluded||isControllerExcluded}function isTopnavBgTransparent(){var backgroundColor=window.getComputedStyle(topnavDesktop).backgroundColor;if(backgroundColor==="transparent"){return true}var rgba=/(rgba\(.+,.+,.+,)(.+)\)/;var rgbaMatch=backgroundColor.match(rgba);return rgbaMatch&&Number(rgbaMatch[2])===0}if(window.vimeo.config.sticky_topnav){initialize(window.vimeo.config.sticky_topnav)}})();
//# sourceMappingURL= 

}
/*
     FILE ARCHIVED ON 23:34:54 Jan 24, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 02:33:33 May 13, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 443.638
  exclusion.robots: 0.158
  exclusion.robots.policy: 0.147
  RedisCDXSource: 2.1
  esindex: 0.011
  LoadShardBlock: 87.716 (3)
  PetaboxLoader3.datanode: 77.309 (4)
  CDXLines.iter: 77.042 (3)
  load_resource: 65.542
  PetaboxLoader3.resolve: 25.533
*/