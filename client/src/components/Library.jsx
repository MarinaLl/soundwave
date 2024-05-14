import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Library = () => {
  const [userId, setUserId] = useState("");
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:4000/users/profile', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setUserId(data.userId);
            } else {
                throw new Error('Error al obtener la información del perfil');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchPlaylists = async () => {
        try {
            const response = await fetch(`http://localhost:4000/like/all/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setSongs(data);
            } else {
                console.error('Error al obtener playlists:', response.statusText);
            }
        } catch (error) {
            console.error('Error al obtener playlists:', error);
        }
    };

    if (userId) {
        fetchPlaylists();
    }
}, [userId]);
  
  return (
    <>
      <h1>My Library</h1>
      <ul>
            {songs.map(song => (
                <li key={song._id}>
                    <p>Nombre: {song.name}</p>
                    <p>Artista: {song.artist}</p>
                    <p>Álbum: {song.album}</p>
                    <p>URL: {song.songUrl}</p>
                    {/* Aquí puedes agregar más información de la canción */}
                </li>
            ))}
        </ul>

    </>
  );
};

export default Library;
