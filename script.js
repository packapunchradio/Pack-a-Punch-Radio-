https://stream-uk1.radiopush.net/stream
// --------- CONFIG: replace these values ----------
const STATION_NAME = "PACK A PUNCH RADIO";
const STREAM_URL = "https://your-stream-url-here/stream"; // <-- Put your Icecast/SHOUTcast stream URL or direct mp3
// If you don't have a stream, add a file named "sample-stream.mp3" to the same folder and set STREAM_URL = "sample-stream.mp3"
// Formspree: replace with your form id if you want contact form to email you
// -------------------------------------------------

document.getElementById('station-name').textContent = STATION_NAME;
document.getElementById('stream-url').textContent = STREAM_URL;
document.getElementById('year').textContent = new Date().getFullYear();

const audio = new Audio();
audio.crossOrigin = "anonymous";
audio.src = STREAM_URL;
audio.preload = "none"; // don't preload to protect mobile data
audio.type = "audio/mpeg";

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const vol = document.getElementById('vol');
const streamStatus = document.getElementById('stream-status');
const nowTitle = document.getElementById('now-title');
const nowSub = document.getElementById('now-sub');

// Volume control
vol.addEventListener('input', ()=> audio.volume = vol.value);

// Play/Pause handlers
playBtn.addEventListener('click', async ()=>{
  try{
    // start load
    streamStatus.textContent = "Connecting…";
    await audio.play();
    playBtn.style.display = 'none';
    pauseBtn.style.display = '';
    streamStatus.textContent = "Playing";
  }catch(err){
    console.error(err);
    streamStatus.textContent = "Playback blocked — tap to allow";
    // fallback: try to set preload and play again on user gesture
    audio.preload = "auto";
    playBtn.textContent = "Tap to Play ▶";
  }
});

pauseBtn.addEventListener('click', ()=>{
  audio.pause();
  playBtn.style.display = '';
  pauseBtn.style.display = 'none';
  streamStatus.textContent = "Paused";
});

// Basic error handling
audio.addEventListener('error', (e)=>{
  console.error("Audio error", e);
  streamStatus.textContent = "Stream error — check stream URL in script.js";
});

// If the stream provides metadata via ICY it's more complex to parse client-side.
// We'll show a simple rotating message if needed:
let fakeTitles = [
  "Live: DJ Mally Red — Late Night Freestyles",
  "Exclusive Interview: Pack-a-Punch A&R",
  "Now spinning: 'Tweekin' - Mally Red"
];
let idx = 0;
setInterval(()=>{
  if(audio.paused) return;
  nowTitle.textContent = fakeTitles[idx % fakeTitles.length];
  idx++;
}, 15000);

// Optional: show bitrate if server supports (client-side cannot reliably read ICY headers due to CORS).
// Note for advanced users: to display real ICY metadata, proxy the stream through a server that exposes metadata with CORS.

// Contact form success UX (Formspree)
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    // Let Formspree handle submission; show quick message
    setTimeout(()=> {
      alert("Thanks! Your message was sent. We'll get back to you soon.");
      contactForm.reset();
    }, 500);
  });
}
