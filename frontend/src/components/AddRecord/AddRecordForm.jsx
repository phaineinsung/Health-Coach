import React from 'react';
import { Link } from 'react-router-dom';
import { Box, TextField, Grid, MenuItem, Typography } from '@mui/material';
import CustomButton from './CustomButton';

const AddRecordForm = ({ exercises, newRecord, handleInputChange, handleAddRecord }) => {
  return (
    <Box
      sx={{
        mt: 4,
        p: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography component="h1" variant="h4" sx={{ color: '#fff', marginBottom: 2 }}>
        운동 기록 추가
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={8}>
          <TextField
            select
            label="운동"
            name="ex_name"
            value={newRecord.ex_name}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '7px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#fff',
              },
            }}
          >
            {exercises.map((exercise) => (
              <MenuItem key={exercise.exId} value={exercise.exName}>
                {exercise.exName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="날짜"
            name="ex_date"
            type="date"
            value={newRecord.ex_date}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '7px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                padding: '10px 12px',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#fff',
              },
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="운동 시간 (분)"
            name="ex_time"
            type="number"
            value={newRecord.ex_time}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{
              mb: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '7px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                padding: '10px 12px',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#fff',
              },
            }}
          />
          <Grid container spacing={4} justifyContent="center">
            <Grid item>
              <CustomButton onClick={handleAddRecord}>추가</CustomButton>
            </Grid>
            <Grid item>
              <CustomButton component={Link} to="/mypage">마이페이지로 돌아가기</CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddRecordForm;
