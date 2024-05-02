import * as React from 'react';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// TODO: solo se muestra un podcast, buscar libreria entera
const Podcasts = () => {
    const [podcasts, setPodcasts] = useState([]);

    useEffect(() => {
        getPodcasts();
    }, []);

    async function getPodcasts() {
        const url = 'https://spotify23.p.rapidapi.com/podcast_episodes/?id=0ofXAdFIQQRsCYj9754UFx&offset=0&limit=50';
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
            console.log(result.data.podcastUnionV2.episodesV2.items);
            setPodcasts(result.data.podcastUnionV2.episodesV2.items);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="xl">
                <Box sx={{ height: '100vh' }} > 
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {podcasts.map((episode, index) => {
                            return (
                                <Grid item xs={6} sm={6} lg={2} xl={2}>
                                    <p key={index}>{episode.entity.data.description}
                                    <img src={episode.entity.data.coverArt.sources[0].url} alt={episode.entity.data.name} /></p>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default Podcasts;