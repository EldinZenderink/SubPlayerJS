!window.jQuery && document.write(unescape('%3Cscript src="https://code.jquery.com/jquery-2.1.1.min.js"%3E%3C%2Fscript%3E'));

//loads video
var timeStamp = 0 + ":" + 0 + ":" + 0 + "." + 0;
var lineNumber = 0;
var currentTime = 0;
var videoPlayerLoaded = false;
var subtitleIsSet = false;
var guiIsvisible = false;
var isPlaying = false;
var isFullScreen = false;
var isSubtitleEnabled = true;
var isSeeking = false;

var subtitleArray = [];
var ammountOfVideos = 0;



class SubPlayerJS {


   

    constructor(div, file) {
        this.div = div;
        this.file = file;
        this.timeStamp = timeStamp;
        this.previousVidWidth;
        this.previousVidHeight;
        this.lineNumber = lineNumber;
        this.currentTime = currentTime;
        this.interval;
        this.videoPlayerLoaded = videoPlayerLoaded;
        this.subtitleIsSet = subtitleIsSet;
        this.guiIsvisible = false;
        this.isPlaying = isPlaying;
        this.isFullScreen = isFullScreen;
        this.isSubtitleEnabled = isSubtitleEnabled;
        this.subtitleArray = [];
        this.isSeeking = isSeeking;
        this.timer;
        

        if (!$("link[href='http://fonts.googleapis.com/icon?family=Material+Icons']").length) {
            loadjscssfile("http://fonts.googleapis.com/icon?family=Material+Icons", "css");
        }
        if (!$("link[href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css']").length) {
            loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css", "css");
        }
<<<<<<< HEAD
        if (!$("link[href='https://rawgit.com/EldinZenderink/SubPlayerJS/master/SubPlayerJS.css']").length) {
            loadjscssfile("https://rawgit.com/EldinZenderink/SubPlayerJS/master/SubPlayerJS.css", "css");
        }

=======
>>>>>>> refs/remotes/origin/master
        
        ammountOfVideos++;
        subtitleArray.push([]);
        this.loadVideo(ammountOfVideos);

        this.videoid = ammountOfVideos;

        this.getTimeStamp(ammountOfVideos);
    }

    setSubtitle(subtitleurl) {
        this.resetSubtitle();
        this.subtitle = subtitleurl;

        if (subtitleurl != "" && subtitleurl != null && subtitleurl != 0) {
            this.getSubtitle(this.videoid);
        } else {
            this.subtitleIsSet = false;
            $('#enableSub_' + ammountOfVideos.toString()).html('<i class="material-icons" style="color: rgb(96, 96, 96);">subtitles</i>');
        }

    }

    setWidth(width) {
        this.videoWidth = width;

    }

    setHeight(height) {
        this.videoHeight = height;
    }

    resetSubtitle() {
        $('#subtitle_' + ammountOfVideos.toString()).html('');
    }

