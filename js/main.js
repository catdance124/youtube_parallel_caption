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
        videoId: 'LVdynVuJsBo',
        captionListEn: [],
        captionListJa: [],
        preTargetEn: "en0",
        preTargetJa: "ja0"
    },
    methods: {
        startVideo: async function(){
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
                        'onReady': this.onPlayerReady,
                        'onStateChange': this.onPlayerStateChange
                    }
                });
            }
            this.captionListEn = await this.getCaptionList('en');
            this.captionListJa = await this.getCaptionList('ja');
        },
        getCaptionList: async function(lang){
            var captionList = []
            var url = `https://video.google.com/timedtext?hl=en&lang=${lang}&name=&v=${this.videoId}`
            await axios.get(url, { responseType: 'document' })
            .then(function(response){
                var textList = response.data.querySelectorAll("text")
                textList.forEach((text, index) => {
                    captionList.push({ id:lang+index, time: text.getAttribute("start"), text: text.innerHTML})
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
        },
        jumpTo: function(lang, index){
            if (lang == 'en'){
                player.seekTo(this.captionListEn[index]["time"])
            }
            if (lang == 'ja'){
                player.seekTo(this.captionListJa[index]["time"])
            }
        }, 
        scrollCaption: function(){
            currentTime = player.getCurrentTime();
            // en
            var latestCaptionEn = this.captionListEn.filter(item => item.time < currentTime).slice(-1)[0]
            if (latestCaptionEn === undefined){ latestCaptionEn = this.captionListEn[0] }
            var idEn = latestCaptionEn["id"]
            var captionList = document.getElementById('en-area')
            var targetCaption = document.getElementById(idEn)
            var position = targetCaption.offsetTop - captionList.offsetTop - captionList.clientHeight / 2
            if (position < 0) { position = 0 }
            captionList.scrollTop = position
            document.getElementById(this.preTargetEn).style.color = ""
            targetCaption.style.color = "red"
            this.preTargetEn = idEn
            // ja
            var latestCaptionJa = this.captionListJa.filter(item => item.time < currentTime).slice(-1)[0]
            if (latestCaptionJa === undefined){ latestCaptionJa = this.captionListJa[0] }
            var idJa = latestCaptionJa["id"]
            var captionList = document.getElementById('ja-area')
            var targetCaption = document.getElementById(idJa)
            var position = targetCaption.offsetTop - captionList.offsetTop - captionList.clientHeight / 2
            if (position < 0) { position = 0 }
            captionList.scrollTop = position
            document.getElementById(this.preTargetJa).style.color = ""
            targetCaption.style.color = "red"
            this.preTargetJa = idJa

            setTimeout(this.scrollCaption, 500);
        },
        onPlayerReady: function(event){
            // event.target.playVideo();
            setTimeout(this.scrollCaption, 500);
        },
        onPlayerStateChange: function(event){
            // if (event.data == YT.PlayerState.PLAYING && !done) {
            //     setTimeout(stopVideo, 6000);
            //     done = true;
            // }
        },
        stopVideo: function(event){
            player.stopVideo();
        },
        
    }
})