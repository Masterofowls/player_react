export default function SongItem({song, onSelect, isLiked, onLike, canAdd, onAddToPlaylist}) {
  return (
    <li onClick={()=> onSelect(song)}>
        {song.title} - {song.artist}
        <button onClick={(e) => {
            e.stopPropagation();
            onLike(song.id)
        }}>
            {isLiked ? "♥" : "♡"}
        </button>
        {canAdd && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onAddToPlaylist(song.id);
    }}
  >
    +
  </button>
)}
    </li>
  );
}