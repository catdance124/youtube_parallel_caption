// load youtube player
// ref: https://developers.google.com/youtube/iframe_api_reference?hl=ja
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;


var app = new Vue({
    el: '#app',
    data: {
        videoId: ''
    },
    methods: {
        startVideo: function(){
            if (this.videoId == ''){
                alert("Please enter a video id.")
                return
            }
            if(player != null){
                player.stopVideo();
                player.loadVideoById(this.videoId)
                player.seekTo(0);
                player.playVideo();
              }else{
                player = new YT.Player('player', {
                  height: '360',
                  width: '640',
                  videoId: this.videoId,
                  startSeconds: 0,
                //   events: {
                //     'onReady': onPlayerReady,
                //     'onStateChange': onPlayerStateChange
                //   }
                });
              }
        }
    }
})