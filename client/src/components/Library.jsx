import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Playlists from './Playlists';
import Profile from "./Profile";

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
                    setUserId(data.username);
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
      <Box >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Playlists" {...a11yProps(0)} />
          <Tab label="Artists" {...a11yProps(1)} />
          <Tab label="Albums" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        
        <Playlists />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}
