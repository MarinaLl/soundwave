import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

const Player = ({ songData }) => {
    const [userId, setUserId] = useState('');
    const [nombre, setNombre] = useState("");
    const [portada, setPortada] = useState("");
    const [cancionID, setCancionID] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const audioRef = useRef(null);
    const [album, setAlbum] = useState({
        albumId: '',
        album_type: '',
        name: '',
        release_date: '',
        total_tracks: 0,
        images: [],
        artists: []
    });
    const [artists, setArtists] = useState([]);
    
    // Obtener Usuario
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
    }, []);

    // Obtener los datos de la cancion
    useEffect(() => {
        if (songData) {
            setNombre(songData.nombre);
            setPortada(songData.portada);
            setCancionID(songData.cancionID);
            // Check si la cancion existe y ahorrar peticiones a la API de Spotify
            handleExistingSong(songData.cancionID);
        }
    }, [songData]);

    // Recargar la etiqueta audio para que suene la cancion nueva
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); // Recargar el audio cuando cambie la URL
        }
    }, [audioUrl]);

    // Guardar los artistas despues de obtener la info a traves de la api
    function saveArtists(artistData) {
        const formattedArtists = artistData.artists.map((artist) => ({
            artistId: artist.id,
            name: artist.name,
            genres: artist.genres,
            images: artist.images
        }));
        setArtists(formattedArtists);
        console.log("artistas guardados:", formattedArtists);
    }

    // Obtener info de la api Spotify
    async function getArtist(artists) {
        const artistIds = [];
    
        // Iterar sobre el array de artistas
        artists.map(async (artist) => {
            // Obtener el ID del artista y hacer push en el array artistIds
            artistIds.push(artist.id);
        });
    
        const url = `https://spotify23.p.rapidapi.com/artists/?ids=${artistIds}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b6f92e1a57mshc52dbe3485039b8p13426fjsnf6bb2b8240c7',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            saveArtists(result);
        } catch (error) {
            console.error(error);
        }
    }

    // Obtener datos de la canción a través de Api Spotify
    async function getSongAudio(songID) {
        const url = `https://spotify23.p.rapidapi.com/tracks/?ids=${songID}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b6f92e1a57mshc52dbe3485039b8p13426fjsnf6bb2b8240c7',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result)
            setAudioUrl(result.tracks[0].preview_url);
            getArtist(result.tracks[0].album.artists);
            setAlbum({
                albumId: result.tracks[0].album.id,
                album_type: result.tracks[0].album.album_type,
                name: result.tracks[0].album.name,
                release_date: result.tracks[0].album.release_date,
                total_tracks: result.tracks[0].album.total_tracks,
                images: result.tracks[0].album.images,
                artists: artists
            })
            const datosCancion = {
                songId: songID,
                name: result.tracks[0].name,
                songUrl: audioUrl,
                popularity: result.tracks[0].popularity,
                track_number: result.tracks[0].track_number,
                addedBy: userId,
                album: album
            }
            console.log('==============');
            console.log(datosCancion);
            createNewSong(datosCancion);
            
        } catch (error) {
            console.error(error);
        }
    }

    async function createNewSong(songData) {
        try {
            const response = await fetch('http://localhost:4000/songs/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(songData),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
            } else {
                const error = await response.json();
                console.error(error.message);
            }
        } catch (error) {
            console.error('Error al crear la canción en el backend:', error);
        }
    }
    
    async function checkSongExists(songID) {
        try {
            const response = await fetch(`http://localhost:4000/songs/exists/${songID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                return result.exists;
            } else {
                const error = await response.json();
                console.error('Error al verificar la canción:', error.message);
                return false;
            }
        } catch (error) {
            console.error('Error al verificar la canción en el backend:', error);
            return false;
        }
    }

    // Handle de si la canción existe o no
    async function handleExistingSong(songID) {
        const exists = await checkSongExists(songID);

        // Si existe haremos una peticion a la Base de Datos
        if (exists) {
            console.log('La canción ya existe.');
            // Array con los datos 
        } else { // Si no, Buscaremos por la api de Spotify y guardaremos los datos en la DB
            getSongAudio(songID);
        }
    }
    

    const handleLike = async () => {

        try {
            const response = await fetch('http://localhost:4000/favorites/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    songId: cancionID,
                    songData: {
                        nombre: nombre,
                        portada: portada,
                        // Añadir otros datos necesarios de la canción
                    },
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
            } else {
                const error = await response.json();
                console.error(error.message);
            }
        } catch (error) {
            console.error('Error al añadir la canción a favoritos:', error);
        }
    };

    return (
        <Box p={2} style={{ backgroundColor: 'whitesmoke', height: '100%', borderRadius: '10px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', width: '100%' }}>
            <Grid container>
                <Grid item>
                    {portada && <img src={portada} alt="Portada del álbum" />}
                </Grid>
                <Grid item>
                    <p>{nombre}</p>
                </Grid>
                <Grid item>
                    <audio ref={audioRef} controls>
                        <source src={audioUrl} type="audio/mpeg" />
                        Tu navegador no soporta la etiqueta de audio.
                    </audio>
                </Grid>
                <Grid item>
                    <button onClick={handleLike}>
                        
                       
                    </button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Player;
