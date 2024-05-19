import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import IconButton from '@mui/material/IconButton';

const Player = ({ songData }) => {
    const [userId, setUserId] = useState('');
    const [nombre, setNombre] = useState("");
    const [portada, setPortada] = useState("");
    const [cancionID, setCancionID] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const audioRef = useRef(null);
    const [album, setAlbum] = useState({});
    const [artists, setArtists] = useState([]);
    const [like, setLike] = useState();
    const [existSongData, setExistSongData] = useState({});
    
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
                    console.log(data);
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

    // Obtener los datos de la canción
    useEffect(() => {
        if (songData) {
            setNombre(songData.nombre);
            setPortada(songData.portada);
            setCancionID(songData.cancionID);
            handleExistingSong(songData.cancionID);
        }
    }, [songData]);

    // useEffect(() => {
    //     handleExistingFavouriteSong(cancionID);
    // }, [like]);

    // Recargar la etiqueta audio para que suene la canción nueva
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); // Recargar el audio cuando cambie la URL
        }
    }, [audioUrl]);

    // Obtener info de la API de Spotify
    async function getArtist(artists) {
        const artistIds = artists.map(artist => artist.id);
        const url = `https://spotify23.p.rapidapi.com/artists/?ids=${artistIds.join(',')}`;
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
            const formattedArtists = result.artists.map((artist) => ({
                artistId: artist.id,
                name: artist.name,
                genres: artist.genres,
                images: artist.images
            }));
            setArtists(formattedArtists);
            return formattedArtists; // Retornar los artistas obtenidos
        } catch (error) {
            console.error(error);
            return []; // Retornar un array vacío en caso de error
        }
    }

    // Obtener datos de la canción a través de la API de Spotify
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
            console.log(result);

            // Guardar URL de audio
            const previewUrl = result.tracks[0].preview_url;
            setAudioUrl(previewUrl);

            // Obtener y guardar info de artistas
            const artistData = await getArtist(result.tracks[0].album.artists);

            // Guardar info del álbum
            const albumData = {
                albumId: result.tracks[0].album.id,
                album_type: result.tracks[0].album.album_type,
                name: result.tracks[0].album.name,
                release_date: result.tracks[0].album.release_date,
                total_tracks: result.tracks[0].album.total_tracks,
                images: result.tracks[0].album.images,
                artists: artistData
            };
            setAlbum(albumData);

            // Crear datos de la canción
            const datosCancion = {
                songId: songID,
                name: result.tracks[0].name,
                songUrl: previewUrl,
                popularity: result.tracks[0].popularity,
                track_number: result.tracks[0].track_number,
                addedBy: userId,
                album: albumData
            };
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

    const getSongDetails = async (songId) => {
        try {
          const response = await fetch(`http://localhost:4000/songs/${songId}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log("~~~~~~~~")
            console.log(data.song); // Aquí tendrás todos los datos de la canción
            setExistSongData(data.song);
            return data.song; // Retorna los datos de la canción
          } else {
            const error = await response.json();
            console.error(error.message); // Mensaje de error
            return null; // Retorna null si hay un error
          }
        } catch (error) {
          console.error('Error al obtener los detalles de la canción:', error);
          return null; // Retorna null en caso de excepción
        }
      };

    async function handleExistingSong(songID) {
        const exists = await checkSongExists(songID);

        if (exists) {
            console.log('La canción ya existe.');
            getSongDetails(songID);
        } else {
            getSongAudio(songID);
        }
    }

    const handleLike = async () => {
            try {
                const response = await fetch(`http://localhost:4000/like/check/${userId}/${cancionID}`);
    
                if (response.ok) {
                    const result = await response.json();
                    return result.isFavorite;

                } else {
                    //await addSongToFavorites();
                    
                }
            } catch (error) {
                console.error('Error al verificar la canción en favoritos:', error);
            }
        
    };

    async function handleExistingFavouriteSong() {
        const exists = await handleLike(cancionID);

        if (exists) {
            removeFavoriteSong(userId, cancionID);
            setLike(false);
        } else {
            addSongToFavorites();
            setLike(true);
        }
    }
    
    const addSongToFavorites = async () => {
        try {
            const addResponse = await fetch('http://localhost:4000/like/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    songId: cancionID,
                }),
            });
    
            if (addResponse.ok) {
                const result = await addResponse.json();
                console.log(result.message);
            } else {
                const error = await addResponse.json();
                console.error(error.message);
            }
        } catch (error) {
            console.error('Error al añadir la canción a favoritos:', error);
        }
    };

    const removeFavoriteSong = async (userId, songId) => {
        try {
            const response = await fetch(`http://localhost:4000/like/remove/${userId}/${songId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Mensaje de éxito
                return true; // Indica que se eliminó la canción de favoritos correctamente
            } else {
                const error = await response.json();
                console.error(error.message); // Mensaje de error
                return false; // Indica que hubo un error al eliminar la canción de favoritos
            }
        } catch (error) {
            console.error('Error al eliminar la canción de favoritos:', error);
            return false; // Indica que hubo un error al eliminar la canción de favoritos
        }
    };
    
    
    return (
        <Box p={2} style={{ backgroundColor: 'whitesmoke', height: '100%', borderRadius: '10px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', width: '100%' }}>
            <Grid container>
                <Grid item>
                    {portada && <img src={portada} alt="Portada del álbum" />}
                </Grid>
                <Grid item>
                    {existSongData && existSongData.album && (
                        <Box>
                            <p>{existSongData.name} - {existSongData.album.name}
                            <IconButton aria-label="like" onClick={handleExistingFavouriteSong}>
                                { like ? (
                                        <FavoriteRoundedIcon />
                                    ) : (
                                        <FavoriteBorderRoundedIcon />
                                    )
                                }
                            </IconButton>
                            </p>
                            
                            <p>
                                {existSongData.album.artists.map((artist) => (
                                    <span key={artist.artistId}>{artist.name}</span>
                                ))}
                            </p>
                        </Box>
                    )}
                </Grid>
                <Grid item>
                    <audio ref={audioRef} controls>
                        <source src={audioUrl} type="audio/mpeg" />
                        Tu navegador no soporta la etiqueta de audio.
                    </audio>
                </Grid>
                <Grid item>
                    
                </Grid>
            </Grid>
        </Box>
    );
}

export default Player;
