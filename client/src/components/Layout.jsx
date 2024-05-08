// Layout.jsx
import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import SideBar from './SideBar';
import Player from './Player';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';


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

  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = useTheme();
  // Verifica si la pantalla es grande (lg y xl)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <React.Fragment>
    <CssBaseline />
      {isLargeScreen ? (
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
      ) : (
        <Grid container sx={{ backgroundImage: 'linear-gradient(#f2eefa, #f4e8f8, #ead6fa)', margin: '0px', height: '100vh' }}>
          <Grid item xs={12} sx={{height: 'calc(100% - 7rem)'}}>
            {/* {childrenWithProps} */}
          </Grid>
          <Grid item xs={12} sx={{alignSelf: 'end', position: 'fixed'}}>
            <BottomNavigation sx={{ width: '100%', height: 'fit-content' }} value={value} onChange={handleChange}>
              <Player songData={songData} /> 
            </BottomNavigation>
            <Divider />
            <BottomNavigation sx={{ width: '100%' }} value={value} onChange={handleChange}>
              <BottomNavigationAction
                label="Home"
                value="Home"
                icon={<HomeRoundedIcon />}
              />
              <BottomNavigationAction
                label="Explore"
                value="Explore"
                icon={<ExploreIcon />}
              />
              <BottomNavigationAction
                label="Search"
                value="Search"
                icon={<SearchIcon />}
              />
              <BottomNavigationAction label="My library" value="My Library" icon={<LibraryMusicIcon />} />
            </BottomNavigation>
          </Grid>
        </Grid>
      )} 
      
  </React.Fragment>
  );
};

export default Layout;
