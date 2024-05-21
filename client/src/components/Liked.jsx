import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PlaylistRemoveRoundedIcon from '@mui/icons-material/PlaylistRemoveRounded';
import Tooltip from '@mui/material/Tooltip';

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
    }, [userId, favoriteSongs]);
    

    function createData(id, songId, image, name, album, artist) {
        return { id, songId, image, name, album, artist };
    }

    const rows = favoriteSongs.map((song) => {
        const album = song.album?.name || 'Unknown Album'; // Verificar si existe el álbum y obtener el nombre
        const images = song.album.images[2].url;
        const artists = song.album?.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'; // Verificar si existen artistas dentro del álbum y obtener sus nombres

        return createData(song._id, song.songId, images, song.name, album, artists);
    });

    // Función para manejar el clic en una canción
    function handleSongClick(nombre, portada, cancionID) {
        const cancionSeleccionada = { nombre, portada, cancionID };
        console.log(cancionSeleccionada);
        
        if (typeof onSongData === 'function') {
            console.log(cancionID)
            onSongData(cancionSeleccionada);
        }
    }

    const handleRemoveSong = async (songId) => {
        try {
            const response = await fetch(`http://localhost:4000/like/remove/${userId}/${songId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Si la canción se eliminó correctamente, actualiza la lista de canciones favoritas
                const updatedFavoriteSongs = favoriteSongs.filter(song => song.songId !== songId);
                setFavoriteSongs(updatedFavoriteSongs);
            } else {
                throw new Error('Error al eliminar la canción de favoritos');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box p={2}>
            <h1>Liked Songs</h1>
            <TableContainer >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>Track</TableCell>
                            <TableCell align='left'></TableCell>
                            <TableCell align="left">Album</TableCell>
                            <TableCell align="left">Artist(s)</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)', }
                                    , cursor: 'pointer' }} onClick={() => handleSongClick(row.name, row.image, row.songId)}>
                                    <TableCell component="th" scope="row"><img src={row.image} alt="album cover" style={{borderRadius: '5px'}} /></TableCell>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell align="left">{row.album}</TableCell>
                                    <TableCell align="left">{row.artist}</TableCell>
                                    
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    There are no more liked songs.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Liked;
