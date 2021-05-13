var agora = (function() {

    this.init = function(
            contextPath, root, origQuery, origSearchTerms,
            searchTextBox, currTabField, allSearchResults, timeout) {

        this.ajaxDisabled = false;

        this.contextPath = contextPath;
        this.agoraRoot = root;

        this.currTabField = $(currTabField);

        this.origQuery = origQuery;
        this.origSearchTerms = origSearchTerms;

        this.entityRootDiv = allSearchResults;

        this.theSearchBox = $(searchTextBox);

        //this.bindEntitiesSearch(searchTextBox, allSearchResults, timeout);

        var agora = this;

        /*
         * HTML to Javascript Bindings
         */
        (function(){
            $(".add-facet-link a, .view-chooser-panel .tabs a, .constrained-facet a, #info-root ul a")
                .not(".wb-all-archived-versions").on("click",function(evt){
                return agora.updateAjax(this);
            });

            $(".sorter a").on("click",function(evt){
                return agora.updateAjax(this, '#entity-results-container', 'entities');
            });

            $(".facetSort a").on("click", function(evt) {
                return agora.toggleFacetAlpha($(this));
            });

        })();

        /**
         *
         */
        function bindHistory() {
            var newState = History.getState(),
                jqXHR;

            if (!newState) {
              return;
            }

            var stateData = newState.data;

            if (!stateData || !stateData.url) {
                stateData.url = origURI + "?" + origQuery + "&" + $.param({queryType: "facets-entities"});
                stateData.rootDiv = allSearchResults;
                stateData.query = origQueryTerms;
            }

            var success = function(data)
            {
              $(stateData.rootDiv).html(data);
            }

            if (typeof stateData.query == "string") {
                $("#search-textbox").val(stateData.query);
            }

            jqXHR = $.get(stateData.url, null, success, "html");

            busy();
            jqXHR.complete(idle);

            return jqXHR;
        };

        function busy(){
            $("#ajax-status-message").fadeIn("slow");
        }

        function idle(){
            $("#ajax-status-message").fadeOut("slow");
        }

        History.Adapter.bind(window, 'statechange', bindHistory);

        this.facetListId = "#facet-list";
        this.facetPageSize = 10;
        this.facetMin = 5;
        this.moreLink = "#more";
        this.lessLink = "#less";

        if (!this.agoraRoot){
            this.agoraRoot = "/all";
        }
    }

    this.updateWaybackLinks = function(selector, accessPoint, root)
    {
        $(selector).each(function(evt){

            var url = $(this).attr("prefix") + "query?queryType=range&url=" + $(this).attr("url");

            if ($.browser.msie && window.XDomainRequest) {

                var xdr = new XDomainRequest();
                  xdr.open("get", url);

                  var waybackCaptureInfoElement = $(this);

                  xdr.onload = function() {
                      waybackCaptureInfoElement.html(xdr.responseText);
                  };

                  xdr.send();

            } else {
              $(this).load(url);
            }


        });
    }

    var setQaUrl = function(url) {
        var qa = window.location.origin.match('qa-archive-it');
        if (qa) {
            url = url.replace('partner.archive', 'partner.qa-archive');
        }
        return url;
    };

    this.updateVideoLinks = function(selector, accessPoint, root) {
        accessPoint = setQaUrl(accessPoint);
        var account = $($(selector)[0]).attr('account');
        if (!account) {
            return;
        }
        var url = accessPoint + account + '?__count=id&__group=seed&is_test_crawl=0&seed__in=';
        var ids = $(selector).map(function (_, entry) {
            return $(entry).attr('id');
        });
        url += ids.toArray().join(',');
        $.get(url, function (data) {
            var counts = {};
            if (!data || !data.groups) {
                return;
            }
            $.each(data.groups, function(_, group) {
                counts[group.seed_id] = group.id__count;
            });
            $(selector).each(function(evt){
                var id = $(this).attr('id');
                if (counts[id]) {
                    $(this).html('Videos: <a href="?q=' + $(this).attr('url') + '&show=SeedVideos&is_test_crawl=0&fc=seedId:' + id + '">' + counts[id] + ' Videos Captured</a>');
                } else {
                    $(this).html('');
                }
            });
        });
    };


    this.loadPageVideos = function(selector, accessPoint, root) {
        if (agora.theState.tab !== 'PageVideos') {
            return;
        }
        var params = {
            containing_page_url: agora.theState.query,
        };
        this.displayVideoList(selector, accessPoint, params);
    };

    this.loadSeedVideos = function(selector, accessPoint, root) {
        if (agora.theState.tab !== 'SeedVideos') {
            return;
        }
        var params = {
            seed_id: agora.theState.fc.match(/\d+/)[0],
        };
        this.displayVideoList(selector, accessPoint, params);
    };

    this.displayVideoList = function (selector, accessPoint, params) {
        accessPoint = setQaUrl(accessPoint);
        var pageSize = 100;
        var account = $('#orgId').attr('org-id');
        params.limit = pageSize;
        params.offset = (agora.theState.page - 1) * pageSize;
        params.is_test_crawl = 0;
        var url = accessPoint + account + '?' + $.param(params);

        var formatBytes = function (bytes) {
            var sizes = ['bytes', 'KB', 'MB', 'GB'];
            var position = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, position)) + ' ' + sizes[position];
        };

        $.get(url, function (data, _, jqXHR) {
            if (!data.length) {
                $(selector).html('<p>No results found for the terms <b>' + agora.theState.query + '</b></p>');
                return;
            }

            $(selector).html('');
            var waybackUrl = $(selector).attr('wayback') + '/' + agora.theState.waybackAccessPoint;
            $.each(data, function(_, video_entry) {
                var date = new Date(video_entry.video_timestamp);
                var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                $(selector).append('<div class="result-item"><p class="url">Video URL: ' +
                    '<a href="' + waybackUrl + '/*/' + video_entry.video_url + '">' +
                    video_entry.video_url + '</a></p>' +
                    '<p>Archived From URL: <a href="' + waybackUrl + '/*/' + video_entry.containing_page_url + '">' + video_entry.containing_page_url +
                    '</a></p><h3><a href="/player?url=' + video_entry.video_url + '">Watch</a></h3>' +
                    '<p class="captureInfo">Videos Captured&nbsp; on <a href="' + waybackUrl + '/' + video_entry.video_timestamp + '/' + video_entry.video_url +
                    '">' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + '</a>' +
                    '</p><p>Type: ' + video_entry.video_mimetype + '</p>' +
                    '<p>Size: ' + formatBytes(video_entry.video_size) + '</p></div>');
            });

            // add pagination controls
            var total_length = jqXHR.getResponseHeader('Total-Row-Count');
            $('#videoCount').html(total_length);
            var url = window.location.href;
            var pages = Math.ceil(total_length / params.limit);
            var pagination_html = '<div class="paginator"><p>';
            if (agora.theState.page > 1) {
                var prev_url = url;
                if (url.match(/page=(\d+)/)) {
                    prev_url = prev_url.replace(/page=(\d+)/, 'page=' + (agora.theState.page - 1));
                } else {
                    prev_url += '&page=' +(agora.theState.page - 1);
                }
                pagination_html += '<a href="' + prev_url + '" id="pagePrev">◄ Prev Page</a>';
            }
            pagination_html += 'Page ' + agora.theState.page + ' of ' + pages + '  (' + total_length + ' Total Results)';
            if (agora.theState.page < pages) {
                var next_url = url;
                if (url.match(/page=(\d+)/)) {
                    next_url = next_url.replace(/page=(\d+)/, 'page=' + (agora.theState.page + 1));
                } else {
                    next_url += '&page=' +(agora.theState.page + 1);
                }
                pagination_html += '<a href="' + next_url + '" id="pageNext">Next Page ►</a>';
            }
            pagination_html += '</p></div>';
            pagination_selector = $('.paginator');
            if (pagination_selector) {
                pagination_selector.html(pagination_html);
            } else {
                $(selector).append(pagination_html);
            }
        });
    };


    this.setState = function(state)
    {
//        var currRoot = null;
//
//        if (this.theState != undefined) {
//            currRoot = this.theState.rootUrl;
//        }

        this.theState = state;

//        if (this.theState.rootUrl == currRoot) {
//            return;
//        }
//
//        var urlRoot = $("#url-info");
//
//        if (this.theState.rootUrl) {
//            this.checkWaybackUrl(urlRoot, this.theState.rootUrl, this.theState.waybackAccessPoint);
//            //this.checkWaybackUrl(this.theState.rootUrlWaybackQuery);
//        } else {
//            $(urlRoot).hide();
//        }
    }

    // Facets
    //===================

    function getFacetQuery(facet, value)
    {
        return "f_" + facet + ":" + value;
    }

    function makeFacetParams(facet, start, num, alpha)
    {
        return {
            "queryType" : "facets",
            "ajaxFacet" : facet,
            "foffset" : getFacetQuery(facet, start),
            "flimit" : getFacetQuery(facet, num),
            "falpha" : getFacetQuery(facet, alpha)
        };
    }

    this.toggleFacetAlpha = function(facetLink)
    {
        if (this.ajaxDisabled) {
            return true;
        }

        var ul = $(facetLink).closest('ul');
        $("li", ul).removeClass('active');
        $(facetLink).parent().addClass('active');

        var rootDiv = $(ul).closest('.facet');

        var facet = $(rootDiv).attr('id');

        var facetListId = this.facetListId;

        var numFacets = $(facetListId, rootDiv).children().length;

        var newAlpha = $(facetLink).attr('name') === 'alpha';

        var currAlpha = $(rootDiv).attr('alpha') === "true";

        if (newAlpha != undefined) {
            if (newAlpha === currAlpha) {
                return false;
            }
        } else {
            newAlpha = !currAlpha;
        }

        var params = makeFacetParams(facet, 0, numFacets, newAlpha);

        function success(facets)
        {
            $(facetListId, rootDiv).empty();
            $(facets).appendTo($(facetListId, rootDiv));
            $(rootDiv).attr('alpha', newAlpha);
        }

        $.get(this.theState.url, params, success, "html");

        return false;
    }

    this.getMoreFacets = function(facet, rootDiv)
    {
        if (this.ajaxDisabled) {
            return true;
        }

        var facetListId = this.facetListId;
        var facetPageSize = this.facetPageSize;
        var moreLink = this.moreLink;
        var lessLink = this.lessLink;

        var numFacets = $(facetListId, rootDiv).children().length;

        var isAlpha = $(rootDiv).attr('alpha');

        var params = makeFacetParams(facet, numFacets, facetPageSize, isAlpha);

        function success(facets)
        {
            $(facets).appendTo($(facetListId, rootDiv));

            if ($(facets).length < facetPageSize) {
                $(moreLink, rootDiv).hide();
            }

            $(lessLink, rootDiv).show();
        }

        $.get(this.theState.url, params, success, "html");

        return false;
    }


    this.getLessFacets = function(facet, rootDiv)
    {
        var facetListId = this.facetListId;
        var facetPageSize = this.facetPageSize;
        var facetMin = this.facetMin;

        var numFacets = $(facetListId, rootDiv).children().length;

        if (numFacets <= facetMin) {
            $(this.moreLink, rootDiv).hide();
            return false;
        }

        var numToRemove = Math.min(facetPageSize, (numFacets - facetMin));

        $(facetListId + " > li", rootDiv).slice(-numToRemove).remove();

        var cookie = "agora.flimit.f_" + facet;
        $.removeCookie(cookie)
        $.cookie(cookie, (numFacets - numToRemove));

        if ((numFacets - numToRemove) <= facetMin) {
            $(this.lessLink, rootDiv).hide();
        }

        $(this.moreLink, rootDiv).show();

        return false;
    }

    this.updateAjax = function(link, rootDiv, queryType, query) {
        var href = $(link).attr("href");

        if (!rootDiv) {
            rootDiv = this.entityRootDiv;
        }

        if (!queryType) {
            queryType = "facets-entities";
        }

        if (!query) {
            query = this.getSearchText();
        }

        return this.pushNewState(href, queryType, rootDiv, query);
    }

    // Entities
    //======================

    this.getSearchText = function() {
        return $(this.theSearchBox).val();
    }

    this.updateSearch = function(searchBox, rootDiv)
    {
        return this.loadEntitiesHtml(rootDiv, $(searchBox).val());
    }

    this.loadEntitiesHtml = function(rootDiv, query) {
        var params = {"q" : query,
                      "page" : 1,
                      "show" : this.theState.tab};

        var queryUrl = this.agoraRoot + "?" + $.param(params);

        return this.pushNewState(queryUrl, "facets-entities", rootDiv, query);
    }

    this.clearSearch = function(obj)
    {
        this.theSearchBox.val("");
        return this.updateAjax(obj);
    }

    this.autoupdateEntities = function()
    {
        if (this.theSearchBox) {
            this.loadEntitiesHtml(this.entityRootDiv, this.theSearchBox.val());
        }
    }

    var updTimer = null;

    this.bindEntitiesSearch = function(searchBox, rootDiv, timeout) {

        var agora = this;

        var autoUpdateThunk = function()
        {
            agora.autoupdateEntities();
        }

        this.theSearchBox.keyup(function()
        {
            if (updTimer) {
                clearTimeout(updTimer);
                updTimer = null;
            }

            updTimer = setTimeout(autoUpdateThunk, timeout);
        });
    }

    // Full Text
    //========================

    this.getFullTextHtml = function(callback){
        var jqXHR =  $.ajax($.extend(callback,{url:this.agoraRoot+"/fulltext", data: (!callback.query ? this.currQuery : callback.query.substring(1)), dataType:"html"}));

        jqXHR.error(function(jqXHR, textStatus, errorThrown){
            callback.success(jqXHR.responseText);
        });

        return jqXHR;
    };

    //setup jquery ajax
    $.ajaxSetup({
        complete: function(jqxhr, textStatus){
            window.status = "http request completed: " + textStatus;
        },

        error: function(jqXHR, textStatus, errorThrown){
            window.status = textStatus;
        }

    });

    // Wayback Results
    //==================================

    this.toggleDiv = function(theDiv, textObj, showText, hideText)
    {
        $(theDiv).toggle();

        if ($(theDiv).is(":visible")) {
            $(textObj).text(hideText);
        } else {
            $(textObj).text(showText);
        }

        return false;
    }

    this.checkWaybackUrl = function(resultsDiv, url, collId)
    {
        if (!collId || !url) {
            return false;
        }

        params = {
            "collId" : collId,
            "url": url
        }

        success = function(data)
        {
            $(resultsDiv).html(data);
            $(resultsDiv).show();
        }

        var agoraUrl = "/ait-agora/checkWayback";

        $.get(agoraUrl, params, success, "html");
    }

    this.loadWaybackResults = function(rootDiv, collId, url)
    {
        var resultsDiv = $("#results", rootDiv);
        var toggleDiv = $("#results-panel", rootDiv);

        if ($(resultsDiv).children().size() > 0) {
            $(toggleDiv).toggle();
            return false;
        }

        if (!collId || !url) {
            return false;
        }

        params = {
            "collId" : collId,
            "url": url
        }

        success = function(data)
        {
            $(resultsDiv).html(data);
        }

        var agoraUrl = "/ait-agora/wayback";

        $.get(agoraUrl, params, success, "html");

        $(toggleDiv).toggle();

        return false;
    }

    // Paging
    //============================

    this.pushNewState = function(queryUrl, queryType, rootDiv, query)
    {
        if (this.ajaxDisabled) {
            return true;
      }

        fullUrl = queryUrl + "&queryType=" + queryType;

        var newState = { "url" : fullUrl,
                         "rootDiv" : rootDiv,
                         "query" : query};

        History.pushState(newState, null, queryUrl);

        return false;
    }

    this.writeLocalDateString = function(millis)
    {
        var date = new Date(0);
        date.setUTCMilliseconds(millis);
        document.write(date.toLocaleString());
    }

    // Related Items
    //==================================

    function injectRelatedValues(component_id, values)
    {
        var anchor = $("#"+component_id+" .related-anchor");
        anchor.attr("href", values.display_url);
        anchor.html(values.title);
        $("#"+component_id+" .related-extent").html(values.extent);
        $("#"+component_id+" .loading").hide();
        $("#"+component_id+" .loaded").show();
    }

    this.loadRelated = function(endpoint, component_id)
    {
        $.ajax(endpoint, {
          dataType: "json",
          success: function(data, textStatus, jqXHR) {
            injectRelatedValues(component_id, data);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            $("#"+component_id+" .loading").hide();
            $("#"+component_id+" .load-failed").show();
          }
        });
    }

    //Sorting
    //======================================

    return {
        init : this.init,
        getFacetJson : this.getFacetJson,
        getFacetHtml : this.getFacetHtml,

        loadEntitiesHtml : this.loadEntitiesHtml,
        autoupdateEntities : this.autoupdateEntities,

        updateSearch : this.updateSearch,
        clearSearch : this.clearSearch,

        updateAjax : this.updateAjax,

        bindFacets : this.bindFacets,
        bindEntitiesSearch : this.bindEntitiesSearch,

        loadWaybackResults : this.loadWaybackResults,
        checkWaybackUrl : this.checkWaybackUrl,

        pushNewState : this.pushNewState,

        updateWaybackLinks : this.updateWaybackLinks,
        updateVideoLinks : this.updateVideoLinks,
        loadPageVideos : this.loadPageVideos,
        loadSeedVideos : this.loadSeedVideos,
        displayVideoList : this.displayVideoList,
        setState : this.setState,

        getSearchText : this.getSearchText,

        toggleFacetAlpha : this.toggleFacetAlpha,
        getMoreFacets : this.getMoreFacets,
        getLessFacets : this.getLessFacets,

        toggleDiv : this.toggleDiv,

        writeLocalDateString : this.writeLocalDateString,

        loadRelated : this.loadRelated,

        debug: function(s){ if(console && console.debug) window.console.debug(s);},
        log: function(s){ if(console && console.log) window.console.log(s);},
        getFullTextHtml: this.getFullTextHtml
    };

}());