    loadVideo(videoid) {
        var vidwidth = 0;
        var vidheight = 0;

        try {
            clearInterval(this.interval);
        } catch (e) {
            console.log("no interval running");
        }

        if (this.videoWidth != null && this.videoWidth != "" && this.videoWidth != 0) {
            vidwidth = this.videoWidth;
        } else {
            vidwidth = "100%";
        }

        if (this.videoHeight != null && this.videoHeight != "" && this.videoHeight != 0) {
            vidheight = this.videoHeight;
        } else {
            vidheight = "";
        }

        if (!this.videoPlayerLoaded || this.previousVidHeight != h || this.previousVidWidth != w) {

            $(this.div).html('<div class="outer-container-SPJS " id="outerContainer_' + videoid.toString() + '">\
                            <div class="inner-container-SPJS " id="innerContainer_' + videoid.toString() + '">\
                                <div class="video-overlay-SPJS" id="subtitle_' + videoid.toString() + '"><br /></div>\
                                <div style="min-width: 100%;" class="control-SPJS" id="controlDiv_' + videoid.toString() + '"></div>\
                                <video id="SubPlayerVideo_' + videoid.toString() + '" width="' + vidwidth + '" height="' + vidheight + '">\
                                <source id="videoSource_' + videoid.toString() + '" src="">\
                                    Your browser does not support HTML5 video.\
                                </video>\
                            </div>\
                        </div>');
            this.videoPlayerLoaded = true;
        }

        this.previousVidWidth = this.videoWidth;
        this.previousVidHeight = this.videoHeight;

        var subPlayerVideo = SubPlayerJS.getVideo(videoid.toString());
        subPlayerVideo = subPlayerVideo;
        subPlayerVideo.src = this.file;
        subPlayerVideo.addEventListener('loadedmetadata', function() {
            var max = subPlayerVideo.duration;

            $('#controlDiv_' + videoid.toString()).html('<div id="allcontrols_' + videoid.toString() + '" style="width: 100%;"><a href="javascript:;" style="bottom: 7px;" id="playpause_' + videoid.toString() + '" onclick="SubPlayerJS.startPlayVideo(' + videoid.toString() + ')"><i class="material-icons" style="color: rgb(255, 255, 255);">play_arrow</i></a><span style="visibility:hidden"> | </span><input onclick="SubPlayerJS.onSeekBarClick(' + videoid.toString() + ')" style="min-width: 80%; bottom: 9px;" type="range" id="seekbar_' + videoid.toString() + '" min="0" max="' + max + '" /><span style="visibility:hidden"> | </span><a id="fullScreen_' + videoid.toString() + '" href="javascript:;" style=" style="" onclick="SubPlayerJS.makeFullScreen(' + videoid.toString() + ')"><i class="material-icons" style="font-size: 24px; color: rgb(255, 255, 255);" >fullscreen</i></a><span style="visibility:hidden"> | </span><a href="javascript:;" id="enableSub_' + videoid.toString() + '" onclick="SubPlayerJS.enaDisaSub(' + videoid.toString() + ')"> <i class="material-icons" style="color: rgb(255, 255, 255);">subtitles</i></a></div>');
            $('#seekbar_' + videoid.toString()).val(0).css("width", "80%").css("right", "5px");

            $('#allcontrols').hide();

            setTimeout(function() {
                setInterval(function() {
                    if (!this.isSeeking) {
                        $('#seekbar_' + videoid.toString()).val(subPlayerVideo.currentTime);
                    }
                }, 1000);
            }, 0);
        });

        $('#outerContainer_' + videoid.toString()).on("change mousemove", function() {
            $('#outerContainer_' + videoid.toString()).css({
                cursor: "auto"
            });
            $('#allcontrols_' + videoid.toString()).show();

            clearTimeout(this.timer);
            this.timer = setTimeout(function() {
                $('#allcontrols_' + videoid.toString()).hide();
                $('#outerContainer_' + videoid.toString()).css({
                    cursor: "none"
                });
            }, 4000);
        });

    }

