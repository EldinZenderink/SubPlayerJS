!window.jQuery && document.write(unescape('%3Cscript src="https://code.jquery.com/jquery-2.1.1.min.js"%3E%3C%2Fscript%3E%3Cscript src="jquery.ajax-cross-origin.min.js"%3E%3C%2Fscript%3E'));

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
var isParsing = false;
var subtitleArray = [];
var ammountOfVideos = 0;
var fontsArray = [];



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
        if (!$("link[href='https://rawgit.com/EldinZenderink/SubPlayerJS/master/SubPlayerJS.css']").length) {
            loadjscssfile("https://rawgit.com/EldinZenderink/SubPlayerJS/master/SubPlayerJS.css", "css");
        }
        if (!$("link[href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css']").length) {
            loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css", "css");
        }
        
        ammountOfVideos++;
        subtitleArray.push([]);
        fontsArray.push({});
        this.loadVideo(ammountOfVideos);

        this.videoid = ammountOfVideos;

        
    }


    parseSubtitle(){
        this.resetSubtitle();
        var subPlayerVideo = SubPlayerJS.getVideo(this.videoid.toString());
        var previousTime = 0;
        var previousTotalAVBytesDecoded = 0;        
        var bitRate = 0;
        var curTime = 0;
        var totalAVBytesDecoded= 0;
        var packsParsed = 0;
        var packsSize = 0;
        var packsContainingSubtitle = 0;
        var timeItSeekedTo = 0;
        var timeSeekTook = 0;
        var audioBytesDecoded = 0;
        var videoBytesDecoded = 0;
        var bitRate = 0;
        var curTime = 0;    
        var guessedBytePosition = 0;
        var parsedSubtitle = [];
        var needsToSeek = false;
        var isPlaying = false;
        var sourceUrl = this.file;
        var videoid = this.videoid.toString();
        console.log(videoid);
        console.log(subPlayerVideo);
        subPlayerVideo.onended = function(e) {
            isPlaying = false;             
        };
        subPlayerVideo.onplay = function(){
            isPlaying = true;
        }
        subPlayerVideo.onpause = function(){
            isPlaying = false;
            console.log("is pausing");
            console.log(subPlayerVideo.currentTime);
        }
        subPlayerVideo.onseeking = function(){


            timeItSeekedTo = subPlayerVideo.currentTime;


            if(!needsToSeek){
                if(timeItSeekedTo < previousTime){
                    needsToSeek = true;
                    var parsedSubtitleLength = parsedSubtitle.length;

                    for(var x = 0; x < parsedSubtitleLength; x++){
                        var timeOfSubtitle = parsedSubtitle[x].time;
                        if(Math.round(timeOfSubtitle) > Math.round(timeItSeekedTo)){
                            guessedBytePosition = totalAVBytesDecoded - parsedSubtitle[x].decodedBytes;
                            subPlayerVideo.currentTime = timeOfSubtitle;
                            return;
                        }
                    }
                    needsToSeek = false;
                } else {
                    subPlayerVideo.currentTime = previousTime;
                    needsToSeek = true;                    
                }

            }
            
            
        }


        subPlayerVideo.ontimeupdate = function(){

            audioBytesDecoded = subPlayerVideo.webkitAudioDecodedByteCount;
            videoBytesDecoded = subPlayerVideo.webkitVideoDecodedByteCount;
            totalAVBytesDecoded = videoBytesDecoded + audioBytesDecoded;
            curTime = subPlayerVideo.currentTime;
            bitRate = totalAVBytesDecoded / curTime;

            

            var startRequest = Math.round(previousTotalAVBytesDecoded - guessedBytePosition) ;
            var endRequest = Math.round(totalAVBytesDecoded - guessedBytePosition) ;
            packsSize = endRequest - startRequest;

            if(subPlayerVideo.currentTime < timeItSeekedTo){
                subPlayerVideo.playbackRate = 100;
            } else  {
                needsToSeek = false;
                subPlayerVideo.playbackRate = 1;
                var oReq2 = new XMLHttpRequest();
                oReq2.open("GET", sourceUrl, true);
                oReq2.setRequestHeader('Range', 'bytes=' + startRequest + '-' + endRequest); 
                oReq2.responseType = "blob";

                oReq2.onload = function(oEvent) {
                    console.log("Received file!");
                    var blob = oReq2.response;
                    packsParsed++;

                    var reader = new FileReader();
                    reader.onload = function(){
                        var binaryString = this.result;
                        if(binaryString.indexOf("0,,")){
                            var searchResult = binaryString.split("0,,");
                            var resultLength = searchResult.length;
                            if(resultLength > 1){
                                var parsed = "";
                                for(var x = 1; x < resultLength; x++){
                                    var decoded = decodeURI(encodeURI(searchResult[x]).split('%E2%80%BA')[0]) + " \r\n";
                                    if(decoded.indexOf('%E2%80%BA') < 0 && decoded !== undefined){
                                        parsed = parsed  + decoded;
                                    }
                                     
                                }

                                parsedSubtitle.push({time: curTime, decodedBytes: previousTotalAVBytesDecoded});
                                packsContainingSubtitle++;
                                //document.querySelector('#result').innerHTML = parsed;
                                $('#subtitle_' + videoid.toString()).html('<div style="font-family: Sans-Serif;">' + parsed.replace("\\N", "<br />") + '</div>');
                                console.log(videoid);
                            }
                            
                        }
                        
                    }
                    reader.readAsText(blob, 'ISO-8859-1');
                };
                oReq2.send(null);

            }

            
            var data = " \
             Time: " + curTime + " \r\n \
             BitRate: " + (bitRate / 100) + "kbps \r\n \
             Audio Bytes Decoded: " + (audioBytesDecoded / 1000000) + "mb \r\n \
             Video Bytes Decoded: " + (videoBytesDecoded / 1000000) + "mb \r\n \
             Total Bytes Decoded: " + (totalAVBytesDecoded / 1000000) + " mb \r\n \
             Buffer Length: " + subPlayerVideo.buffered.length + "\r\n \
             Buffer Start: " + subPlayerVideo.buffered.start(subPlayerVideo.buffered.length - 1) + "\r\n \
             Buffer End: " + subPlayerVideo.buffered.end(subPlayerVideo.buffered.length - 1) + "\r\n \
             Packs Parsed: " + packsParsed + "\r\n \
             Packs Contianing Subtitle: " + packsContainingSubtitle + " \r\n \
             Timedifference seek: " + timeSeekTook + " \r\n \
             guessedBytePosition: " + guessedBytePosition + " \r\n \
             Packs Size: " + packsSize;     
            
            //document.querySelector('#videodata').innerHTML = data;

            previousTotalAVBytesDecoded = totalAVBytesDecoded;
            //previousTime = curTime;

        }
        setInterval(function(){
            if(previousTime != curTime){
                previousTime = curTime;
            }

        }, 1000); 


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

        this.getTimeStamp();

    }

    setWidth(width) {
        this.videoWidth = width;

    }

    setHeight(height) {
        this.videoHeight = height;
    }

    resetSubtitle() {
        $('#subtitle_' + this.videoid.toString()).html('');
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

    getTimeStamp() {
        var subPlayerVideo = SubPlayerJS.getVideo(this.videoid.toString());
        var that = this;
        var videoid = this.videoid.toString();
        this.interval = setInterval(function() {
            var curTimeSecond = subPlayerVideo.currentTime;
            this.currentTime = curTimeSecond;
            setTimeout(that.showSubtitle(curTimeSecond, videoid), 0);
        }, 50);
    }

    showSubtitle(time, videoid) {
        var localArray = subtitleArray[videoid - 1];
        var fonts = fontsArray[videoid - 1];
        if(fonts.length < 1){
            fonts["Default"] = "Verdana";
        }
        try {
            var currentText = localArray[this.lineNumber];
            var secondOfTimeStart = currentText[0];
            var secondOfTimeEnd = currentText[1];

            if (time < secondOfTimeStart) {
               
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
                    var fontstyletouse;
                    if(currentText[3] == null || currentText[3].length == 0){
                        fontstyletouse = "Default";
                    } else {
                        fontstyletouse = currentText[3];
                    }
                    $('#subtitle_' + videoid.toString()).html('<div style="font-family: ' + fonts[fontstyletouse] + '">' + fullText.substring(0, fullText.length - 1).replace("\\N", "<br />") + '</div>');
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
        return document.getElementById('SubPlayerVideo_' + ammount);
    }

    static timeStampToSeconds(timestamp, fileType) {
        var totalSeconds = 0;
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
        var fonts = {};
        console.log(this.fonts);
        var styling = ssa.split("Styles]")[1].split("[Events]")[0].split("\n");
        $.each(styling, function(key, style) {
           if(style.indexOf("Style:") > -1){
                var information = style.split(':')[1].split(',');
                var styletype = information[0].trim();
                var font = information[1].trim();
                console.log("STYLE TYPE = " + styletype + ", FONT: " + font);
                fonts[styletype] = font;
                fontsArray[videoid - 1] = fonts;
               console.log(this.fonts);
           }
           
        });
        this.loadFont(videoid);
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
                
                parts[3] = parts[3];

                for(var i = 4; i < line.split(',').length; i++){
                    parts[i] = "";
                }
                subtitleArray[videoid - 1].push(parts);
            }
        });
        this.subtitleIsSet = true;
    } 

    static parseSubRip(srt, videoid){
		var lines = srt.replaceAll("\r",""); //in case each line ended with cr+lf
		lines = lines.split(/[\r\n]+[\r\n]+/);
        
        $.each(lines, function(key, line) {
            if (line.indexOf("-->") > -1) {
				var parts = line.split(/[\r\n]+/)[1].split(/[\r\n]+/)[0].split('-->');
                parts[0] = SubPlayerJS.timeStampToSeconds(parts[0], "srt");
                parts[1] = SubPlayerJS.timeStampToSeconds(parts[1], "srt");

                
                var text = "";
                for(var i = 2; i < line.split(/[\r\n]+/).length; i++){
                    text = text + line.split(/[\r\n]+/)[i] + "<br />";
                }
                parts[2] = text;
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
    
    static loadFont(videoid){
        console.log("LOADING FONTS");
        console.log(fontsArray[videoid - 1]);
        var fonts = fontsArray[videoid - 1];
        for (var style in fonts) {
            var font = fonts[style].split(' ')[0];

            var downloadFont = true;
            if (typeof(Storage) !== "undefined") {
                if(localStorage.getItem(style) !== null){
                    console.log("LOADED FONT: " + font + " FROM LOCAL STORAGE :D" );
                    loadjscssfile("data:text/css;base64," + localStorage.getItem(font), "css");
                    downloadFont = false;
                   
                }
            }

            if(downloadFont){
                console.log("downloading: " + font);
                $.ajax({
                    async: false,
                    url: 'https://crossorigin.me/https://www.onlinewebfonts.com/search?q=' + font,
                    success: function(data) { 
                        //console.log(data);
                        var foundUrl = data.substring(data.indexOf("class=\"url")).split('"')[3].split('"')[0].replace("/download/", "");
                        var fontstyle = data.substring(data.indexOf("class=\"url")).split('"')[5].substring(1 ).split('<')[0];
                        console.log("foundUrl: " + foundUrl);
                        console.log("fontstyle: " + fontstyle);

                        $.ajax({
                            async: true,
                            url: "https://crossorigin.me/https://db.onlinewebfonts.com/c/" + foundUrl + "?family=" + fontstyle,
                            success: function(data) { 
                                if (typeof(Storage) !== "undefined") {
                                    // Store
                                    localStorage.setItem(font, btoa(unescape(encodeURIComponent(data))));
                                    console.log("saved subtitle: " + fontstyle + " as base64 in localstorage");
                                } else {
                                    console.log("did notsaved subtitle: " + fontstyle + " as base64 in localstorage");
                                }
                            }
                        });


                         loadjscssfile("https://db.onlinewebfonts.com/c/" + foundUrl + "?family=" + fontstyle, "css");
                         for (var style2 in fonts) {
                             //console.log(fonts[style2] + " =?= " + fonts[style] + "-?>" + fontstyle);
                            if( fonts[style2] == fonts[style]){
                                 fonts[style2] = fontstyle;
                            }
                         }
                    }
                });
            }
           
        }
        
        
        fontsArray[videoid - 1] = fonts;
    console.log("done");
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
