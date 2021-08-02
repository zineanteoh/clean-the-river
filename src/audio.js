// Plays music.wav during gameplay

const url = "../audio/music.wav";
let audioElement;

function loadAudio() {
  audioElement = new Audio(url);
  audioElement.loop = true;
}

function playAudio(url) {
  audioElement.play();
}

function stopAudio() {
  audioElement.pause();
}

export { loadAudio, playAudio, stopAudio };
