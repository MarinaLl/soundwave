import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
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
import { Typography, Collapse } from "@mui/material";
import Profile from "./Profile";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const SideBar = () => {
    const [userId, setUserId] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [open, setOpen] = useState(true);
    const [openDialog, setOpenDialog] = React.useState(false);
    const navigate = useNavigate();

    const sideBarStyles = {
        backgroundColor: 'whitesmoke',
        height: '100%',
        borderRadius: '25px',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
    }

    // click para el desplegable de playlists
    const handleClick = () => {
        setOpen(!open);
    };

    // click para abrir el dialog
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    // click para cerrar el dialog
    const handleClose = () => {
        setOpenDialog(false);
    };

    // logout del usuario
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/login');
            } else {
                console.error('Error al cerrar sesión:', response.statusText);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Obtener la id del usuario en session
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:4000/users/profile', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setUserId(data.userId);
                } else {
                    throw new Error('Error al obtener la información del perfil');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Mostrar todas las playlist del usuario en el desplegable de playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`http://localhost:4000/playlists/all/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setPlaylists(data);
                } else {
                    console.error('Error al obtener playlists:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener playlists:', error);
            }
        };

        if (userId) {
            fetchPlaylists();
        }
    }, [userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const playlistName = formJson.name;
        console.log(playlistName)
        try {
          const response = await fetch(`http://localhost:4000/playlists/new/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ name: playlistName, songs: [] })
          });
    
          if (response.ok) {
            const data = await response.json();
            setPlaylists([...playlists, data.playlist]);
            handleClose();
          } else {
            console.error('Error al crear la playlist:', response.statusText);
          }
        } catch (error) {
          console.error('Error al crear la playlist:', error);
        }
    };

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
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <PlaylistPlayRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Playlists" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                
                <Collapse in={open} timeout="auto" unmountOnExit style={{maxHeight: 200, overflowY: 'auto', scrollbarColor: '#5A5BEF transparent'}}>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickOpen}>
                            <ListItemIcon>
                                <PlaylistAddRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add Playlist" />
                        </ListItemButton>
                        {playlists.map((playlist) => (
                            <ListItemButton key={playlist._id} component={Link} to={`/playlist/${playlist._id}`} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <PlaylistPlayRoundedIcon />
                                </ListItemIcon>
                                <ListItemText primary={playlist.name} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
                <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
                </List>
                <Profile />
                <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: handleSubmit
                    }}
                    
                >
                    <DialogTitle>New Playlist</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Playlist Name"
                            type="text"
                            style={{width: '400px'}}
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Create</Button>
                    </DialogActions>
                </Dialog>
                
            </nav>
        </Box>
    );
}

export default SideBar;
