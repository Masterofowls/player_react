import "./Audio.css";
import { useState } from "react";
import { useRef } from "react";

export default function Audio({song, onNext, repeat, isOnlySong}) {
    const audioRef = useRef(null)
    const [isPlaying , setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1)

    if (!song){
    return null
  }

  function handletoggle(){
    if (isPlaying){
        audioRef.current.pause()
    } else {
        audioRef.current.play()
    }
  }
function handleVolume(e) {
  const newVolume = Number(e.target.value);
  audioRef.current.volume = newVolume;
  setVolume(newVolume);
}

  function handleSeek(e) {
  const newTime = Number(e.target.value);
  audioRef.current.currentTime = newTime;
  setCurrentTime(newTime);
}

function handleEnded() {
  if (repeat === 'all') {
    onNext();
  } else if (repeat === 'off') {
    setIsPlaying(false);
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${minutes}:${rest}`;
}

  
  return (
    <div>
      <audio ref={audioRef} src={song.audio_url} loop={repeat === 'one' || (repeat === 'all' && isOnlySong)} autoPlay onPlay={()=> setIsPlaying(true)} onPause={()=> setIsPlaying(false)} onEnded={handleEnded} onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} onLoadedMetadata={() => setDuration(audioRef.current.duration)}/>
        <button onClick={handletoggle}>{isPlaying ? "Pause" : "Play"}</button>
        <p>{formatTime(currentTime)} / {formatTime(duration)}</p>
        <input
  type="range"
  min="0"
  max={duration}
  step="0.1"
  value={currentTime}
  onChange={handleSeek}
/>
<input
  type="range"
  min="0"
  max="1"
  step="0.01"
  value={volume}
  onChange={handleVolume}
/>
    </div>
  );
}