//운동 기록 카드
import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const RecordCard = ({ record, isSelected, onClick, onEditClick, onDeleteClick, formatDate }) => (
  <Card
    className="custom-card"
    sx={cardStyle(isSelected)}
    onClick={onClick}
  >
    <CardContent className="custom-card-content">
      <Typography variant="h6" component="div">
        {formatDate(record.exDate)}
      </Typography>
      <Typography>운동: {record.exId}</Typography>
      <Typography>시간: {record.exTime}분</Typography>
    </CardContent>
    <CardActions className="custom-card-actions">
      <IconButton aria-label="edit" onClick={onEditClick}>
        <EditIcon style={{ color: '#fff' }} />
      </IconButton>
      <IconButton aria-label="delete" onClick={onDeleteClick}>
        <DeleteIcon style={{ color: '#fff' }} />
      </IconButton>
    </CardActions>
  </Card>
);

const cardStyle = (isSelected) => ({
  mb: 2,
  cursor: 'pointer',
  border: isSelected ? '2px solid #1976d2' : 'none',
  background: 'rgba(255, 255, 255, 0.2) !important',
  color: '#fff !important',
  borderRadius: '16px',
});

export default RecordCard;
