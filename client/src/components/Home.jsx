import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlaylistRemoveRoundedIcon from '@mui/icons-material/PlaylistRemoveRounded';
import Playlists from './Playlists';
import Explore from './Explore';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

const Home = () => {
    
      
    return (
        <Box>
            <Card sx={{ maxWidth: 390 }} >
                <CardActionArea sx={{display: 'flex'}} component={Link} to={`/favSongs`}>
                    <CardMedia
                        component="img"
                        height="64"
                        image="/images/favSong.png"
                        alt="green iguana"
                        style={{width: '64px'}}
                    />
                    <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography style={{display: 'flex', justifyContent: 'space-between', textDecoration: 'none', color: 'black'}}>
                            Liked Songs
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <h3 style={{margin: '15px 0px'}}>Playlists</h3>
            <Playlists />
            <h3 style={{margin: '15px 0px'}}>Explore</h3>
            <Explore />
        </Box>
    );
};

export default Home;
