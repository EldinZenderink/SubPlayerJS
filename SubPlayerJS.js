var timeStamp = 0 + ":" + 0 + ":" + 0 + "." + 0;
var previousVidWidth;
var previousVidHeight;
var lineNumber = 0;
var currentTime = 0;
var interval;
var videoPlayerLoaded = false;
var subtitleIsSet = false;
var guiIsvisible = false;
var isPlaying = false;
var isFullScreen = false;
var subtitleArray = [];
var isSeeking = false;
var video;
try{
    $('body').append("");
} catch (e){
    console.log("SubPlayer: jQuery not in header, appending now!");
    
    loadScript("https://code.jquery.com/jquery-2.1.1.min.js", function(){ 
        while(true){
            try{
                $('body').append("");
                break;
            } catch(e){
                console.log('not loaded yet');
            }
        }});

}

//loads video
function LoadSubPlayerJS(file, subtitle, div, w, h) {


    

    resetSubtitle();

    var vidwidth = 0;
    var vidheight = 0;

    if(w != null && w != "" && w != 0){
        vidwidth = w;
    } else {
        vidwidth = "100%";
    }

    if(h != null && h != "" && h != 0){
        vidheight = h;
    } else {
        vidheight = "100%";
    }

    if(!videoPlayerLoaded || previousVidHeight != h || previousVidWidth != w){
      
        if (!$("link[href='http://fonts.googleapis.com/icon?family=Material+Icons']").length){ 
            loadjscssfile("http://fonts.googleapis.com/icon?family=Material+Icons", "css");
        }
        if (!$("link[href='https://rawgit.com/EldinZenderink/SubPlayerJS/master/SubPlayerJS.css']").length){
            loadjscssfile("https://rawgit.com/EldinZenderink/SubPlayerJS/master/SubPlayerJS.css", "css");
        }
        if (!$("link[href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css']").length){
            loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css", "css");
        }
        $(div).html('\
             <div class="outer-container-SPJS ">\
                <div class="inner-container-SPJS ">\
                    <div class="video-overlay-SPJS" id="subtitle"><br /></div>\
                    <div style="min-width: 100%; min-height: 100%;" class="control-SPJS"></div>\
                    <video id="SubPlayerVideo" width="' + vidwidth + '" height="' + vidheight + '">\
                    <source id="videoSource" src="">\
                        Your browser does not support HTML5 video.\
                    </video>\
                </div>\
            </div>'
        );
        videoPlayerLoaded = true;
    }

    previousVidWidth = w;
    previousVidHeight = h;

    video = document.getElementById('SubPlayerVideo');
    video.src = file;
    video.addEventListener('loadedmetadata', function () {
        console.log("IN LIBRARY: " + video.duration);
        var max = video.duration;
        $('.control-SPJS').html('<div id="allcontrols" style="width: 100%;"><a href="#" style="bottom: 7px;" id="playpause" onclick="startPlayVideo()"><i class="material-icons" style="color: rgb(255, 255, 255);">play_arrow</i></a><span style="visibility:hidden"> | </span><input onclick="onSeekBarClick()" style="min-width: 80%; bottom: 9px;" type="range" id="seekbar" min="0" max="' + max + '" /><span style="visibility:hidden"> | </span><a href="#" style=" style="" onclick="makeFullScreen()"><i class="material-icons" style="font-size: 24px; color: rgb(255, 255, 255);">fullscreen</i></a></div>');
        $('#seekbar').val(0).css("width", "80%").css("right", "5px");

       
        $('.outer-container-SPJS').on("change mousemove", function () {
            if (!guiIsvisible) {
               $('.outer-container-SPJS').css({ cursor: "auto"});
                guiIsvisible = true;
                console.log("GUI TOGGLE FIRST TIME");
                $('#allcontrols').fadeToggle();
                setTimeout(function () { $('#allcontrols').fadeToggle(); $('.outer-container-SPJS').css({ cursor: "none"}); guiIsvisible = false; console.log("GUI TOGGLE SECOND TIME"); }, 4000);
            } 
        });



        if(subtitle != "" && subtitle != null && subtitle != 0){            
            setSubtitle(subtitle);
        } else {
            subtitleIsSet = false;
        }

        $('#allcontrols').hide();

        setTimeout(function(){
            setInterval(function(){if(!isSeeking){$('#seekbar').val(video.currentTime);}}, 500);
        }, 0);

        video.onseeking = function () {        
            isSeeking = true;
        }

        getTimeStamp();
    });
  
}

