// Layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { shadows } from '@mui/system';


const Layout = ({ children }) => {
  return (
    <React.Fragment>
    <CssBaseline />
      <Box component="div" sx={{ backgroundImage: 'linear-gradient(#f2eefa, #f4e8f8, #ead6fa)', height: '100vh' }} >
        <div className="layout">
            <div className="sidebar">
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/explore">Explorar</Link></li>
                    <li><Link to="/podcasts">Podcasts</Link></li>
                    <li><Link to="/events">Events</Link></li>
                </ul>
            </div>
            <div className="content">
            {children}
            </div>
        </div>
      </Box>
  </React.Fragment>
  );
};

export default Layout;
