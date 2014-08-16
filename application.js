/*By Eyal Benezra*/    

// analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-53672371-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(document).ready(function(){

    var feed = "https://dl.dropboxusercontent.com/u/54065586/feed.json";
    var sitesList = localStorage.sitesList;
    
    // case version was updated. get new sites from the feed
    if (typeof localStorage.refreshFlag == "undefined") {
        refreshCache();
        localStorage.refreshFlag = false;
    }
    
    if(typeof sitesList != "undefined" && sitesList.length > 0 && JSON.parse(sitesList).length > 0) {
        showSite( JSON.parse(sitesList) );
    } else {
        $.get(feed, function(obj){
           localStorage.sitesList = JSON.stringify(obj);
           showSite(JSON.parse(obj));
        });
    }

    $('#wixtabs .toggle').click(function(e){
        e.preventDefault();
         _gaq.push(['_trackEvent', "event", "toggle"]);
        toggle_tab();
    });

    $('#wixtabs .next').click( function(e){
        e.preventDefault();
         _gaq.push(['_trackEvent', "event", "next"]);
        location.reload(); // Reloads the current document
       
    });

    $(".refresh").tooltip();
    $('#wixtabs .refresh').click( function(e){
        e.preventDefault();
        refreshCache();
        location.reload(); // Reloads the current document
    });

    $(".contact").tooltip();  
    
});


function showSite(sitesList){

    // get a new site object from the feed
    siteKey = Math.round((sitesList.length - 1) * Math.random());
    obj = sitesList[siteKey];
    sitesList.splice(siteKey,1);
    localStorage.sitesList = JSON.stringify(sitesList);
    url = obj.url;

    // display the chosen site
    $('iframe.startframe').attr('src', url);
    _gaq.push(['_trackEvent', "event", 'newtab']);


/* set toolbar variables */

    // set app name
    if(obj['app name']){
        if (obj['app name'].toLowerCase().valueOf() == "no app".valueOf()) {
            appendItem("App", obj['app name'].toLowerCase(), "app");
        } else {
            appendItem("App", obj['app name'].toLowerCase() + " - " + obj['site type'].toLowerCase(), "app");
        }
        
    }

    // set package
    // removes double appearance of strings as in "Free Free" and brackets
    if(obj.package){
        var packWithoutBrackets = obj.package.replace(/\(\)$/g, "").toLowerCase();
        if ((obj.cycle.valueOf() != obj.package.valueOf())) {
            appendItem("Package", packWithoutBrackets + " paid " + obj.cycle.toLowerCase(), "pack");
        } else {
            appendItem("Package", packWithoutBrackets, "pack");
        }  
    }

    // set template name
    if(obj['temp name']){
        var tempname = obj['temp name'].toLowerCase();
        if (enOnly(tempname)) {
            appendItem("Template", tempname, "temp");
        }
        
    }

    // set date created
    if (obj['date created']) {
        appendItem("Published", dayCount(obj['date created']) + " days ago");
     }

    // set country
    if(obj.country){
        $("<li><b>Made In &nbsp;</b></li>").append("<img class=\"flag\" src=\"layout/flags/" + getCountryName(obj.country) + ".png\""  + "title=\"" + getCountryName(obj.country) + "\"/>").tooltip().appendTo('.wixtabs .description');
    }

    // set sites url href
    if(obj.url){
        $li = $('<li></li>');
        $('<a></a>').text('site link').attr('href', obj.url).attr('target','_BLANK').appendTo($li);
        $li.appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
    }

}

// assert true if letters are latin
function enOnly(str){
    var pat = /[a-z]/;
    return pat.test(str);

}

// add key, value and id to the description container
function appendItem(k, v, id){
        $("<li><b>" + k + "</b><br></li>").append(v).attr("id",id).appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
}

// returns the amount of time passed since date
function dayCount(date) {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(date);
    var secondDate = new Date();

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}

// toolbar toggle
function toggle_tab(){
    $('#wixtabs .toggle').toggleClass('hide');
    $('.wixtabs').toggleClass('hide');
}

// refresh site cache when updating versions
function refreshCache(){
    localStorage.clear();
    console.log("Wix tabs site cache was refreshed");
}

