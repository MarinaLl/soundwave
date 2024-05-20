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

    function createData(name, album, artist) {
        return { name, album, artist };
    }
    
    if (!playlistInfo) {
        return <p>Cargando...</p>;
    }

    const rows = playlistInfo.songs.map((song) => {
        const album = song.album?.name || 'Unknown Album'; // Verificar si existe el álbum y obtener el nombre
        const artists = song.album?.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'; // Verificar si existen artistas dentro del álbum y obtener sus nombres
        return createData(song.name, album, artists);
    });
      

    return (
        <Box>
            <div>
                <h1>{playlistInfo.name}</h1>
                <p>Creada por: {playlistInfo.createdBy}</p>
                
            </div>
            <TableContainer >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Track</TableCell>
                            <TableCell align="right">Album</TableCell>
                            <TableCell align="right">Artist(s)</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                                <TableCell align="right">{row.album}</TableCell>
                                <TableCell align="right">{row.artist}</TableCell>
                                <TableCell align="right">like</TableCell>
                                <TableCell align="right">remove song from playlist</TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Playlist;
