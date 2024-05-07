import React, { useState } from 'react';
import Wave from 'react-wavify'
import Grid from '@mui/material/Unstable_Grid2';
import {TextField, Typography, Button, Paper, Box, CssBaseline, Alert} from '@mui/material';

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
    <>
      
      <CssBaseline />
      <Box fixed sx={{width: '100%', height: '100vh', backgroundImage: 'linear-gradient(#f2eefa, #f4e8f8, #ead6fa)'}} className="center">
        {/* <Wave fill='#f79902'
          paused={false}
          style={{ display: 'flex', position: 'absolute', bottom: '0' }}
          options={{
            height: 20,
            amplitude: 40,
            speed: 0.15,
            points: 8
          }}
        /> */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
              m: 1,
              width: 400,
              height: 600,
            },
          }}
        >
          <Paper elevation={24} sx={{padding: '3rem'}}>
            <Grid container rowSpacing={2} sx={{height: '100%'}}>
              <form onSubmit={handleSubmit} style={{width: '100%'}}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{color: '#5A5BEF', fontFamily: 'Lobster', textAlign: 'center'}}>
                    SoundWave
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {showSuccessAlert && ( // Mostrar la alerta si showSuccessAlert es verdadero
                    <Alert variant="filled" severity="success">
                      Registro exitoso
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    // error
                    id="username"
                    name='username'
                    label="Username"
                    variant="standard"
                    value={formData.username}
                    onChange={handleChange}
                    className='textfield'
                    // helperText="Incorrect entry."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    label="Email"
                    variant="standard"
                    type='email'
                    className='textfield'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    variant="standard"
                    value={formData.password}
                    onChange={handleChange}
                    className='textfield'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant="contained" className='btn'>Sign In</Button>
                </Grid>
              </form>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Register;
