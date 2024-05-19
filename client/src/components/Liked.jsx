import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

const Liked = () => {
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

    return (
        <Box p={2} style={{ backgroundColor: 'whitesmoke', borderRadius: '10px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
            <Typography variant="h5" gutterBottom>Mis Canciones Favoritas</Typography>
            <Grid container spacing={2}>
                {favoriteSongs.map(song => (
                    <Grid item key={song._id}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body1">{song.name}</Typography>
                            <IconButton aria-label="liked">
                                <FavoriteRoundedIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Liked;
