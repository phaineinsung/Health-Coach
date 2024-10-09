import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Avatar, CssBaseline, Button } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import LoginForm from '../components/login/LoginForm';
import { loginUser } from '../api/UserApi';

const theme = createTheme();

const StyledButton = styled(Button)({
  borderRadius: '20px',
  padding: '0.5rem 1rem',
  textTransform: 'none',
});

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  

  const handleLogin = async (email, pw) => {
    try {
      const response = await loginUser(email, pw);
      console.log('Login response:', response);

      if (response.token && response.user) {
        localStorage.setItem('accessToken', response.token.accessToken);
        localStorage.setItem('refreshToken', response.token.refreshToken);
        window.dispatchEvent(new Event('storage'));

        const currentUser = {
          user_num: response.user.user_num,
          email: response.user.email,
          name: response.user.name,
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isLoggedIn', 'true');

        navigate('/mypage');
        window.location.reload();
      } else {
        setLoginError('로그인에 실패하였습니다. 이메일이나 비밀번호를 확인해 주세요.');
      }
    } catch (error) {
      console.error('Login failed', error);
      setLoginError('로그인에 실패하였습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} />
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <LoginForm onSubmit={handleLogin} loginError={loginError} />
          <StyledButton
            component={Link}
            to="/register"
            fullWidth
            variant="outlined"
            sx={{ mt: 2, mb: 3 }}
          >
            회원가입
          </StyledButton>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;