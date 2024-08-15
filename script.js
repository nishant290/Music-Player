
let currentSong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/")
    let list = await a.text()

    let div = document.createElement("div")
    div.innerHTML = list

    let as = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs

}
let playSong = (tracks)=>{
   
    currentSong.src = "/songs/" + tracks
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".trackName").innerHTML = tracks;
    document.querySelector(".trackDuration").innerHTML = "00:00/00:00"

}

async function main() {
    let music = await getSongs()
   

    let ul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of music) {
        ul.innerHTML = ul.innerHTML + ` <li>
        <img class="invert s-3"src="play.svg" alt=""> 
        <div class="songInfo">
            <div class="songName">${song.replaceAll("%20"," ") }</div>
            <div>${decodeURI(song.split("-")[1])}</div>

        </div>
    

    </li>`;
    }

//    event listener for play the song from the library. 
    let a = document.querySelectorAll(".songName");
    
    for (const b of a) {
        console.log(b.innerHTML);
        b.addEventListener("click", element=>{
           playSong(b.innerHTML);
        })
        
     };

    //  event listener for play , prev and pause.

     play.addEventListener("click" ,()=>{

        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }else{
            currentSong.pause()
            play.src = "play.svg"
        }
     })
     next.addEventListener("click" , ()=>{
        currentSong.nextSibling;
     })
     
    //  event listener for song name and song duration.
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".trackDuration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    
   // event listner for seekbar to chenge the position

   document.querySelector(".seekbar").addEventListener("click",e =>{
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent)/100; 
   })
}
main()
