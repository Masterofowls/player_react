import { useState } from "react";
import { useEffect } from "react";
import SongList from "./components/SongList";
import Audio from "./components/Audio";
import Viewer from "./components/Viewer";
import PlaylistPanel from "./components/PlaylistPanel";

const API_URL = "http://localhost:3000";

const REPEAT_MODES = ['off', 'all', 'one']

export default function App() {
  const[songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [queue, setQueue] = useState([])
  const [baseQueue, setBaseQueue] = useState([]);
  const [query, setQuery] = useState("")
  const [isShuffle, setIsShuffle] = useState(false)
  const [loading, setLoading] = useState(true)
  const [repeat, setRepeat] = useState('off')
  const [likedIds, setLikedIds] = useState(()=>{
    const saved = localStorage.getItem('likedIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [playlists, setPlaylists] = useState(() => {
  const saved = localStorage.getItem("playlists");
  return saved ? JSON.parse(saved) : [];
});
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [error, setError] = useState(null)

  useEffect(()=>{
    async function loadSongs(){
      try {
        const response = await fetch(`${API_URL}/songs`)
        if (!response.ok){
          throw new Error("Server error: " + response.status)
        }
        const data = await response.json();
        setSongs(data)
        setQueue(data)
        setBaseQueue(data);
      } catch (error) {
        console.log(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadSongs()
  },[])

  useEffect(()=>{
    localStorage.setItem('likedIds', JSON.stringify(likedIds))
  }, [likedIds])

  useEffect(() => {
  localStorage.setItem("playlists", JSON.stringify(playlists));
}, [playlists]);

  function handleSelect(song){
    const inQueue = queue.some((item) => item.id === song.id);

  if (!inQueue) {
    setQueue(songs);
    setBaseQueue(songs);
    setIsShuffle(false);
  }

  setCurrentSong(song);
  }

  function handleNext() {
  if (!currentSong || queue.length === 0) return;

  const index = queue.findIndex((song) => song.id === currentSong.id);
  if (index === -1 || (repeat === 'off' && index === queue.length - 1)) return;

  const nextIndex = (index + 1) % queue.length;
  setCurrentSong(queue[nextIndex]);
}

function handlePrev() {
  const index = queue.findIndex((song) => song.id === currentSong.id);
  const prevIndex = (index - 1 + queue.length) % queue.length;
  setCurrentSong(queue[prevIndex]);
}

function shuffle(songs){
  const songs2 = [...songs]
  for(let i = songs2.length -1; i > 0 ; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [songs2[i], songs2[j]] = [songs2[j], songs2[i]]
  }
  return songs2
}

function handleShuffle() {
  if (isShuffle) {
    setQueue(baseQueue);
    setIsShuffle(false);
  } else {
    const rest = baseQueue.filter((song) => !currentSong || song.id !== currentSong.id);
    const mixed = shuffle(rest);
    setQueue(currentSong ? [currentSong, ...mixed] : mixed);
    setIsShuffle(true);
  }
}

function handleRepeat(){
  const index = REPEAT_MODES.indexOf(repeat);
  setRepeat(REPEAT_MODES[(index + 1) % REPEAT_MODES.length])
}

const search = query.trim().toLowerCase();

const filteredSongs = songs.filter((song) => {
  const matchesSearch =
    song.title.toLowerCase().includes(search) ||
    song.artist.toLowerCase().includes(search);
  const matchesLiked = !showLikedOnly || likedIds.includes(song.id);

  return matchesSearch && matchesLiked;
});

const selectedPlaylist = playlists.find(
  (playlist) => playlist.id === selectedPlaylistId
);

const playlistSongs = selectedPlaylist
  ? selectedPlaylist.songIds
      .map((id) => songs.find((song) => song.id === id))
      .filter(Boolean)
  : [];

function handleLike(id) {
  if (likedIds.includes(id)) {
    setLikedIds(likedIds.filter((favId) => favId !== id));
  } else {
    setLikedIds([...likedIds, id]);
  }
}

function handleCreatePlaylist(name) {
  const newPlaylist = { id: Date.now(), name: name, songIds: [] };
  setPlaylists([...playlists, newPlaylist]);
}

function handleDeletePlaylist(id) {
  setPlaylists(playlists.filter((playlist) => playlist.id !== id));
}

function handleSelectPlaylist(id) {
  setSelectedPlaylistId(id);
}

function handleAddToPlaylist(songId) {
  if (!selectedPlaylist) return;
  if (selectedPlaylist.songIds.includes(songId)) return;

  setPlaylists(
    playlists.map((playlist) =>
      playlist.id === selectedPlaylistId
        ? { ...playlist, songIds: [...playlist.songIds, songId] }
        : playlist
    )
  );
}

function handleRemoveFromPlaylist(songId) {
  setPlaylists(
    playlists.map((playlist) =>
      playlist.id === selectedPlaylistId
        ? { ...playlist, songIds: playlist.songIds.filter((id) => id !== songId) }
        : playlist
    )
  );
}

function handlePlayPlaylist() {
  if (playlistSongs.length === 0) return;
  setQueue(playlistSongs);
  setCurrentSong(playlistSongs[0]);
  setIsShuffle(false);
  setBaseQueue(playlistSongs);
}

  if (loading){
    return <p>Loading...</p>
  }

  if  (error){
    return <p> Error: {error}</p>
  }
  return (
    <div>
      <h1>Player</h1>
      <p>
        {currentSong ? `Now playing: ${currentSong.title}`: "Nothing selected"}
      </p>
        <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search songs"
      />
      <p>Search: {query}</p>
      <SongList songs={filteredSongs} onSelect={handleSelect}  likedIds={likedIds} onLike={handleLike} onAddToPlaylist={handleAddToPlaylist}
  canAdd={Boolean(selectedPlaylist)}/>
      <Audio song={currentSong} onNext={handleNext} repeat={repeat} isOnlySong={queue.length === 1}/>
      <button className={isShuffle ? "is-active" : ""} onClick={handleShuffle}>Shuffle: {isShuffle ? "on" : "off"}</button>
      <button className={`${repeat !== "off" ? "is-active" : ""} ${repeat === "one" ? "is-repeat-one" : ""}`} onClick={handleRepeat} aria-label={`Repeat ${repeat}`} title={`Repeat ${repeat}`}>Repeat: {repeat}</button>
      <button onClick={() => setShowLikedOnly(!showLikedOnly)}>
       Liked only: {showLikedOnly ? "on" : "off"}
      </button>
      <Viewer song={currentSong} onNext={handleNext} onPrev={handlePrev} />
      <PlaylistPanel playlists={playlists} onCreate={handleCreatePlaylist} onDelete={handleDeletePlaylist}  onSelect={handleSelectPlaylist} selectedPlaylist={selectedPlaylist}
      playlistSongs={playlistSongs} onRemoveSong={handleRemoveFromPlaylist} onPlay={handlePlayPlaylist}/>
    </div>
  );
}
