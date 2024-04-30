import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';

const Player = ({ songData }) => {
    const [nombre, setNombre] = useState("");
    const [portada, setPortada] = useState("");

    useEffect(() => {
        if (songData) {
            setNombre(songData.nombre);
            setPortada(songData.portada);
        }
    }, [songData]);

    // Verificamos si hay una canción seleccionada
    const playerStyles = {
        backgroundColor: 'whitesmoke',
        height: '100%',
        borderRadius: '20px',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        width: '100%',
    };

    return (
        <Box p={2} style={playerStyles}>
            <Grid container>
                <Grid item>
                    {portada && <img src={portada} alt="Portada del álbum" />}
                </Grid>
                <Grid item>
                    <p>{nombre}</p>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Player;