    getSubtitle(videoid) {
        var extension = this.subtitle.replace(/^.*\./, '');
        $.ajax({
            url: this.subtitle,
            type: 'get',
            async: false,
            success: function(data) {
                switch (extension) {
                    case "ass":
                        console.log("SubPlayerJS: SSA (SubStationAlpha) Supported!");
                        SubPlayerJS.parseSubStationAlpha(data, videoid);
                        break;
                    case "srt":

                        console.log("SubPlayerJS: SRT (SubRip) Supported!");
                        SubPlayerJS.parseSubRip(data, videoid);
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
            error: function(err) {
                console.log("SubPlayerJS: FAILED TO LOAD SUBTITLE: " + err);
                this.subtitleIsSet = false;
            }
        });
    }

    getTimeStamp(videoid) {
        var subPlayerVideo = SubPlayerJS.getVideo(videoid);
        var that = this;
        this.interval = setInterval(function() {
            var curTimeSecond = subPlayerVideo.currentTime;
            this.currentTime = curTimeSecond;
            setTimeout(that.showSubtitle(curTimeSecond, videoid), 0);
        }, 50);
    }

    showSubtitle(time, videoid) {
        var localArray = subtitleArray[videoid - 1];
        try {
            var currentText = localArray[this.lineNumber];
            var secondOfTimeStart = currentText[0];
            var secondOfTimeEnd = currentText[1];

            if (time < secondOfTimeStart) {
                console.log("SEEKED");
                var index = 0;
                this.lineNumber = 0;
                $('#subtitle_' + videoid.toString()).html('');
                var arrayLength = localArray.length;
                for (var i = 0; i < arrayLength; i++) {
                    var timeStart = parseInt(localArray[i][0]);
                    var timeEnd = parseInt(localArray[i][1]);

                    if (time > timeStart) {
                        this.lineNumber = i;
                        break;
                    }
                }
                $('#subtitle_' + videoid.toString()).html('');
            } else {
                if (time > secondOfTimeEnd) {
                    this.lineNumber++;
                    $('#subtitle_' + videoid.toString()).html('');
                } else {
                    var fullText = currentText[2];
                    $('#subtitle_' + videoid.toString()).html(fullText.substring(0, fullText.length - 1).replace("\\N", "<br />"));
                }
            }
        } catch (e) {
            try{
                 var index = 0;
                this.lineNumber = 0;
                $('#subtitle_' + videoid.toString()).html('');
                var arrayLength = localArray.length;
                for (var i = 0; i < arrayLength; i++) {
                    var timeStart = parseInt(localArray[i][0]);
                    var timeEnd = parseInt(localArray[i][1]);

                    if (time > timeStart) {
                        this.lineNumber = i;
                        break;
                    }
                }
            } catch (e){

              
            }
        }

    }

    static getVideo(ammount){
        //console.log('SubPlayerVideo_' + ammount);
        return document.getElementById('SubPlayerVideo_' + ammount);
    }

    static timeStampToSeconds(timestamp, fileType) {
        var totalSeconds = 0;
        console.log("TIMESTAMP: " + timestamp);
        switch(fileType){
            case "ass":
                var parts = timestamp.split(':');
                var hour = parts[0];
                var minute = parts[1];
                var second = parts[2];
                totalSeconds = hour * 3600 + minute * 60 + parseInt(second);
                break;
            case "srt":
                var parts = timestamp.split(':');
                var hour = parts[0];
                var minute = parts[1];
                var second = parts[2].split('\r\n')[0];
                totalSeconds = hour * 3600 + minute * 60 + parseInt(second);
                break;
        }
        
        return totalSeconds;
    }

    static parseSubStationAlpha(ssa, videoid) {
        var lines = ssa.split("\n");
        $.each(lines, function(key, line) {
            if (line.indexOf("Dialogue") > -1) {
                var parts = line.split(',');
                parts[0] = SubPlayerJS.timeStampToSeconds(parts[1], "ass");
                parts[1] = SubPlayerJS.timeStampToSeconds(parts[2], "ass");
                var text = "";
                for(var i = 9; i < line.split(',').length; i++){
                    text = text + line.split(',')[i] + ",";
                }
                parts[2] = text;

                for(var i = 3; i < line.split(',').length; i++){
                    parts[i] = "";
                }
                subtitleArray[videoid - 1].push(parts);
            }
        });
        this.subtitleIsSet = true;
    } 

    static parseSubRip(srt, videoid){
        var lines = srt.split("\r\n\r\n");
        $.each(lines, function(key, line) {
            if (line.indexOf("-->") > -1) {
                var parts = line.split('\r\n')[1].split('\r\n')[0].split('-->');
                parts[0] = SubPlayerJS.timeStampToSeconds(parts[0], "srt");
                parts[1] = SubPlayerJS.timeStampToSeconds(parts[1], "srt");

                var text = "";
                for(var i = 2; i < line.split('\r\n').length; i++){
                    text = text + line.split('\r\n')[i] + "<br />";
                }
                parts[2] = text;
                
                console.log("parts: ");
                console.log(parts);
                subtitleArray[videoid - 1].push(parts);
            }
        });
    }  

    static enaDisaSub(videoid) {
        if (this.isSubtitleEnabled) {
            this.isSubtitleEnabled = false;

            $('#subtitle_' + videoid.toString()).css("z-index", "-1");
            $('#enableSub_' + videoid.toString()).html('<i class="material-icons" style="color: rgb(96, 96, 96);">subtitles</i>');

        } else {
            this.isSubtitleEnabled = true;

             $('#subtitle_' + videoid.toString()).css("z-index", "1");
            $('#enableSub_' + videoid.toString()).html('<i class="material-icons" style="color: rgb(255, 255, 255);">subtitles</i>');
        }
        return false;
    }

    static startPlayVideo(videoid) {
        if (!this.isPlaying) {
            SubPlayerJS.getVideo(videoid).play();
            $('#playpause_' + videoid.toString()).html('<i class="material-icons" style="color: rgb(255, 255, 255);">pause</i>');
            this.isPlaying = true;
        } else {
            SubPlayerJS.getVideo(videoid).pause();
            $('#playpause_' + videoid.toString()).html('<i class="material-icons" style="color: rgb(255, 255, 255);">play_arrow</i>');
            this.isPlaying = false;
        }
    }

    static onSeekBarClick(videoid) {
        var currentPosition = $('#seekbar_' + videoid.toString()).val();
        SubPlayerJS.getVideo(videoid).currentTime = currentPosition;
       // console.log(currentPosition);
        return false;
    }

    static makeFullScreen(videoid) {
        var i = document.getElementById('innerContainer_' + videoid.toString());

        // go full-screen
       
        if (!this.isFullScreen) {

             if (i.requestFullscreen) {
                i.requestFullscreen();
            } else if (i.webkitRequestFullscreen) {
                i.webkitRequestFullscreen();
            } else if (i.mozRequestFullScreen) {
                i.mozRequestFullScreen();
            } else if (i.msRequestFullscreen) {
                i.msRequestFullscreen();
            }
            console.log("going into fullscreen");

            $('#SubPlayerVideo_' + videoid.toString()).css({
                position: 'fixed', //or fixed depending on needs 
                top: 0,
                left: 0,
                height: '100%',
                "background-color": "black"
            });

            $('#subtitle_' + videoid.toString()).css({
                position: 'fixed', //or fixed depending on needs 
                top: '80%',
                left: 0,
                height: '100%',
                width: '100%'
            });

            $('#controlDiv_' + videoid.toString()).css({
                position: 'fixed', //or fixed depending on needs 
                top: '85%',
                left: 0,
                width: '100%'
            });
            $('#fullScreen_' + videoid.toString()).html('<i class="material-icons" style="color: rgb(255, 255, 255);">fullscreen_exit</i>');
            this.isFullScreen = true;
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

             $('#SubPlayerVideo_' + videoid.toString()).css({
                position: 'relative',
                "background-color": "",
                height: ''
            });

            $('#subtitle_' + videoid.toString()).css({
                position: 'absolute', //or fixed depending on needs 
                top: '80%',
                left: 0,
                height: '',
                width: '100%'
            });


            $('#controlDiv_' + videoid.toString()).css({
                position: 'absolute', //or fixed depending on needs 
                top: '85%',
                left: 0,
                width: '100%'
            });
            $('#fullScreen_' + videoid.toString()).html('<i class="material-icons" style="color: rgb(255, 255, 255);">fullscreen</i>');
            this.isFullScreen = false;
        }
        return false;

    }
}
function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    } else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function loadScript(url, callback) {
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
