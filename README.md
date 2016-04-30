# SubPlayerJS

SubPlayerJS is a in JavaScript written library to show subtitles on your video. It uses a modified HTML5 video player. 

### Goal
My goal for this project is a universal subtitle video player that supports most of the commonly used text-based subtitle formats, think of .ass, .srt, .vtt and just plain old .txt. Main focus lies with .ass (Sub Station Alpha) support. **Be aware that embedded subtitles inside your video file are NOT supported!**

### Version
0.0.1 - initial release

### How and Why
The library loads the video object once dynamically on your page, you only need to make a empty div tag or something simular with a specific ID for the video player (see instructions below). This player is build upon the HTML5 video tag, featuring it's own layout (very simular to the stock HTML5 video player). This is necesary because otherwise fullscreen playback wouldn't work. Furthermore, this library uses Material Icons for its video player icons. The library will dynamically load the style sheet, if you did not do that already. Same goes for jQuery!

### Tech

SubPlayerJS uses a number of open source projects to work properly:

**Services:**
* [RawGit](https://rawgit.com/) - making CDN through GitHub available

**Scripts:**
* [Material Icons](https://design.google.com/icons/) - awesome free icons
* [jQuery](https://jquery.com/) - duh


### Installation

You just have to include this library by pasting the following tag in your html web page:

`<script type="text/javascript" src="/path/to/SubPlayerJS.js" ></script>`

Or in case you want to use CDN:

`<script type="text/javascript" src="NOT YET" ></script>`

Loading a video is very easy:

```
<body>
    <div id="divIDwhereVideoPlayerWillBeLoaded"></div>
</body>

<script>
LoadSubPlayerJS('urltofile.mp4', 'urltosubtitle.ass', '#divIDwhereVideoPlayerWillBeLoaded', optionalWidth, optionalHeight);
</script>
```

In case you want to get information from the video player, you can use the normal available video api provided by HTML5, using a custom ID used by SubPlayerJS video player:

```
var videoPlayer = document.getElementById('SubPlayerVideo');
videoPlayer.Stop(); //etc
```

In case you did not load any of the libraries mentioned under the *Tech* division of this document, the library will load these scripts dynamically for you!

### Development
Development will continue in my spare time. I am a bussy student, so this will mostly happen in weekends and other free occasions. I will try to fix bugs as soon as possible.

### Todos

 - bug fixes/testing
 - add support for others subtitle formats than '.ass (SubStationAlpha'
 - interface improvements
 - multitrack support
 - styling support :(basic *Italic* and/or **Bold** support for simple text-based subtitles such as '.srt', advanced styling support for '.ass(SubStationAlpha)';

License
----

MIT


**Free Software, Hell Yeah!**
