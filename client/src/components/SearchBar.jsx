import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Player from './Player';

const SearchBar = () => {
    const [cancion, setCancion] = useState("");
    const [canciones, setCanciones] = useState([]);
    const [cancionSeleccionada, setCancionSeleccionada] = useState(); // Estado para la canción seleccionada

    function handleSearch(e) {
        e.preventDefault();
        if (cancion.trim() === "") {
            alert("Tienes que escribir algo");
            return;
        }
        setCancion("");
        getSong(cancion);
    }

    async function getSong(cancion) {
        const url = `https://spotify23.p.rapidapi.com/search/?q=${cancion}&type=multi&offset=0&limit=10&numberOfTopResults=5`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'e31d45b98emshbf807fed0c293e5p1380bbjsncc962975322f',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            console.log(result.tracks.items);
            setCanciones(result.tracks.items);
        } catch (error) {
            console.error(error);
        }
    }

    // Función para manejar el clic en una canción
    function handleSongClick(nombre, portada) {
        const cancionSeleccionada = { nombre, portada };
        setCancionSeleccionada(cancionSeleccionada);
        console.log('click'+cancionSeleccionada)
    }

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField id="input-with-sx" label="Search Something..." variant="standard" />
            </Box>
            <form onSubmit={handleSearch}>
                <input type="text" value={cancion} onChange={e => setCancion(e.target.value)} />
                <button type="submit">Buscar</button>
            </form>
            {canciones.map((cancion) => {
                // Obtener la primera imagen del álbum (portada)
                const portada = cancion.data.albumOfTrack.coverArt.sources[0].url;
                const nombre = cancion.data.name;
                return (
                    <div key={cancion.data.id} onClick={() => handleSongClick(nombre, portada)}>
                        <p>{cancion.data.name}</p>
                        {portada && <img src={portada} alt="Portada del álbum" />}
                    </div>
                );
            })}
            {cancionSeleccionada && <Player cancion={cancionSeleccionada}/>}
        </Box>
    );
}

export default SearchBar;
