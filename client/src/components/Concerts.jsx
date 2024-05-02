import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const Concerts = () => {
    const [concerts, setConcerts] = useState([]);

    useEffect(() => {
        getConcerts();
    }, []);

    async function getConcerts() {
        const url = 'https://spotify23.p.rapidapi.com/concerts/?gl=US';
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
            console.log(result.events);
            setConcerts(result.events);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {concerts.map((concert, index) => {
                        return (
                            <Grid item xs={6} sm={6} lg={2} xl={2}>
                                <p key={index}>
                                    {concert.location}
                                </p>
                            </Grid> 
                        );
                    })}
            </Grid>
        </Box>
    );
    
}

export default Concerts;
