/*By Eyal Benezra
ver 0.4 24/12/14
*/
// set chrome button
// var isOn;
// chrome.browserAction.getBadgeText({}, function(data) {
//     if (data == 'off'){
//         isOn = false;
//     } else {
//        isOn = true;
//     }
// });
// chrome.browserAction.onClicked.addListener(function() {
//     chrome.browserAction.getBadgeText({}, function(data) {
//         var details;
//         if (data == 'off') {
//             details = {
//                 text: "on"
//             };

//         } else {
//             details = {
//                 text: "off"
//             };
//             isOn = false;
//             alert("!");
//         }
//         chrome.browserAction.setBadgeText(details);
//     });
// });

//if (isOn) {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-53672371-1']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
    $(document).ready(function() {
        /* If the sites list is empty get a new list from the feed*/
        var feed = "https://dl.dropboxusercontent.com/u/54065586/feeder.json";

        //get the site type value from localStorage and set site selector
        var siteType = localStorage.siteType;
        if (siteType == "undefined") {
          siteType = 1;
          localstorage.siteType = 1;
        }
        $("#selectId").val(siteType);
        // change site type
        if(siteType == 2){ //one app
          feed = "https://dl.dropboxusercontent.com/u/54065586/feeder-one.json";
        }

        var sitesList = localStorage.wixSitesList;
        if (typeof sitesList != "undefined" && sitesList.length > 0 && JSON.parse(sitesList).length > 0) {
            showSite(JSON.parse(sitesList));
        } else {
            $.get(feed, function(obj) {
                sitesList = JSON.stringify(obj);
                showSite(JSON.parse(obj));
            });
        }
        // set click handlers
        $('#wixtabs .toggle').click(function(e) {
            e.preventDefault();
            toggle_tab();
        });
        $('#wixtabs #mobile').click(function(e) {
            e.preventDefault();
            if (!$(this).hasClass("active")) {
                $('#wixtabs #desktop').removeClass("active");
                $('.startframe').attr('src', changeToMobile($('.startframe').attr('src')));
            }
        });
        //
        $('#wixtabs #desktop').click(function(e) {
            e.preventDefault();
            if (!$(this).hasClass("active")) {
                $('#wixtabs #mobile').removeClass("active");
                $('.startframe').attr('src', changeToDesktp($('.startframe').attr('src')));
            }
        });
        $('#wixtabs .next').click(function(e) {
            e.preventDefault();
            location.reload(); // Reloads the current document
        });
        $('#wixtabs .refresh').click(function(e) {
            e.preventDefault();
            //refreshCache();
            localStorage.removeItem("wixSitesList");
            location.reload(); // Reloads the current document
        });
        // init bootstrap
        $(".refresh").tooltip();
        $(".contact").tooltip();
        $('.btn').button();

        // add announcment
        //$('.news').append("<p>WixTabs is back from the de</p>");

        $( "#selectId" ).change(function() {
            localStorage.siteType = this.value;
            localStorage.removeItem("wixSitesList");
            location.reload(); // Reloads the current document

        });

    });
//}

