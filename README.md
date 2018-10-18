# SubPlayerJS

SubPlayerJS is a in JavaScript written library to show subtitles on your video. It uses a modified HTML5 video player. 

### Goal
My goal for this project is a universal subtitle video player that supports most of the commonly used text-based subtitle formats, think of .ass, .srt, .vtt and just plain old .txt. Main focus lies with .ass (Sub Station Alpha) support. **Be aware that embedded subtitles inside your video file are NOT supported!**

### Version
0.0.1 - initial release

0.1.0 - stable working release:

    -   fixed bug when skipping backwards subtitle would dissapear
    -   jQuery auto dynamic load added
    -   Materializecss stylsheet auto dynamic load added

0.2.0

    -   changed the way on how to initialize the player from calling a method to calling a class
    -   due to above change multiple videos can now be initialized with their own subtitles
    -   outer div of video container is now size of video instead of screen (necessary for full screen mode)

0.3.0

    -   SubRip (.srt) is now supported!
    -   Bug Fix: Subtitle would not show up when you seek after the last sentence of a subtitle has been shown. 
    
0.4.0

    -   Dynamic font loading for (Advanced)SubStationAlpha using [https://www.onlinewebfonts.com](https://www.onlinewebfonts.com) to search for fonts

### Demo
You can find a demo here: [http://eldinzenderink.github.io/SubPlayerJS/demo.html](http://eldinzenderink.github.io/SubPlayerJS/demo.html#)

You can find a demo video with real time subtitle parsing here:
[YouTube](https://www.youtube.com/watch?v=jPRdBNdMERs)

### How and Why
The library loads the video object once dynamically on your page, you only need to make a empty div tag or something simular with a specific ID for the video player (see instructions below). This player is build upon the HTML5 video tag, featuring it's own layout (very simular to the stock HTML5 video player). This is necesary because otherwise fullscreen playback wouldn't work. Furthermore, this library uses Material Icons for its video player icons. The library will dynamically load the style sheet, if you did not do that already. Same goes for jQuery!

### Tech

SubPlayerJS uses a number of open source projects to work properly:

**Services:**
* [RawGit](https://rawgit.com/) - making CDN through GitHub available
* [https://www.onlinewebfonts.com](https://www.onlinewebfonts.com) - looking up fonts for (advanced)substationalpha subtitles
* [https://crossorigin.me](https://crossorigin.me) - parsing onlinewebfonts html for font links (can't do cors to their site directly)
 
**Scripts:**
* [MaterializeCSS](http://materializecss.com/) - awesome css framwork
* [Material Icons](https://design.google.com/icons/) - awesome free icons
* [jQuery](https://jquery.com/) - duh


### Installation

You just have to include this library by pasting the following tag in your html web page:

`<script type="text/javascript" src="/path/to/SubPlayerJS.js" ></script>`

Or in case you want to use CDN (Development Version):

`<script type="text/javascript" src="https://rawgit.com/EldinZenderink/SubPlayerJS/master/SubPlayerJS.js" ></script>`

Loading a video is very easy:

```
<html>
<head>
<title> Demo Player </title>

<script type="text/javascript" src="https://rawgit.com/EldinZenderink/SubPlayerJS/master/SubPlayerJS.js" ></script>
</head>
<body>
<center>
 <div id="divIDwhereVideoPlayerWillBeLoaded"></div> 
 <br />
 <div id="divIDwhereVideoPlayerWillBeLoaded2"></div> 
</center>
 <br />
 <center> Movie by <b><a href="https://durian.blender.org/">The Blender Foundation & Durian</a></b> </center>
<script>

	var newPlayer = new SubPlayerJS('#divIDwhereVideoPlayerWillBeLoaded', 'http://peach.themazzone.com/durian/movies/sintel-1280-surround.mp4');
	newPlayer.setSubtitle('https://raw.githubusercontent.com/EldinZenderink/SubPlayerJS/master/DemoSubtitle/sintel.ass'); 

	var newPlayer2 = new SubPlayerJS('#divIDwhereVideoPlayerWillBeLoaded2', 'http://peach.themazzone.com/durian/movies/sintel-1280-surround.mp4');
	newPlayer2.setSubtitle('https://raw.githubusercontent.com/EldinZenderink/SubPlayerJS/master/DemoSubtitle/sintel.ass'); 

</script>
</body>
</html>

```

In case you did not load any of the libraries mentioned under the *Tech* division of this document, the library will load these scripts dynamically for you!

### Development
Development will continue in my spare time. I am a bussy student, so this will mostly happen in weekends and other free occasions. I will try to fix bugs as soon as possible.

### Todos

 - bug fixes/testing
 - add support for dynamic resizing
 - add support for more subtitle formats (now: .ass, .srt)
 - interface improvements
 - multitrack support
 - styling support :(basic *Italic* and/or **Bold** support for simple text-based subtitles such as '.srt', advanced styling support for '.ass((Advanced)SubStationAlpha)';

License
----

MIT


**Free Software, Hell Yeah!**
