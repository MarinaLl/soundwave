import React from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { Typography } from "@mui/material";

const SideBar = () => {

    const sideBarStyles = {
        backgroundColor: 'whitesmoke',
        height: '100%',
        borderRadius: '25px',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
    }

    // <nav style={sideBarStyles} >
    //         <ul>
    //             <li><Link to="/">Inicio</Link></li>
    //             <li><Link to="/explore">Explorar</Link></li>
    //             <li><Link to="/podcasts">Podcasts</Link></li>
    //             <li><Link to="/events">Events</Link></li>
    //         </ul>
    //     </nav>

    return (
        <Box style={sideBarStyles}>
            <Typography variant="h4" p={3} sx={{color: '#5A5BEF', fontFamily: 'Lobster'}}>
                SoundWave
            </Typography>
            <nav aria-label="main mailbox folders">
                <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                    <ListItemIcon>
                        <HomeRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/explore">
                    <ListItemIcon>
                        <ExploreIcon />
                    </ListItemIcon>
                    <ListItemText primary="Explore" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/search">
                    <ListItemIcon>
                        <SearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="Search" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/library">
                    <ListItemIcon>
                        <LibraryMusicIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Library" />
                    </ListItemButton>
                </ListItem>
                </List>
            </nav>
        </Box>
        
    );
}

export default SideBar;