import React from 'react';
import { Box, Grid, TextField, Button, FormControl, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import styled from 'styled-components';

const StyledFormHelperText = styled(FormHelperText)`
  width: 100%;
  padding-left: 16px;
  font-weight: 700 !important;
  color: #d32f2f !important;
`;

const StyledBox = styled(Box)`
  padding-bottom: 40px !important;
`;

const RegisterForm = ({
  handleSubmit,
  handleAgree,
  checked,
  emailError,
  passwordState,
  passwordError,
  nameError,
  registerError,
  email,
  setEmail,
  password,
  setPassword,
  rePassword,
  setRePassword,
  name,
  setName,
}) => {
  return (
    <StyledBox component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <FormControl component="fieldset" variant="standard">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              autoFocus
              fullWidth
              type="email"
              id="email"
              name="email"
              label="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
            />
          </Grid>
          <StyledFormHelperText>{emailError}</StyledFormHelperText>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              type="password"
              id="password"
              name="password"
              label="비밀번호 (숫자+영문자+특수문자 8자리 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordState}
            />
          </Grid>
          <StyledFormHelperText>{passwordState}</StyledFormHelperText>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              type="password"
              id="rePassword"
              name="rePassword"
              label="비밀번호 재입력"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              error={!!passwordError}
            />
          </Grid>
          <StyledFormHelperText>{passwordError}</StyledFormHelperText>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!nameError}
            />
          </Grid>
          <StyledFormHelperText>{nameError}</StyledFormHelperText>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox onChange={handleAgree} color="primary" checked={checked} />}
              label="회원가입 약관에 동의합니다."
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          size="large"
        >
          회원가입
        </Button>
      </FormControl>
      <StyledFormHelperText>{registerError}</StyledFormHelperText>
    </StyledBox>
  );
};

export default RegisterForm;
