import { useState } from "react";

export default function PlaylistPanel({ playlists, onCreate, onDelete, onSelect, selectedPlaylist, playlistSongs, onRemoveSong, onPlay}) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const clean = name.trim();
    if (!clean) return;

    onCreate(clean);
    setName("");
  }

  return (
    <div>
      <h2>Playlists</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist"
        />
        <button type="submit">Create</button>
      </form>
      <ul>
  {playlists.map((playlist) => (
    <li key={playlist.id} onClick={() => onSelect(playlist.id)}>
      {selectedPlaylist && selectedPlaylist.id === playlist.id ? "▶ " : ""}
      {playlist.name}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(playlist.id);
        }}
      >
        ✕
      </button>
    </li>
  ))}
</ul>
{selectedPlaylist && (
  <div>
    <h3>{selectedPlaylist.name}</h3>
     <button onClick={onPlay}>Play</button>
    {playlistSongs.length === 0 && <p>Empty playlist</p>}
    <ul>
      {playlistSongs.map((song) => (
  <li key={song.id}>
    {song.title} - {song.artist}
    <button onClick={() => onRemoveSong(song.id)}>✕</button>
  </li>
))}
    </ul>
  </div>
)}
    </div>
  );
}