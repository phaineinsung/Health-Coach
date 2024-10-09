import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, CssBaseline, Box, Avatar, Typography, ThemeProvider, createTheme } from '@mui/material';
import { registerUser } from '../api/UserApi';
import RegisterForm from '../components/Register/RegisterForm';

const theme = createTheme();

const Register = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleAgree = (event) => {
    setChecked(event.target.checked);
  };

  const handlePost = async (data) => {
    try {
      const response = await registerUser(data);
      if (response) {
        console.log(response.message);
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err.response.data.message);
        setRegisterError(err.response.data.message);
      } else {
        console.error('Error registering user:', err);
        setRegisterError('회원가입에 실패하였습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // e.target을 통해 폼 필드에 직접 접근하여 값을 가져옵니다.
    const joinData = {
      email: e.target.email.value,
      name: e.target.name.value,
      pw: e.target.password.value,
      rePassword: e.target.rePassword.value,
    };

    const { email, name, pw, rePassword } = joinData;

    const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!emailRegex.test(email)) setEmailError('올바른 이메일 형식이 아닙니다.');
    else setEmailError('');

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegex.test(pw))
      setPasswordState('숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!');
    else setPasswordState('');

    if (pw !== rePassword) setPasswordError('비밀번호가 일치하지 않습니다.');
    else setPasswordError('');

    const nameRegex = /^[가-힣a-zA-Z]+$/;
    if (!nameRegex.test(name) || name.length < 1) setNameError('올바른 이름을 입력해주세요.');
    else setNameError('');

    if (!checked) alert('회원가입 약관에 동의해주세요.');

    if (
      emailRegex.test(email) &&
      passwordRegex.test(pw) &&
      pw === rePassword &&
      nameRegex.test(name) &&
      checked
    ) {
      handlePost(joinData);
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
            회원가입
          </Typography>
          <RegisterForm
            handleSubmit={handleSubmit}
            handleAgree={handleAgree}
            checked={checked}
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            password={password}
            setPassword={setPassword}
            passwordState={passwordState}
            rePassword={rePassword}
            setRePassword={setRePassword}
            passwordError={passwordError}
            name={name}
            setName={setName}
            nameError={nameError}
            registerError={registerError}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
