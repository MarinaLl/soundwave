import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Playlist = () => {
    const { playlistId } = useParams();
    const [playlistInfo, setPlaylistInfo] = useState(null);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`http://localhost:4000/playlists/${playlistId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setPlaylistInfo(data);
                    setSongs(data.songs); // Almacena las canciones en el estado songs
                } else {
                    console.error('Error al obtener la playlist:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener la playlist:', error);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    return (
        <>
            {playlistInfo ? (
                <div>
                    <h1>{playlistInfo.name}</h1>
                    <p>Creada por: {playlistInfo.createdBy}</p>
                    <h2>Canciones</h2>
                    <ul>
                        {songs.map((song) => (
                            <li key={song._id}>
                                <p>Nombre: {song.name}</p>
                                <p>Artista: {song.artist}</p>
                                <p>Álbum: {song.album}</p>
                                {/* Agrega más detalles de la canción si es necesario */}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </>
    );
};

export default Playlist;
