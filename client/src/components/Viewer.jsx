import "./Viewer.css";
export default function Viewer({ song, onNext, onPrev }) {
  if (!song) {
    return null;
  }

  return (
    <div>
      <audio src={song.url} />
      <button onClick={onPrev}>Prev</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
}