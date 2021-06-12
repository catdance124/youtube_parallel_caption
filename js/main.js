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
        captionListEn: [],
        captionListJa: []
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
            this.captionListEn = this.getCaptionList('en');
            this.captionListJa = this.getCaptionList('ja');
        },
        getCaptionList: function(lang){
            var captionList = []
            var url = 'https://video.google.com/timedtext?hl=en&lang='+lang+'&name=&v='+this.videoId
            axios.get(url, { responseType: 'document' })
            .then(function(response){
                var textList = response.data.querySelectorAll("text")
                textList.forEach(text => {
                    captionList.push({ time: text.getAttribute("start"), text: text.innerHTML, transText: '' });
                })
            })
            .catch(function(error){
                if (error.response.data) {
                    console.log('error!')
                    alert("Please enter a 'collect' video id.")
                    return
                }
            })
            return captionList
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