var FeaturedItem = function(rootPath, itemType, constraint)
{
    this.rootPath = rootPath;
    this.itemType = itemType.toLowerCase();
    this.tagList = null;

    if (!constraint) {
        this.constraint = "";
    } else {
        this.constraint = "?" + constraint;
    }

    createSelectItem = function(obj)
    {
        return function(event, ui) {
            window.location.href = obj.rootPath + obj.itemType + "/" + ui.item.id;
        }
    }

    this.loadTagList = function(autoReq, autoRep)
    {
        var obj = this;

        var success = function(data)
        {
            obj.tagList = data.entityPairList;
            if (autoReq && autoRep) {
                filterResults(obj, autoReq, autoRep);
            }
        }

        $.getJSON(this.rootPath + "list/" + this.itemType + ".json" + this.constraint, null, success);
    }

    filterResults = function(obj, request, response)
    {
        var matches = $.map( obj.tagList, function(tag) {
            if (tag.value && tag.value.toUpperCase().indexOf(request.term.toUpperCase()) >= 0 ) {
                return tag;
            }
        });

        response(matches);
    }

    createAutocompleter = function(obj)
    {
        return function handleAutocomplete( request, response ) {

            if (!obj.tagList) {
                obj.loadTagList(request, response);
                return;
            }

            filterResults(obj, request, response);
        }
    }

    this.init = function(textbox)
    {
        $(textbox).autocomplete({
                source: createAutocompleter(this),
                select: createSelectItem(this),
                minLength: 1
        });
    }
}
