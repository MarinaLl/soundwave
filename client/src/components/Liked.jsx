import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

const Liked = ({ onSongData }) => {
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [userId, setUserId] = useState('');
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
                    setUserId(data.userId);
                } else {
                    throw new Error('Error al obtener la información del perfil');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProfile();
    }, [navigate])

    useEffect(() => {
        const fetchFavoriteSongs = async () => {
            try {
                const response = await fetch(`http://localhost:4000/like/all/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setFavoriteSongs(data);
                } else {
                    throw new Error('Error al obtener las canciones favoritas');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchFavoriteSongs();
    }, [userId]);

    // Función para manejar el clic en una canción
    function handleSongClick(cancionID) {
        console.log('click')
        const cancionSeleccionada = {cancionID };
        //setCancionSeleccionada(cancionSeleccionada);
        
        if (typeof onSongData === 'function') {
            console.log(cancionID)
            onSongData(cancionSeleccionada)
        }
    }

    return (
        <Box p={2} >
            <Typography variant="h5" gutterBottom>Liked Songs</Typography>
            <Grid container spacing={2}>
                {favoriteSongs.map(song => (
                    <Grid item key={song._id} xs={12} onClick={() => handleSongClick(song.songId)}>
                        <Box display="flex" alignItems="center">
                            {console.log(song)}
                            <img src={song.album.images[2].url} alt="" srcset="" />
                            <Typography variant="body1">{song.name} - {song.album.name}</Typography>
                            
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Liked;
