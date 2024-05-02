// Layout.jsx
import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import SideBar from './SideBar';
import Player from './Player';

const Layout = ({ children }) => {

  const [songData, setSongData] = useState(null);

  const handleSongData = (song) => {
    setSongData(song)
  }

  // Clonar cada elemento hijo y pasar las props adicionales
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onSongData: handleSongData });
    }
    return child;
  });

  return (
    <React.Fragment>
    <CssBaseline />
      
      <Grid container columnSpacing={3} sx={{ backgroundImage: 'linear-gradient(#f2eefa, #f4e8f8, #ead6fa)', margin: '0px', height: '100vh' }}>
        <Grid item lg={2} p={3}>
          <SideBar />
        </Grid>
        <Grid container lg={9} p={3}>
          <Grid item lg={12} sx={{maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto'}}>
            {/* {childrenWithProps} */}
          </Grid>
          <Grid item lg={12} sx={{height: '6rem'}}>
            <Player songData={songData} />
          </Grid>
        </Grid>
      </Grid>
      
  </React.Fragment>
  );
};

export default Layout;