function startPlayVideo() {
    if (!isPlaying) {
        video.play();

        $('#playpause').html('<i class="material-icons" style="color: rgb(255, 255, 255);">pause</i>');
        isPlaying = true;
    } else {
        video.pause();

        $('#playpause').html('<i class="material-icons" style="color: rgb(255, 255, 255);">play_arrow</i>');
        isPlaying = false;
    }
}

function onSeekBarClick() {
    var currentPosition = $('#seekbar').val();
    video.currentTime = currentPosition;
    console.log(currentPosition);
}

function makeFullScreen() {
    var i = document.getElementsByClassName("outer-container-SPJS")[0];

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
        console.log("going into fullscreen");

         $('#SubPlayerVideo').css({
            position: 'fixed', //or fixed depending on needs 
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
        });

        $('.video-overlay-SPJS').css({
            position: 'fixed', //or fixed depending on needs 
            top: '85%',
            left: 0,
            height: '100%',
            width: '100%'
        });

        $('.control-SPJS').css({
            position: 'fixed', //or fixed depending on needs 
            top: '85%',
            left: 0,
            height: '100%',
            width: '100%'
        });

        isFullScreen = true;
    } else {
        console.log("exiting fullscreen");
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        $('#SubPlayerVideo').css({
            position: 'relative',
            width: '100%'
        });

        $('.video-overlay-SPJS').css({
            position: 'absolute', //or fixed depending on needs 
            top: '85%',
            left: 0,
            height: '100%',
            width: '100%'
        });


        $('.control-SPJS').css({
            position: 'absolute', //or fixed depending on needs 
            top: '85%',
            left: 0,
            height: '100%',
            width: '100%'
        });
        isFullScreen = false;
    }
   
}


function setSubtitle(subtitleurl) {
    var extension = subtitleurl.replace(/^.*\./, '');
    $.ajax({
        url: subtitleurl,
        type: 'get',
        async: false,
        success: function (data) {           
            switch(extension){
                case "ass":
                    console.log("SubPlayerJS: SSA (SubStationAlpha) Supported!");
                    parseSubStationAlpha(data);
                    break;
                case "srt":
                    console.log("SubPlayerJS: Comming soon!");
                    break;
                case "vtt":
                    console.log("SubPlayerJS: Comming soon!");
                    break;
                case "sub":
                     console.log("SubPlayerJS: Maybe supported in future!");
                    break;
                case "smi":
                    console.log("SubPlayerJS: Maybe supported in future!");
                    break;
                case "usf":
                    console.log("SubPlayerJS: Maybe supported in future!");
                    break;
                default:
                    console.log("SubPlayerJS: Subtitle with extension: " + extension + " is NOT supported!");
                    break;
            }
            console.log("SubPlayerJS: Succesfully read subtitle!");
        },
        error: function (err) {
            console.log("SubPlayerJS: FAILED TO LOAD SUBTITLE: " + err);
            subtitleIsSet = false;
        }
    });
}


function parseSubStationAlpha(ssa){

    var lines = ssa.split("\n");
    $.each(lines, function (key, line) {
        if (line.indexOf("Dialogue") > -1) {
            var parts = line.split(',');
            parts[parts.indexOf(parts[1])] = timeStampToSeconds(parts[1]);
            parts[parts.indexOf(parts[2])] = timeStampToSeconds(parts[2]);
            subtitleArray.push(parts);
        }
    });

   

    subtitleIsSet = true;

}

function resetSubtitle() {
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
        var curTimeSecond = video.currentTime;
        currentTime = curTimeSecond;
        if(subtitleIsSet){            
            setTimeout(showSubtitle(curTimeSecond), 0);       
        } 
    }, 100);
}

function showSubtitle(time) {
    var localArray = subtitleArray;
    if(!isSeeking){
         try{


            var currentText = localArray[lineNumber];
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
            console.log("something went wrong while reading subtitle at time stamp: " );
            console.log("CURRENT: " + time);
            console.log("ERROR: " + e);
        }
    } else {
        var index = 0;
        $('#subtitle').html('');
        var arrayLength = localArray.length;
        for(var i = 0; i < arrayLength; i++){
            var timeStart = parseInt(localArray[i][1]);
            var timeEnd = parseInt(localArray[i][2]);
            //console.log("SubPlayerJS: INDEX SEARCH ON TIMESTART: " + timeStart + ", TIMEEND: " + timeEnd + " WITH CURRENT TIME: " + time);
            //console.log(localArray);

            if (time > timeStart) {
                //console.log("SubPlayerJS: INDEX SEARCH ON TIMESTART: " + timeStart + ", TIMEEND: " + timeEnd + " WITH CURRENT TIME: " + time);
                //console.log("SubPlayerJS: FOUND SUB POS AT: " + i);
                lineNumber = i;
            } 
        }
        isSeeking = false;
    }
   
    
}
        
function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}