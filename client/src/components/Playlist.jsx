import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlaylistRemoveRoundedIcon from '@mui/icons-material/PlaylistRemoveRounded';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';

const Playlist = ({ onSongData }) => {
    const { playlistId } = useParams();
    const [playlistInfo, setPlaylistInfo] = useState(null);
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState('');

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
                   // setSongs(data.songs); // Almacena las canciones en el estado songs
                } else {
                    console.error('Error al obtener la playlist:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener la playlist:', error);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    function createData(id, songId, image, name, album, artist) {
        return { id, songId, image, name, album, artist };
    }
    
    if (!playlistInfo) {
        return <p>Cargando...</p>;
    }

    const rows = playlistInfo.songs.map((song) => {
        const album = song.album?.name || 'Unknown Album'; // Verificar si existe el álbum y obtener el nombre
        const images = song.album.images[2].url;
        const artists = song.album?.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'; // Verificar si existen artistas dentro del álbum y obtener sus nombres

        //console.log(song.album.images[2].url)
        return createData(song._id, song.songId, images, song.name, album, artists);
    });

    const removeSongFromPlaylist = async (playlistId, songId) => {
        try {
          const response = await fetch(`http://localhost:4000/playlists/${playlistId}/remove/${songId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar la canción.');
          }
      
          const data = await response.json();
          console.log(data.message);
          return data;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
    };
      
    const handleRemoveSong = async (songId) => {
        try {
            const result = await removeSongFromPlaylist(playlistId, songId);
            console.log(result.message);
            setMessage(result.message);
            // Actualiza el estado de songs para reflejar los cambios
            setSongs((prevSongs) => prevSongs.filter((song) => song._id !== songId));
            
            // También actualiza playlistInfo
            setPlaylistInfo((prevInfo) => ({
                ...prevInfo,
                songs: prevInfo.songs.filter((song) => song._id !== songId),
            }));
        } catch (error) {
            console.error('Error al eliminar la canción:', error);
            //setMessage(result.message);
        }
    };

    // Función para manejar el clic en una canción
    function handleSongClick(nombre, portada, cancionID) {
        const cancionSeleccionada = { nombre, portada, cancionID };
        console.log(cancionSeleccionada);
        
        if (typeof onSongData === 'function') {
            console.log(cancionID)
            onSongData(cancionSeleccionada);
        }
    }

    const handleRemovePlaylist = async (playlistId) => {
        try {
            const response = await fetch(`http://localhost:4000/playlists/del/${playlistId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            });
        
            if (response.ok) {
            const data = await response.json();
            console.log(data.message); // Mensaje de éxito
            // Aquí puedes agregar cualquier lógica adicional que desees ejecutar después de eliminar la playlist
            } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message); // Mensaje de error
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

    return (
        <Box>
            <Grid container>
                <Grid item lg={6}>
                    <h1>{playlistInfo.name}</h1>
                </Grid>
                <Grid item lg={6}>
                    
                </Grid>
                <Grid item xs={12}>
                    <p>Creada por: {playlistInfo.createdBy}</p>
                </Grid>
            </Grid>
            {message &&
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    {message}
                </Alert>
            } {/* Renderiza el mensaje si existe */}
            <TableContainer >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>Track</TableCell>
                            <TableCell align='left'></TableCell>
                            <TableCell align="left">Album</TableCell>
                            <TableCell align="left">Artist(s)</TableCell>
                            <TableCell align="right"></TableCell>
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
                                    <TableCell align="right">
                                        <Tooltip title="Remove from playlist">
                                            <IconButton onClick={() => handleRemoveSong(row.id)}>
                                                <PlaylistRemoveRoundedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay canciones en esta playlist.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Playlist;
