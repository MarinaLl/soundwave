import React, { useState } from 'react';
import { Alert } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Estado para controlar la visibilidad de la alerta

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccessAlert(true); // Mostrar la alerta de éxito
        const data = await response.json();
        console.log(data.message); // Mensaje de éxito del registro
      } else {
        console.error('Error al registrar usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
    }
  };

  return (
    <div>
      {showSuccessAlert && ( // Mostrar la alerta si showSuccessAlert es verdadero
        <Alert variant="filled" severity="success">
          Registro exitoso
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
