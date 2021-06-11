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
        videoId: '',
        captionList: ''
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
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }
            this.getCaptionList()
        },
        getCaptionList: function(){
            captionList = []
            var url = 'https://video.google.com/timedtext?hl=en&lang=en&name=&v='+this.videoId
            axios.get(url, { responseType: 'document' })
            .then(function(response){
                var textList = response.data.querySelectorAll("text")
                textList.forEach(text => {
                    captionList.push({ time: 0 + text.getAttribute("start"), text: text.innerHTML, transText: '' });
                });
                console.log(captionList)
                this.captionList = captionList
            }.bind(this))
            .catch(function(error){
                console.log(error)
            }.bind(this))
        }
    }
})

function onPlayerReady(event) {
    // event.target.playVideo();
}

function onPlayerStateChange(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //     setTimeout(stopVideo, 6000);
    //     done = true;
    // }
}
function stopVideo() {
    player.stopVideo();
}