// Plays music.wav during gameplay

const url = "./audio/music.wav";
let audioElement;
const controlMusic = document.querySelector(".control-music");
let isPlaying = false;
let isMute = false;

function loadAudio() {
  audioElement = new Audio(url);
  audioElement.loop = true;
  document.querySelector(".music").addEventListener("click", function () {
    if (isPlaying) {
      // Mute music
      isMute = true;
      stopAudio();
      controlMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      // Play music
      isMute = false;
      playAudio();
      controlMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    isPlaying = !isPlaying;
  });
}

function playAudio(url) {
  if (!isMute) {
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          // Automatic playback started!
          isPlaying = true;
          controlMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
        })
        .catch(function (error) {
          isPlaying = false;
          // Automatic playback failed.
          // Show a UI element to let the user manually start playback.
          controlMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
        });
    }
  }
}

function stopAudio() {
  audioElement.pause();
}

export { loadAudio, playAudio, stopAudio };
