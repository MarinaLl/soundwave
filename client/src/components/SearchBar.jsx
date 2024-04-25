import React, { useState } from 'react';

const SearchBar = () => {
    const [cancion, setCancion] = useState("")
    const [canciones, setCanciones] = useState([])

  function handleSearch(e) {
    e.preventDefault()
    if (cancion.trim() === "") {
      alert("tienes que escribir algo")
      return
    }
    setCancion("")
    getSong(cancion)
    console.log(cancion)
  }

  async function getSong(cancion){
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
      console.log(result.tracks.items)
      setCanciones(result.tracks.items)
    } catch (error) {
      console.error(error);
    }
  }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input type="text" value={cancion} onChange={e => setCancion(e.target.value)} />
                <button type="submit">Buscar</button>
            </form>
            {canciones.map((cancion) => {
              // Obtener la primera imagen del álbum (portada)
              const portada = cancion.data.albumOfTrack.coverArt.sources[0].url;

              return (
                  <div key={cancion.data.id}>
                      <p>{cancion.data.name}</p>
                      {portada && <img src={portada} alt="Portada del álbum" />}
                  </div>
              );
            })}
        </div> 
    );
} 

export default SearchBar;