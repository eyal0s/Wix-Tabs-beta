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

     $('.wixtabs').click(function(e){
        e.preventDefault();
        toggle_tab();
    });

    $('#wixtabs .next').click( function(e){
        e.preventDefault();
        location.reload(); // Reloads the current document
    })

        $('#wixtabs .refresh').click( function(e){
        e.preventDefault();
        localStorage.clear();
        location.reload(); // Reloads the current document
    })
    
});

function showSite(sitesList){
    siteKey = sitesList.length - 1;
    obj = sitesList[siteKey];
    sitesList.splice(siteKey,1);
    localStorage['sitesList'] = JSON.stringify(sitesList);
    url = obj.url;
    $('iframe.startframe').attr('src', url);

    // Set app name
    if(obj.appname){
        appendItem("App", obj.appname);
    }

    // Set site type
    if(obj.sitetype){
        appendItem("Type", obj.sitetype);
    }

    // Set package
    // Removes Double appearance of strings as in "Free Free" and brackets
    if(obj.package){
        var packWithoutBrackets = obj.package.replace(/\(\)$/g, "");
        if ((obj.cycle.valueOf() != obj.package.valueOf())) {
            appendItem("Package", obj.cycle + " " + packWithoutBrackets);
        } else {
            appendItem("Package", packWithoutBrackets);
        }  
    }

    // Set template name
    var tempname = obj.tempname;
    if(tempname && enOnly(tempname)){
        appendItem("Template", tempname);
    }

    // Set country
    if(obj.country){
        var nat = obj.country.toLowerCase();
        $("<li><b>Made In:&nbsp;  </b></li>").append("<img src=\"blank.gif\" class=\"flag flag-" + nat + "\"" + " alt=\""  + nat + "\" title=\"" + getCountryName(obj.country) + "\"/>").appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
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
    var pattern = /[a-z]/;
    console.log(pattern.test(str));
    return pattern.test(str);

}
function appendItem(k, v){
        $("<li><b>" + k + ":&nbsp;  </b></li>").append(v).appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
        //
}

function toggle_tab(){
    $('#wixtabs .toggle').toggleClass('hide');
    $('.wixtabs').toggleClass('hide');
}



