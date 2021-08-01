// // Code template taken from html5rocks.com/en/tutorials/webaudio/intro
// window.AudioContext = window.AudioContext || window.webkitAudioContext;
// let context = new AudioContext();
// const url = "../audio/animal_crossing_bgm.wav";
// let musicBuffer = null;
// let source = null;

// document.querySelector(".start-game").addEventListener("click", function () {
//   context.resume().then(() => {
//     console.log("Playback resumed successfully");
//     console.log("this is it", context.state);
//   });
// });

// function runAudio() {
//   loadAudio(url);
//   setTimeout(function () {
//     playAudio(musicBuffer);
//   }, 500);
// }

// function loadAudio(url) {
//   /*The Web Audio API uses an AudioBuffer for short- to medium-length sounds.
//   The basic approach is to use XMLHttpRequest for fetching sound files. */
//   let request = new XMLHttpRequest();
//   request.open("GET", url, true);
//   // The audio file data is binary (not text), so we set the responseType of the request to 'arraybuffer'
//   request.responseType = "arraybuffer";

//   // Calls the function once (undecoded) audio file has been loaded
//   request.onload = function () {
//     // Take the audio file that is stored in request.response and decode it
//     context.decodeAudioData(request.response, function (buffer) {
//       musicBuffer = buffer;
//     });
//   };
//   request.send();
//   console.log(musicBuffer);
// }

// function playAudio(buffer) {
//   // Create a sound source
//   source = context.createBufferSource();
//   source.loop = true;
//   // Tell the source which sound to play
//   source.buffer = buffer;
//   // Connect source to context's destination (the speakers)
//   source.connect(context.destination);
//   // Play the source now
//   source.start(0);
// }

// export { loadAudio, playAudio, runAudio };
