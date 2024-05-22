import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Playlists from './Playlists';
import Profile from "./Profile";
import Liked from "./Liked";
import { Paper } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

   

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:4000/users/profile', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserId(data.user);
                } else {
                    throw new Error('Error al obtener la información del perfil');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

  return (
    <Box sx={{ width: '100%' }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <h1>My Library</h1>
            <Profile />
        </Box>
        <Card sx={{ maxWidth: 390, margin: '10px 0px' }} >
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
        <h2>Playlists</h2>
        <Playlists />
   
      
    </Box>
  );
}
