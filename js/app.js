// error function

//news api

var news = function (data) {
    var searchTeam = $("#team-name").val() + " football club ";
    var dynamicURLMicro = "https://bingapis.azure-api.net/api/v5/news/search?q=european+football";

    $.ajax({
            _type: "News",
            readLink: dynamicURLMicro,
            totalEstimatedMatches: 1680000,
            key: "d8e91c36a55040dc9bfbfe1759c3a39a",
        })
        .done(function showResult(data) {
            console.log(data);
        })
}


//function to take team name and go to wikipedia

var wikiTeamSearch = function (data) {
    var searchTeam = $("#team-name").val() + " football club ";
    var dynamicURL = "https://en.wikipedia.org/w/api.php?action=parse&page=" + searchTeam + "&format=json&callback=?";
    $.ajax({
            url: dynamicURL,
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: 'jsonp'
        })
        .done(function showResult(data) {
            console.log(data);
            if (data.error) {
                //alert("no result");
                $('.errorMessage').text("No team information found! Try capitalising the first letter, or try another club.");
            } else {
                var html = "";
                $.each(data, function (index, value) {
                    if (value.displaytitle) {
                        html += '<p>' + value.displaytitle + '</p>';
                    }
                    //console.log(value);
                });
                //console.log(html);
                if (html != "") {
                    $('#wikiTeamTitle').html(html);
                }
            }
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            var errorElem = showError(error);
            //$('.errorMessage').append(errorElem);
        })
        .always(function () {
            //console.log("complete");
        });
};

// team sections function

var wikiTeamSections = function (data) {
    var searchTeam = $("#team-name").val();
    var dynamicURL = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + searchTeam + " F.C. " + "&callback=?";
    $.ajax({
            url: dynamicURL,
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: 'jsonp'
        })
        /*.done(function showResult(data) {
            //console.log("success");
            var html = "";
            $.each(data, function (index, value) {
                html += '<p>' + value.text + '</p>';
                //console.log(value.sections[1]);
            });
            $('#wikiSections').html(html);
        })*/
        .done(function (data, textStatus, jqXHR) {

            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);

            // remove links as they will not work
            blurb.find('a').each(function () {
                $(this).replaceWith($(this).html());
            });

            // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            $('#wikiSections').html($(blurb).find('p'));
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            var errorElem = showError(error);
            //$('.errorMessage').append(errorElem);
        })
        .always(function () {
            //console.log("complete");
        });
};


//function to get videos

var videoSearch = function (data) {
    //alert(query);
    var getResult = $("#team-name").val() + " football ";

    var html = "";

    $.getJSON("https://www.googleapis.com/youtube/v3/search", {
            part: "snippet",
            maxResults: 10,
            key: "AIzaSyAWblRjcTmS4TactzoaSQz-vhAQeXXb7as",
            q: getResult,
            type: "video"
        },
        function (data) {
            //console.log(data);
            if (data.pageInfo.totalResults == 0) {
                $('.errorMessage').html("Sorry there are no videos for your club, please try another one.");
            }
            displaySearchResults(data.items);
        });
    var displaySearchResults = function (videoArray) {
        var buildTheHtmlOutput = "";

        $.each(videoArray, function (videoArrayKey, videoArrayValue) {
            buildTheHtmlOutput += "<li>";
            buildTheHtmlOutput += "<p>" + videoArrayValue.snippet.title + "</p>"
            buildTheHtmlOutput += "<a href='https://www.youtube.com/watch?v=" + videoArrayValue.id.videoId + "' target='_blank'>";
            buildTheHtmlOutput += "<img src='" + videoArrayValue.snippet.thumbnails.high.url + "' width='100%'/>";
            buildTheHtmlOutput += "</a>";
            buildTheHtmlOutput += "</li>";

        });
        $(".video-container ul").html(buildTheHtmlOutput);
    };
};


//function to hide all the tabs

var hideTabs = function () {
    $('.tab-container').hide();
};

//function to show all the tabs when search is complete

var showTabs = function () {
    $('.tab-container').show();
};


$(function () {

    hideTabs();

    $('#submit').on("click", function (e) {
        e.preventDefault();
        wikiTeamSearch();
        wikiTeamSections();
        videoSearch();
        news();
        showTabs();
    });

});
