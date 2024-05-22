import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QueueRoundedIcon from '@mui/icons-material/QueueRounded';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import PauseCircleRoundedIcon from '@mui/icons-material/PauseCircleRounded';
import Slider from '@mui/material/Slider';
import Wave, { displayName } from 'react-wavify';

const Player = ({ songData }) => {
    const [userId, setUserId] = useState('');
    const [nombre, setNombre] = useState("");
    const [portada, setPortada] = useState("");
    const [cancionID, setCancionID] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const audioRef = useRef(null);
    const [album, setAlbum] = useState({});
    const [artists, setArtists] = useState([]);
    const [like, setLike] = useState(false);
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

    useEffect(() => {
        //handleExistingFavouriteSong(cancionID);
        handleExistingSong(cancionID);
        setLike(handleLike());
        console.log('cambio canción');
    }, [cancionID]);

    // Recargar la etiqueta audio para que suene la canción nueva
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); // Recargar el audio cuando cambie la URL
        }
    }, [audioUrl, existSongData.songUrl]);

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
        getSongDetails(songID);
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
                //return true; // Indica que se eliminó la canción de favoritos correctamente
            } else {
                const error = await response.json();
                console.error(error.message); // Mensaje de error
                //return false; // Indica que hubo un error al eliminar la canción de favoritos
            }
        } catch (error) {
            console.error('Error al eliminar la canción de favoritos:', error);
           // return false; // Indica que hubo un error al eliminar la canción de favoritos
        }
    };
    
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const selectedPlaylists = personName;
        console.log('Selected Playlists:', selectedPlaylists);
        addSongToPlaylists(cancionID, selectedPlaylists);
        handleClose();
    }

    const addSongToPlaylists = async (songId, playlistIds) => {
        try {
            const response = await fetch(`http://localhost:4000/playlists/add-song`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    songId,
                    playlistIds,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add song to playlists');
            }
    
            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [playlists, setPlaylists] = useState([]);

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
    }, [userId]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };

    const names = playlists;

    function getStyles(name, personName, theme) {
        return {
            fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
        };
    }

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
    
        const handleTimeUpdate = () => {
          setProgress(audio.currentTime);
        };
    
        const handleLoadedMetadata = () => {
          setDuration(audio.duration);
        };
    
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
        return () => {
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
        setIsPlaying(!isPlaying);
      };
    
      const handleProgressChange = (e) => {
        const audio = audioRef.current;
        audio.currentTime = e.target.value;
        setProgress(audio.currentTime);
      };

      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      };

      function valuetext(value) {
        return `${value}°C`;
      }
        
    return (
        <Box p={2} style={{ backgroundColor: 'whitesmoke', height: '100%', borderRadius: '10px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', width: '100%', position: 'relative' }}>
            {/* <Wave fill='#E5C4FF'
                paused={false}
                style={{ display: 'flex', position: 'absolute', bottom: '0', zIndex: '1' }}
                options={{
                    height: 10,
                    amplitude: 40,
                    speed: 0.15,
                    points: 3
                }}
            />
            <Wave fill='#DCADFF'
                paused={false}
                style={{ display: 'flex', position: 'absolute', bottom: '0', zIndex: '2' }}
                options={{
                    height: 10,
                    amplitude: 60,
                    speed: 0.15,
                    points: 6
                }}
            /> */}
            <Grid container>
                <Grid item>
                    {portada && <img src={portada} alt="Portada del álbum" style={{borderRadius: '5px'}} />}
                    
                </Grid>
                <Grid item>
                    {existSongData && existSongData.album && (
                        <Box sx={{marginLeft: '5px'}}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <p className="truncate">{existSongData.name} - {existSongData.album.name}</p>                 

                                <IconButton aria-label="like" onClick={handleExistingFavouriteSong}>
                                    {like ? (
                                        <FavoriteRoundedIcon />
                                    ) : (
                                        <FavoriteBorderRoundedIcon />
                                    )}
                                </IconButton>

                                <IconButton 
                                    className="show"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined} 
                                    onClick={handleClickOpen}>
                                    <QueueRoundedIcon />
                                </IconButton>
                            </div>
                            <p>
                                {existSongData.album.artists.map((artist) => (
                                    <span key={artist.artistId} className="truncate">{artist.name}</span>
                                ))}
                            </p>
                        </Box>
                    )}
                </Grid>
                <Grid item>
                    
                    <audio ref={audioRef} >
                        { existSongData && <source src={existSongData.songUrl} type="audio/mpeg" /> }
                        <source src={audioUrl} type="audio/mpeg" />
                        Tu navegador no soporta la etiqueta de audio.
                    </audio>
                </Grid>
                <Grid item lg={6} xs={12} sx={{alignSelf: 'flex-end'}}>
                    <Grid container>
                        <Grid item xs={12} textAlign={"center"}>
                            <IconButton onClick={togglePlayPause} sx={{padding: 0}}>
                                {isPlaying ? <PauseCircleRoundedIcon  fontSize="large"/> : <PlayCircleRoundedIcon  fontSize="large"/> }
                            </IconButton>
                        </Grid>
                        <Grid item xs={12}>
                            <audio ref={audioRef} src={existSongData?.songUrl || audioUrl} />
                            <Box sx={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
                                <span>{formatTime(progress)}</span>
                                <span>-{formatTime(duration - progress)}</span>
                            </Box>
                            <Slider
                                min="0"
                                max={duration}
                                value={progress}
                                aria-label="Temperature"
                                defaultValue={30}
                                getAriaValueText={valuetext}
                                color="secondary"
                                onChange={handleProgressChange}

                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}>
                    <div>
                        {/* <IconButton 
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined} 
                            onClick={handleClickOpen}>
                            <QueueRoundedIcon />
                        </IconButton> */}
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                component: 'form',
                                onSubmit: handleSubmit
                            }}  
                        >
                            <DialogTitle>Add Track To Playlist</DialogTitle>
                            <DialogContent>
                            <DialogContentText>
                                Select one or more playlist to add the track.
                            </DialogContentText>
                                <FormControl sx={{ width: '100%', mt: 2 }}>
                                    <InputLabel id="demo-multiple-chip-label">Playlists</InputLabel>
                                    <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    fullWidth
                                    multiple
                                    value={personName}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Playlists" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                    >
                                        {names.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name._id}
                                                style={getStyles(name, personName, theme)}
                                            >
                                            {name.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button type="submit"><SaveRoundedIcon />Save</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Player;
