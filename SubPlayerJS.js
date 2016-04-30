var timeStamp = 0 + ":" + 0 + ":" + 0 + "." + 0;
var subtitleArray = [];
var lineNumber = 0;
var currentTime = 0;
var interval;
var videoPlayerLoaded = false;
var subtitleIsSet = false;
var guiIsvisible = false;
var isPlaying = false;
var isFullScreen = false;
var video;


function LoadSubPlayerJS(file, subtitle, div, w, h) {

    if (!$("link[href='http://fonts.googleapis.com/icon?family=Material+Icons']").length){
        $('<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">').appendTo("head");
    }

    if(!videoPlayerLoaded){
        $(div).html()
    }
    
    video = vid;
    vid.addEventListener('loadedmetadata', function () {
        console.log("IN LIBRARY: " + video.duration);
        var max = video.duration;
        $('#control').html('<div id="allcontrols"><button onclick="startPlayVideo()">play</button><input onclick="onSeekBarClick()" type="range" id="seekbar" min="0" max="' + max + '" /><button onclick="makeFullScreen()">FullScreen</button></div>');
        $('#seekbar').val(0).css("width", "80%").css("right", "5px");

       
        $('.video-overlay').on("change mousemove", function () {
            if (!guiIsvisible) {
               
                guiIsvisible = true;
                console.log("GUI TOGGLE FIRST TIME");
                $('#allcontrols').fadeToggle();
                setTimeout(function () { $('#allcontrols').fadeToggle(); guiIsvisible = false; console.log("GUI TOGGLE SECOND TIME"); }, 4000);
            } 
        });


        $('#allcontrols').hide();
    });
  
}

function startPlayVideo() {
    if (!isPlaying) {
        video.play();
        isPlaying = true;
    } else {
        video.pause();
        isPlaying = false;
    }
}

function onSeekBarClick() {
    var currentPosition = $('#seekbar').val();
    video.currentTime = currentPosition;
    console.log(currentPosition);
}

function makeFullScreen() {
    var i = document.getElementsByClassName("outer-container")[0];

    // go full-screen
    if (i.requestFullscreen) {
        i.requestFullscreen();
    } else if (i.webkitRequestFullscreen) {
        i.webkitRequestFullscreen();
    } else if (i.mozRequestFullScreen) {
        i.mozRequestFullScreen();
    } else if (i.msRequestFullscreen) {
        i.msRequestFullscreen();
    }
    if (!isFullScreen) {
        $('#video').css({
            position: 'fixed', //or fixed depending on needs 
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
        });

        $('.video-overlay').css({
            position: 'fixed', //or fixed depending on needs 
            top: '85%',
            left: 0,
            height: '100%',
            width: '100%'
        });

        $('html, body').animate({
            scrollTop: $('#video').offset().top
        }, 'slow');
        isFullScreen = true;
    } else {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        $('#video').css({
            position: 'relative',
            width: '100%'
        });

        $('.video-overlay').css({
            position: 'absolute', //or fixed depending on needs 
            top: '85%',
            left: 0,
            height: '100%',
            width: '100%'
        });
        isFullScreen = false;
    }
   
}


function getSubtitle(subtitleurl) {

    $.ajax({
        url: subtitleurl,
        type: 'get',
        async: false,
        success: function (data) {
            var lines = data.split("\n");
            $.each(lines, function (key, line) {
                if (line.indexOf("Dialogue") > -1) {
                    var parts = line.split(',');
                    parts[parts.indexOf(parts[1])] = timeStampToSeconds(parts[1]);
                    parts[parts.indexOf(parts[2])] = timeStampToSeconds(parts[2]);
                    subtitleArray.push(parts);
                }
            });
            console.log("Succesfully read subtitle!");
            subtitleIsSet = true;
        },
        error: function (err) {
            subtitleIsSet = false;
        }
    });

    if (subtitleIsSet) {
        console.log("Starting timer");
        getTimeStamp();

        video.onseeking = function () {
            var index = 0;
            var time = video.currentTime;
            $.each(subtitleArray, function (curText) {
                var timeStart = curText[1];
                var timeEnd = curText[2];
                console.log("INDEX SEARCH ON TIMESTART: " + timeStart + ", TIMEEND: " + timeEnd + " WITH CURRENT TIME: " + curText);
                if (time > timeStart && time < timeEnd) {
                    console.log("FOUND SUB POS AT: " + index);
                    lineNumber = index;
                    return index;
                } else {
                    index++;
                }

            });
        }
    }
    return subtitleIsSet;
}

function resetSubtitle() {
    subtitleIsSet = false;
    subtitleArray = [];
    $('#subtitle').html('');
    try{
        clearInterval(interval);
    } catch (e) {
        console.log("no interval running");
    }
}
       
function timeStampToSeconds(timestamp) {
    var parts = timestamp.split(':');
    var hour = parts[0];
    var minute = parts[1];
    var second = parts[2];
    var totalSeconds = hour * 3600 + minute * 60 + parseInt(second);
    return totalSeconds;
}

function getTimeStamp() {
    interval = setInterval(function () {
        if (video.ended) {
            clearInterval(interval);
        }
        var curTimeSecond = vid.currentTime;
        currentTime = curTimeSecond;
        setTimeout(showSubtitle(curTimeSecond), 0);
    }, 100);
}

function showSubtitle(time) {
    
    try{
        var currentText = subtitleArray[lineNumber];
        var secondOfTimeStart = currentText[1];
        var secondOfTimeEnd = currentText[2];
       
        if (time < secondOfTimeStart) {
            $('#subtitle').html('');
        } else {

            if (time > secondOfTimeEnd) {
                lineNumber++;
            } else {
                var fullText = "";
                for (var i = 9; i < currentText.length; i++) {
                    fullText = fullText + "," + currentText[i];
                }
                $('#subtitle').html(fullText.substring(1).replace("\\N", "<br />"));
            }
        }
    } catch (e) {
        clearInterval(interval);
    }
    
}
        