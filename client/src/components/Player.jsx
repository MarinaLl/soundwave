import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { addFavoriteSong, removeFavoriteSong } from '../actions/favoriteSongsActions';

const Player = ({ songData }) => {
    const [nombre, setNombre] = useState("");
    const [portada, setPortada] = useState("");
    const [cancionID, setCancionID] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (songData) {
            setNombre(songData.nombre);
            setPortada(songData.portada);
            setCancionID(songData.cancionID);
            getSongAudio(songData.cancionID);
        }
    }, [songData]);

    const favoriteSongs = useSelector(state => state.favoriteSongs.favoriteSongs);

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
            setAudioUrl(result.tracks[0].preview_url);
        } catch (error) {
            console.error(error);
        }
    }

    const handleLike = () => {
        
        if (favoriteSongs.includes(cancionID)) {
            dispatch(removeFavoriteSong(cancionID));
            console.log("favoriteSongs eliminada:", favoriteSongs);
        } else {
            dispatch(addFavoriteSong(cancionID));
            console.log("favoriteSongs agregada:", favoriteSongs);
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
                    <audio controls>
                        <source src={audioUrl} type="audio/mpeg" />
                        Tu navegador no soporta la etiqueta de audio.
                    </audio>
                </Grid>
                <Grid item>
                    <button onClick={handleLike}>
                        {favoriteSongs.includes(cancionID) ? 'Unlike' : 'Like'}
                    </button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Player;
