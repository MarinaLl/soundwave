import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


const Playlists = () => {
    const [userId, setUserId] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate();

//   const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

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
                const response = await fetch(`http://localhost:4000/playlists/all/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setPlaylists(data);
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
          <h1>Playlists</h1>
          {playlists.length === 0 ? (
            <p>No tienes playlists.</p>
          ) : (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                    m: 1,
                    width: 80,
                    height: 80,
                    },
                }}
                >
              {playlists.map((playlist) => (
                    <Paper elevation={24} key={playlist._id}> {playlist.name}</Paper>
                ))}
            </Box>
          )}
        </>
    ); 
};

export default Playlists;