function showSite(sitesList) {
    obj = sitesList[sitesList.length - 1];
    sitesList.splice(sitesList.length - 1, 1);
    localStorage.wixSitesList = JSON.stringify(sitesList);
    var url;
    if (obj['Url']) {
        url = obj['Url'];
    }
    if (obj['Site Url']) {
        url = obj['Site Url'];
    }
    if (obj['PREVIEW']) {
      url = obj['PREVIEW'];
    }

    if (assertMobileViewMode(url)) {
        url = changeToDesktp(url);
    }
    // display the chosen site in the iframe
    $('iframe.startframe').attr('src', url);
    _gaq.push(['_trackEvent', "event", 'newtab']);
    /* set toolbar variables */
    // set app name
    if (obj['App Name']) {
        if (obj['App Name'].toLowerCase().valueOf() == "no app".valueOf()) {
            appendItem("App", obj['App Name'].toLowerCase(), "app");
        } else {
            appendItem("App", obj['App Name'].toLowerCase() + " - " + obj['Site Type'].toLowerCase(), "app");
        }
    }
    // set package
    // removes double appearance of strings as in "Free Free" and brackets
    if (obj['Package']) {
        var packWithoutBrackets = obj['Package'].replace(/\(\)$/g, "").toLowerCase();
        if ((obj['Cycle'].valueOf() != obj['Package'].valueOf())) {
            appendItem("Package", packWithoutBrackets + " paid " + obj['Cycle'].toLowerCase(), "pack");
        } else {
            appendItem("Package", packWithoutBrackets, "pack");
        }
    }
    // set template name
    if (obj['Temp Name']) {
        var tempname = obj['Temp Name'].toLowerCase();
        if (enOnly(tempname)) {
            appendItem("Template", tempname, "temp");
        }
    }
    // set date created
    if (obj['Date Created']) {
        appendItem("Published", dayCount(obj['Date Created']) + " days ago");
    }
    // set country
    if (obj['Country']) {
        var flag = $("<img class=\"flag\" src=\"layout/flags/" + getCountryName(obj['Country']) + ".png\"" + "\"/>").tooltip({
            title: getCountryName(obj['Country'])
        });
        $("<li><b>Made In &nbsp;</b></li>").append(flag).appendTo('.wixtabs .description');
    }
    // set site url href
    if (obj['Url']) {
        $li = $('<li></li>');
        $('<a></a>').text('Explore Site').attr('href', $('.startframe').attr('src')).appendTo($li);
        //$('<a></a>').text('site link').attr('href', obj['Url']).attr('target', '_BLANK').appendTo($li);
        $li.appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
    }

    /* stuff to handle one app data*/
    if (obj['View Count']){
      var num = obj['View Count'];
      $li = $('<li></li>');
      $("<li><b>App Views &nbsp;</b></li>").append(num).appendTo('.wixtabs .description');
    }
    if (obj['Stores']){
      var num = obj['Stores'];
      $li = $('<li></li>');
      $("<li><b>Stores Views &nbsp;</b></li>").append(num).appendTo('.wixtabs .description');
    }
    if (obj['Hotels']){
      var num = obj['Hotels'];
      $li = $('<li></li>');
      $("<li><b>Hotels Views &nbsp;</b></li>").append(num).appendTo('.wixtabs .description');
    }
    if (obj['Blog']){
      var num = obj['Blog'];
      $li = $('<li></li>');
      $("<li><b>Blog Views &nbsp;</b></li>").append(num).appendTo('.wixtabs .description');
    }
    if (obj['Visitors Viewes']){
      var num = obj['View Count'];
      $li = $('<li></li>');
      $("<li><b>Visitors Views &nbsp;</b></li>").append(num).appendTo('.wixtabs .description');
    }

    if (obj['Verticals']){
      var val = obj['Verticals'];
      $li = $('<li></li>');
      $("<li><b>Vertical &nbsp;</b></li>").append(val).appendTo('.wixtabs .description');
    }

    if (obj['Premium']){
      var val = obj['Premium'];
      if (val = "yes") {
        $li = $('<li></li>').addClass("premium");
        $("<li><b>Premium &nbsp;</b></li>").addClass("premium").appendTo('.wixtabs .description');
      }
    }

    if (obj['PREVIEW']) {
        $li = $('<li></li>');
        $('<a></a>').text('Explore Site').attr('href', $('.startframe').attr('src')).appendTo($li);
        //$('<a></a>').text('site link').attr('href', obj['Url']).attr('target', '_BLANK').appendTo($li);
        $li.appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
    }


    // set view mode - mobile / desktop
    //setViewMode(obj['Url']);
    setViewMode($('.startframe').attr('src'));
}

// assert true if letters are latin
function enOnly(str) {
    var pat = /[a-z]/;
    return pat.test(str);
}
// add key, value and id to the description container
function appendItem(k, v, id) {
    $("<li><b>" + k + "</b><br></li>").append(v).attr("id", id).appendTo('.wixtabs .description');
    $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
}
// returns the amount of time passed since date param
function dayCount(date) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(date);
    var secondDate = new Date();
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
}

// toolbar toggle
function toggle_tab() {
    $('.wixtabs').toggleClass('hide');
    $('#toggle_open').toggleClass('hide');
}
// refresh site cache at the local storage
function refreshCache() {
    localStorage.clear();
    console.log("Wix tabs site cache was refreshed");
}
// returns true case mobile view
function assertMobileViewMode(url) {
    var pat = /\?(showMobileView)=(true)/;
    return pat.test(url);
}
// adds a mobile=true query parameter
function changeToMobile(url) {
    return url + "?showMobileView=true";
}
// remove the mobile query param
function changeToDesktp(url) {
    return url.replace(/\?showMobileView=true/, "");
}
// ca
function setViewMode(url) {
    if (assertMobileViewMode(url)) {
        $('#wixtabs #mobile').addClass("active");
    } else {
        $('#wixtabs #desktop').addClass("active");
    }
}
