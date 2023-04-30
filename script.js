const View=(()=>{
    const sellectors={
        nowPlaying :document.querySelector(".now-playing"),
        trackArt   :document.querySelector(".track-art"),
        trackName  :document.querySelector(".track-name"),
        trackArtist:document.querySelector(".track-artist"),

        currentTime :document.querySelector(".current-time"),
        seekSlider :document.querySelector(".seek-slider"),
        totalTime :document.querySelector(".total-time"),

        random :document.querySelector(".random"),
        prev :document.querySelector(".prev"),
        playPause :document.querySelector(".play"),
        next :document.querySelector(".next"),
        repeat :document.querySelector(".repeat"),

        cur_track : document.createElement('audio')
    }
    const setter={
        setTrack(data){
            
            sellectors.cur_track.src=data.music;
            sellectors.cur_track.load();
            sellectors.trackArt.style.backgroundImage="url("+data.img+")";
            sellectors.trackName.textContent=data.name;
            sellectors.trackArtist.textContent=data.artist;
            sellectors.nowPlaying.textContent="playing music"+data.id+" of 3"
        },

        setUpdate(){
            let seekPosition = 0;
            if(!isNaN(sellectors.cur_track.duration)){
                seekPosition = sellectors.cur_track.currentTime * (100 / sellectors.cur_track.duration);
                sellectors.seekSlider.value = seekPosition;
        
                let currentMinutes = Math.floor(sellectors.cur_track.currentTime / 60);
                let currentSeconds = Math.floor(sellectors.cur_track.currentTime - currentMinutes * 60);
                let durationMinutes = Math.floor(sellectors.cur_track.duration / 60);
                let durationSeconds = Math.floor(sellectors.cur_track.duration - durationMinutes * 60);
        
                if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
                if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
                if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
                if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
        
                sellectors.currentTime.textContent = currentMinutes + ":" + currentSeconds;
                sellectors.totalTime.textContent = durationMinutes + ":" + durationSeconds;
            }
        },
        playTrack(){
            sellectors.cur_track.play();
            sellectors.trackArt.classList.add('rotate');
            sellectors.playPause.innerHTML = '<i class="fa fa-pause-circle fa-2x"></i>';
        },
         pauseTrack(){
            sellectors.cur_track.pause();
            sellectors.trackArt.classList.remove('rotate');
            sellectors.playPause.innerHTML = '<i class="fa fa-play-circle fa-2x"></i>';
        }

    }
    const getter={
        getCurTrack(){
            return sellectors.cur_track
        },
        getPlayPuase(){
            return sellectors.playPause
        },
        getNextBtn(){
            return sellectors.next;
        },
        getPrevBtn(){
            return sellectors.prev;
        },
        getRepeatBtn(){
            return sellectors.repeat;
        },
        getRandomBtn(){
            return sellectors.random;
        },
      getSeekSlider(){
        return sellectors.seekSlider;
      }

    }

    return {
        setter,
        getter
    }
})();

/***********************************   STORE   *******************************/
const Store=(()=>{
    const musicList=[
        {
        id:1,
        img : 'img/1.jpeg',
        name : 'Stay',
        artist : 'The Bieber',
        music : 'audio/1.mp3'
        },
        {
        id:2,
        img : 'img/2.jpeg',
        name : 'With Us',
        artist : 'The Kid LAROI',
        music : 'audio/2.mp3'
        },
        {
        id:3,
        img : 'img/3.jpeg',
        name : 'Only',
        artist : 'Justin Bieber',
        music : 'audio/3.mp3'
        },
       
    ]
    const setter={

    }
    const getter={
        getMusicLen(){
            return musicList.length;
        },
        getMusic(id){
            return musicList[id-1];
        },
    
    }
    return {
        setter,
        getter
    }

})();

/************************************  CONTROLLER   ******************************/
const Controller=(()=>{
    let index=1;
    // let track_index = 0;
    let isPlaying = false;
    let isRandom = false;
    let updateTimer;
    const init=()=>{
        
        let currentMusic=Store.getter.getMusic(index);
        View.setter.setTrack(currentMusic);
        updateTimer = setInterval(View.setter.setUpdate, 1000);
        View.getter.getSeekSlider().addEventListener('change',()=>{
            let seekto = View.getter.getCurTrack().duration * (View.getter.getSeekSlider().value / 100);
            View.getter.getCurTrack().currentTime = seekto;
        })
        
        View.getter.getCurTrack().addEventListener('ended',()=>{
            index++;
            if(index < Store.getter.getMusicLen() && isRandom === true){
                let random_index = Number.parseInt(Math.random() * Store.getter.getMusicLen());
                index = random_index;
            }else if(index>Store.getter.getMusicLen()){
                index = 1;
            }
            let currentMusic=Store.getter.getMusic(index);
            View.setter.setTrack(currentMusic);
            View.setter.playTrack()
        })

        View.getter.getPlayPuase().addEventListener('click',()=>{
           if(isPlaying){
            View.setter.pauseTrack();
            isPlaying=false; 
           } else{
            View.setter.playTrack();
            isPlaying=true
           }
        })

        View.getter.getNextBtn().addEventListener('click',()=>{
            index++;
            if(index < Store.getter.getMusicLen() && isRandom === true){
                let random_index = Number.parseInt(Math.random() * Store.getter.getMusicLen());
                index = random_index;
            }else if(index>Store.getter.getMusicLen()){
                index = 1;
            }
            let currentMusic=Store.getter.getMusic(index);
            View.setter.setTrack(currentMusic);
            View.setter.playTrack()
            
            }
        )

        View.getter.getPrevBtn().addEventListener('click',()=>{
            index--;
            if(index ==0){
                index = Store.getter.getMusicLen();
            }
            let currentMusic=Store.getter.getMusic(index);
            View.setter.setTrack(currentMusic);
            View.setter.playTrack()
        
            }
        )

        View.getter.getRepeatBtn().addEventListener('click',()=>{
            let currentMusic=Store.getter.getMusic(index);
            View.setter.setTrack(currentMusic);
            updateTimer = setInterval(View.setter.setUpdate, 1000);
            View.setter.playTrack()
        })

        View.getter.getRandomBtn().addEventListener('click',()=>{
            if(isRandom){
                isRandom = false;
                View.getter.getRandomBtn().classList.remove('randomActive');
            } else{
                isRandom=true;
                View.getter.getRandomBtn().classList.add('randomActive')

            } 
        })

    }
    return {
        init
    };

})();
Controller.init();