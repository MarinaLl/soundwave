import React from "react";
import { Link } from 'react-router-dom';

const SideBar = () => {

    const sideBarStyles = {
        backgroundColor: 'whitesmoke',
        height: '100%',
        borderRadius: '25px',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
    }

    return (
        <nav style={sideBarStyles} >
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/explore">Explorar</Link></li>
                <li><Link to="/podcasts">Podcasts</Link></li>
                <li><Link to="/events">Events</Link></li>
            </ul>
        </nav>
    );
}

export default SideBar;