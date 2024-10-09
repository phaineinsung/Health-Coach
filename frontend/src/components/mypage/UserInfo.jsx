//사용자 정보 컴포넌트
import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const UserInfo = ({ user, onEditClick, onDeleteClick }) => (
  <Box sx={infoBoxStyle}>
    <Typography variant="h6">이메일: {user?.email}</Typography>
    <Typography variant="h6">이름: {user?.name}</Typography>
    <Button variant="outlined" color="inherit" sx={buttonStyle} onClick={onEditClick}>
      사용자 정보 수정
    </Button>
    <Button variant="outlined" color="inherit" sx={buttonStyle} onClick={onDeleteClick}>
      사용자 정보 삭제
    </Button>
  </Box>
);

const buttonStyle = {
  borderColor: '#fff',
  color: '#fff',
  borderRadius: '20px',
  padding: '0.5rem 1rem',
  textTransform: 'none',
  marginRight: '1rem',
  '&:hover': {
    backgroundColor: '#fff',
    color: 'gold',
  },
};

const infoBoxStyle = {
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  marginBottom: 4,
};

export default UserInfo;
