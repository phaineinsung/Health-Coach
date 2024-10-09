import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const LoginForm = ({ onSubmit, loginError }) => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(email, pw);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="pw"
        label="Password"
        type="password"
        id="pw"
        autoComplete="current-password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          borderRadius: '15px',
          padding: '0.5rem 1rem',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#fff',
            color: 'gold',
          },
        }}
      >
        로그인
      </Button>
      {loginError && <Typography color="error">{loginError}</Typography>}
    </Box>
  );
};

export default LoginForm;