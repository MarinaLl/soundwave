import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

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
                'X-RapidAPI-Key': 'b6f92e1a57mshc52dbe3485039b8p13426fjsnf6bb2b8240c7',
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
        <Box sx={{ width: '100%', height: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    
                    {explorar.map((elemento, index) => {
                        
                        if (elemento && elemento.content && elemento.content.data && elemento.content.data.data) {
                            const banner = elemento.content.data.data.cardRepresentation.artwork.sources[0].url;
                            return (
                                <Grid item xs={2} sm={2} lg={2} xl={2}>
                                     <Card sx={{ maxWidth: 345 }}>
                                        <CardActionArea key={index}>
                                            <CardMedia
                                            component="img"
                                            height="200"
                                            image={banner}
                                            alt="green iguana"
                                            />
                                            {/* <CardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                
                                                {elemento.content.data.data.cardRepresentation.title.transformedLabel}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                
                                            </Typography>
                                            </CardContent> */}
                                        </CardActionArea>
                                    </Card>
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
