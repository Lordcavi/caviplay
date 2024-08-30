let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');
let ranIcon = document.getElementById('ranIcon');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let wave = document.getElementById('wave');
let total_duration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.random-track');
let curr_track = document.createElement('audio');
let playlistElement = document.getElementById("playlist");
let loud = document.getElementById("loud");
let mute = document.getElementById("mute");

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

let playlist = [
  {
    name : 'Hallucinating',
    artist : 'Future',
    music : 'music/Hallucinating.mp3'
  },
  {
    name : 'Hey There',
    artist : 'Future feat ',
    music : 'music/Hey there.mp3'
  },
  {
    name : 'Prada dem',
    artist : 'Gunna x Offset',
    music : 'music/Prada dem.mp3'
  },
  {
    name : 'Hotel lobby',
    artist : 'Quavo x Takeoff',
    music : './music/Hotel lobby.mp3'
  }
];

function updatePlaylist() {
  playlistElement.innerHTML = '';
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = track.name;
    if (index === track_index) {
      li.classList.add('active');
    }
    li.onclick = () => loadTrack(index);
    playlistElement.appendChild(li);
    });
  } 

function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let url = URL.createObjectURL(file);
    let artist = file.name && typeof file.name === 'string' ? file.name : "Unknown Artist";

    if (artist.length > 20) {
      artist = artist.substring(0, 23);
    }

    let track = {
      name: file.name,
      artist: artist,
      music: url
    };    
    playlist.push(track);
  }
  loadTrack(track_index);
  updatePlaylist();
};


function loadTrack(index) {
  track_index = index;
  let track = playlist[track_index];
  clearInterval(updateTimer);
  reset();

  curr_track.src = track.music;
  track_name.textContent = track_index.name;
  track_artist.textContent = track.artist;
  now_playing.textContent = 'Track ' + (track_index + 1) + ' of ' + playlist.length;
  curr_track.load();
  playTrack()

  updatePlaylistHighlight();


  updateTimer = setInterval(setUpdate, 1000);
  curr_track.addEventListener('ended', nextTrack);
  random_bg_color();
}

function updatePlaylistHighlight() {
  const playlistItems = document.querySelectorAll('#playlist li');
  playlistItems.forEach((item, i) => {
    if (i === track_index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function random_bg_color() {
     let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
     let a;
  
     function populate(a) {
       for (let i = 0; i < 6; i++) {
         let x = Math.round(Math.random() * 14);
         let y = hex[x];
         a += y;
       }
       return a;
     }
     let Color1 = populate('#');
     let Color2 = populate('#');
     var angle = 'to right';
  
     let gradient = 'linear-gradient(' + angle + ',' + Color1 + ',' + Color2 + ')';
     document.body.style.background = gradient;
   }

function reset() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
  isRandom = true;
  ranIcon.src = './images/shuffle2.svg';
}

function pauseRandom () {
  isRandom = false;
  ranIcon.src = './images/shuffle.svg';
}

function repeatTrack() {
  let current_index = track_index;
  loadTrack(current_index);
  playTrack();
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  wave.classList.add('loader');
  track_art.classList.add('stroke-style');
  playpause_btn.innerHTML = '<img src="./images/pause.svg" alt="pause-track" width="25">';
  updatePlaylist();
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  wave.classList.remove('loader');
  track_art.classList.remove('stroke-style');
  playpause_btn.innerHTML = '<img src="./images/play.svg" alt="play-track" width="25">';
}

function nextTrack() {
  if (track_index < playlist.length - 1 && isRandom === false) {
    track_index += 1;
  } else if (track_index < playlist.length -1 && isRandom === true){
    let random_index = Number.parseInt(Math.random() * playlist.length);
    track_index = random_index;
  } else { 
    track_index = 0;
  }
  loadTrack(track_index);
  playTrack();
  updatePlaylist();
}

function prevTrack() {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = playlist.length - 1;
  }
  loadTrack(track_index);
  playTrack();
  updatePlaylist();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

mute.addEventListener('click' , () => {
  curr_track.volume = 0;
  volume_slider.value = 0;
})

loud.addEventListener('click', () => {
  curr_track.volume = 1;
  volume_slider.value = 100;
})

function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}


