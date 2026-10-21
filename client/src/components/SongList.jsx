import "./SongList.css";
import SongItem from "./SongItem";

export default function SongList({songs, onSelect, onLike, likedIds, onAddToPlaylist, canAdd}) {
  return (
    <ul>
        {songs.map((song)=>(
            <SongItem key={song.id} song={song} onSelect={onSelect} isLiked={likedIds.includes(song.id)} onLike={onLike} onAddToPlaylist={onAddToPlaylist}
  canAdd={canAdd}/>
        ))}
    </ul>
  );
}