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

    var feed = "https://dl.dropboxusercontent.com/u/54065586/feed.html";
    var sitesList = localStorage['sitesList'];

    if(typeof sitesList != "undefined" && sitesList.length > 0 && JSON.parse(sitesList).length > 0 ) {
        showSite( JSON.parse(sitesList) );
    } else {
        $.get(feed, function(obj){
            sitesList = obj.substring(obj.indexOf("<pre style=\"word-wrap: break-word; white-space: pre-wrap;\">") + 62, obj.indexOf("</pre>"));
           localStorage['sitesList'] = JSON.stringify(sitesList);
           showSite(JSON.parse(sitesList));
        });
    }

    $('#wixtabs .toggle').click(function(e){
        e.preventDefault();
         _gaq.push(['_trackEvent', "event", "toggle"]);
        toggle_tab();
    });

    //  $('.wixtabs').click(function(e){
    //     e.preventDefault();
    //     toggle_tab();
    // });

    $('#wixtabs .next').click( function(e){
        e.preventDefault();
         _gaq.push(['_trackEvent', "event", "next"]);
        location.reload(); // Reloads the current document
       
    })

    $(".refresh").tooltip();
    $('#wixtabs .refresh').click( function(e){
        e.preventDefault();
        localStorage.clear();
        location.reload(); // Reloads the current document
    })

    $(".contact").tooltip();  
    
});


function showSite(sitesList){

    // get a new site object from the feed

    siteKey = Math.round((sitesList.length - 1) * Math.random());
    console.log("Debug - picked " + siteKey);
    console.log("Debug - left " + sitesList.length - 1);
    obj = sitesList[siteKey];
    sitesList.splice(siteKey,1);
    localStorage['sitesList'] = JSON.stringify(sitesList);
    url = obj.url;
    $('iframe.startframe').attr('src', url);
    _gaq.push(['_trackEvent', "event", 'newtab']);



    // set apps name
    if(obj.appname){
        if (obj.appname.toLowerCase().valueOf() == "no app".valueOf()) {
            appendItem("App", obj.appname.toLowerCase(), "app");
        } else {
            appendItem("App", obj.appname.toLowerCase() + " - " + obj.sitetype.toLowerCase(), "app");
        }
        
    };

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
    var tempname = obj.tempname.toLowerCase();
    if(tempname && enOnly(tempname)){
        appendItem("Template", tempname, "temp");
    }


        // set date created
    if (obj.datecreated) {
        // $li = $('<li></li>').text("published " + dayCount(obj.datecreated) + " days ago");
        // $li.appendTo('.wixtabs .description');
        appendItem("Published", dayCount(obj.datecreated) + " days ago");
     };

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

};

// add key, value and id to the description container
function appendItem(k, v, id){
        $("<li><b>" + k + "</b><br></li>").append(v).attr("id",id).appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
        //
};

// returns the amount of time passed since date
function dayCount(date) {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(date);
    var secondDate = new Date();

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
};


function toggle_tab(){
    $('#wixtabs .toggle').toggleClass('hide');
    $('.wixtabs').toggleClass('hide');
}


