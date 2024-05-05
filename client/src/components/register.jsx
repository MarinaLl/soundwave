import React from 'react';

const Register = () => { 
    // En tu componente de formulario de registro en React

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
        };
    
        try {
        const response = await fetch('/users/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    
        if (response.ok) {
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
        <form onSubmit={handleSubmit}>
        {/* Campos del formulario (nombre de usuario, correo electrónico, contraseña, etc.) */}
        <button type="submit">Registrar</button>
        </form>
    );

}
