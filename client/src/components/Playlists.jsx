import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import PlaylistRemoveRoundedIcon from '@mui/icons-material/PlaylistRemoveRounded';
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded';

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
    }, [userId, handleRemovePlaylist]);

    return (
        <>
          {playlists.length === 0 ? (
            <p>There are no more playlists.</p>
          ) : (
            <Grid container>

                {playlists.map((playlist) => (
                    <Grid item lg={3} xs={6}>

                        <Card sx={{ maxWidth: 345 }} key={playlist._id} >
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant="h6" component={Link} to={`/playlist/${playlist._id}`} style={{display: 'flex', justifyContent: 'space-between', textDecoration: 'none', color: 'black'}}>
                                        {playlist.name}
                                        <IconButton onClick={() => handleRemovePlaylist(playlist._id)}>
                                            <PlaylistRemoveRoundedIcon />   
                                        </IconButton>
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                      </Grid>
                  ))}
            </Grid>
          )}
        </>
    ); 
};

export default Playlists;
