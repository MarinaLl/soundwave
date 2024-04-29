import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const Player = ({ cancion }) => {
    const [nombre, setNombre] = useState("");
    const [portada, setPortada] = useState("");

    useEffect(() => {
        if (cancion) {
            setNombre(cancion.nombre);
            setPortada(cancion.portada);
        }
    }, [cancion]);

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
            {console.log(nombre)}
            <h2>{nombre}</h2>
            {portada && <img src={portada} alt="Portada del álbum" />}
        </Box>
    );
}

export default Player;
