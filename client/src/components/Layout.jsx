// Layout.jsx
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import SideBar from './SideBar';
import Player from './Player';

const Layout = ({ children }) => {
  return (
    <React.Fragment>
    <CssBaseline />
      
      <Grid container columnSpacing={3} sx={{ backgroundImage: 'linear-gradient(#f2eefa, #f4e8f8, #ead6fa)', margin: '0px', height: '100vh' }}>
        <Grid item lg={2} p={3}>
          <SideBar />
        </Grid>
        <Grid container lg={9} p={3}>
          <Grid item lg={12} sx={{maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto'}}>
            {children}
          </Grid>
          <Grid item lg={12} sx={{height: '6rem'}}>
            <Player />
          </Grid>
        </Grid>
      </Grid>
      
  </React.Fragment>
  );
};

export default Layout;
