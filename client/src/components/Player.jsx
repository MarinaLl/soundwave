import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { addFavoriteSong, removeFavoriteSong } from '../actions/favoriteSongsActions';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

const Player = ({ songData }) => {
    const [userId, setUserId] = useState('');
    const [nombre, setNombre] = useState("");
    const [portada, setPortada] = useState("");
    const [cancionID, setCancionID] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const audioRef = useRef(null);
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [album, setAlbum] = useState({
        albumId: '',
        album_type: '',
        name: '',
        release_date: '',
        total_tracks: 0,
        images: [],
        artists: []
    });
    const [artists, setArtists] = useState({
        artistId: '',
        name: '',
        genres: [],
        images: []
    });
    
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

    useEffect(() => {
        if (songData) {
            setNombre(songData.nombre);
            setPortada(songData.portada);
            setCancionID(songData.cancionID);
            getSongAudio(songData.cancionID);
        }
    }, [songData]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); // Recargar el audio cuando cambie la URL
        }
    }, [audioUrl]);

    function saveArtists(artistData) {
        artistData.map((artist) => {
            setArtists({
                artistId: artist.id,
                name: artist.name,
                genres: artist.genre,
                images: artist.images
            });
        });
        console.log("artistas guardados:")
        console.log(artists)
    }

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
                'X-RapidAPI-Key': 'f3a0d03207msh780ffdd4dfe3e9bp1f5e5ajsn4f6c81338766',
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

    async function getSongAudio(songID) {
        const url = `https://spotify23.p.rapidapi.com/tracks/?ids=${songID}`;
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
                artists: result.tracks[0].album.artists
            })
            
        } catch (error) {
            console.error(error);
        }
    }

     

    // useEffect(() => {
    //     // Fetch favorite songs for the user on component mount
    //     const fetchFavoriteSongs = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:4000/favorites/all/${userId}`);
    //             const data = await response.json();
    //             setFavoriteSongs(data);
    //         } catch (error) {
    //             console.error('Error fetching favorite songs:', error);
    //         }
    //     };

    //     fetchFavoriteSongs();
    // }, [userId]);

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
                //setFavoriteSongs([...favoriteSongs, song]);
            } else {
                const error = await response.json();
                console.error(error.message);
            }
        } catch (error) {
            console.error('Error al añadir la canción a favoritos:', error);
        }
    };

    return (
        <Box p={2} style={{ backgroundColor: 'whitesmoke', height: '100%', borderRadius: '20px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', width: '100%' }}>
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
                        
                        {favoriteSongs.includes(cancionID) ? <FavoriteBorderRoundedIcon /> : <FavoriteRoundedIcon />}
                    </button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Player;
