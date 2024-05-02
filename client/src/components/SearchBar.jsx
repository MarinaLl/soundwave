import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CircularProgress } from '@mui/material';
import Explore from './Explore';

const SearchBar = ({ onSongData }) => {
    const [cancion, setCancion] = useState("");
    const [canciones, setCanciones] = useState([]);
    const [cancionSeleccionada, setCancionSeleccionada] = useState(); // Estado para la canción seleccionada
    const [albums, setAlbums] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para controlar si la petición está en curso

    async function getSong(cancion) {
        setLoading(true); // Marcar la petición como en curso
        const url = `https://spotify23.p.rapidapi.com/search/?q=${cancion}&type=multi&offset=0&limit=20&numberOfTopResults=5`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'f3a0d03207msh780ffdd4dfe3e9bp1f5e5ajsn4f6c81338766',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            console.log(result.tracks.items);
            setCanciones(result.tracks.items);
            setAlbums(result.albums.items);
            setSearched(true); // Actualiza el estado cuando se realiza una búsqueda
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Marcar la petición como finalizada, independientemente de si fue exitosa o no
        }
    }

    function handleSearch(e) {
        e.preventDefault();
        if (cancion.trim() === "") {
            setSearched(false);
            return;
        }
        setCancion("");
        getSong(cancion);
    }

    // Función para manejar el clic en una canción
    function handleSongClick(nombre, portada, cancionID) {
        const cancionSeleccionada = { nombre, portada, cancionID };
        setCancionSeleccionada(cancionSeleccionada);
        
        if (typeof onSongData === 'function') {
            console.log(cancionID)
            onSongData(cancionSeleccionada)
        }
    }
    

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <form onSubmit={handleSearch}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField 
                        id="input-with-sx" 
                        label="Search Something..." 
                        variant="standard" 
                        value={cancion} 
                        onChange={e => setCancion(e.target.value)} 
                    />
                </Box>
            </form>
            {loading ? ( // Mostrar un spinner de carga mientras la petición está en curso
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : searched ? (
                <>
                    <h1>Tracks</h1>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>    
                        {canciones.map((cancion) => {
                            // Obtener la primera imagen del álbum (portada)
                            const portada = cancion.data.albumOfTrack.coverArt.sources[0].url;
                            const portadaMini = cancion.data.albumOfTrack.coverArt.sources[1].url;
                            const nombre = cancion.data.name;
                            const cancionID = cancion.data.id;
                            
                            return (
                                <Grid item xs={6} sm={6} lg={2} xl={2} key={cancion.data.id} onClick={() => handleSongClick(nombre, portadaMini, cancionID)}>
                                    <Card sx={{ maxWidth: 345 }}>
                                        <CardActionArea>
                                            <CardMedia
                                            component="img"
                                            height="200"
                                            image={portada}
                                            alt="Portada del álbum"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="p" component="div">
                                                    {cancion.data.name}
                                                </Typography>
                                            
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </>
            ) : (
                <Explore />
            )}
        </Box>
    );
}

export default SearchBar;
