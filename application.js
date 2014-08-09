$(document).ready(function(){

    // deletes local storage
    //localStorage.clear();

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
        toggle_tab();
    });

    //  $('.wixtabs').click(function(e){
    //     e.preventDefault();
    //     toggle_tab();
    // });

    $('#wixtabs .next').click( function(e){
        e.preventDefault();
        location.reload(); // Reloads the current document
    })

    $(".refresh").tooltip();
    $('#wixtabs .refresh').click( function(e){
        e.preventDefault();
        localStorage.clear();
        location.reload(); // Reloads the current document
    })


    
    
});

function showSite(sitesList){

    // Get a new site from the feed
    siteKey = sitesList.length - 1;
    obj = sitesList[siteKey];
    sitesList.splice(siteKey,1);
    localStorage['sitesList'] = JSON.stringify(sitesList);
    url = obj.url;
    $('iframe.startframe').attr('src', url);

    // Set date of creation
    if (obj.datecreated) {
        //appendItem("Before",dayCount(obj.datecreated));
        $("<li></li>").append("published " + dayCount(obj.datecreated) + " days ago" ).wrapInner(("<span>")).attr("id","date").appendTo('.wixtabs .description');
    };

    // Set app name
    if(obj.appname){
        if (obj.appname.toLowerCase().valueOf() == "no app".valueOf()) {
            appendItem("App", obj.appname.toLowerCase());
        } else {
            appendItem("App", obj.appname.toLowerCase() + " - " + obj.sitetype.toLowerCase());
        }
        
    };

    // Set package
    // Removes Double appearance of strings as in "Free Free" and brackets
    if(obj.package){
        var packWithoutBrackets = obj.package.replace(/\(\)$/g, "").toLowerCase();
        if ((obj.cycle.valueOf() != obj.package.valueOf())) {
            appendItem("Package", obj.cycle.toLowerCase() + " " + packWithoutBrackets);
        } else {
            appendItem("Package", packWithoutBrackets);
        }  
    }

    // Set template name
    var tempname = obj.tempname.toLowerCase();
    if(tempname && enOnly(tempname)){
        appendItem("Template", tempname);
    }

    // Set country
    if(obj.country){
        var nat = obj.country.toLowerCase();
        $("<li></li>").append("<img src=\"blank.gif\" class=\"flag flag-" + nat + "\"" + " alt=\""  + nat + "\" title=\"" + getCountryName(obj.country) + "\"/>").tooltip().appendTo('.wixtabs .description');
    }

    // REMOVE - Est. views
    /*if(true){
        $('<li><b>Estimated Views:&nbsp; ?</b></li>').appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
    }*/

    // Set sites url href
    if(obj.url){
        $li = $('<li></li>');
        $('<a></a>').text('Go To Site').attr('href', obj.url).attr('target','_BLANK').appendTo($li);
        $li.appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
    }

}

function enOnly(str){
    var pat = /[a-z]/;
    return pat.test(str);

};

function appendItem(k, v){
        $("<li><b>" + k + ":&nbsp;  </b></li>").append(v).addClass("item").appendTo('.wixtabs .description');
        //$("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
        //
};

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



