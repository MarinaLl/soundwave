import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Chip } from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Realiza una solicitud al servidor para obtener la información del perfil
    fetch('/users/profile', {
      method: 'GET',
      credentials: 'include' // Incluye las cookies en la solicitud
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error al obtener la información del perfil');
      }
    })
    .then(data => {
      setUsername(data.username); // Actualiza el estado con el nombre de usuario obtenido del servidor
    })
    .catch(error => {
      console.error('Error:', error);
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión si ocurre un error o no hay una sesión activa
    });
  }, [navigate]);

  return (
    <>
      <Chip
        avatar={<Avatar alt={username} src="/static/images/avatar/1.jpg" />}
        label={username}
        variant="outlined"
      />
    </>
  );
};

export default Profile;
