import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const Explore = () => {
    const [explorar, setExplorar] = useState([]);

    useEffect(() => {
        getExplore();
    }, []);

    async function getExplore() {
        const url = 'https://spotify23.p.rapidapi.com/browse_all/';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '7d80b0268dmshd1c138a738f085dp188607jsn25ed429a3876',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            console.log(result.data.browseStart.sections.items[0].sectionItems.items)
            setExplorar(result.data.browseStart.sections.items[0].sectionItems.items);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    
                    {explorar.map((elemento, index) => {
                        // Verificar que todos los niveles de la estructura de datos estén definidos
                        
                        if (elemento && elemento.content && elemento.content.data && elemento.content.data.data) {
                            const banner = elemento.content.data.data.cardRepresentation.artwork.sources[0].url;
                            return (
                                <Grid item xs={6} sm={6} lg={2} xl={2}>
                                    <p key={index}>
                                        <img src={banner} alt="portada explorar" /><br />
                                        {elemento.content.data.data.cardRepresentation.title.transformedLabel}
                                    </p>
                                </Grid>
                            );
                        } else {
                            return null; // O manejar el caso cuando los datos no están definidos
                        }
                    })}
                    
            </Grid>
        </Box>
    );
    
}

export default Explore;
