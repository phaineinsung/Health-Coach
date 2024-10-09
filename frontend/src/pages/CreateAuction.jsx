import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { createAuctionItem, uploadFile } from '../api/UserApi';

const CreateAuction = () => {
  const [itemName, setItemName] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.user_num;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setSelectedFileName(file.name); // 파일명 설정
    setUploading(true);

    try {
      const uploadedFileUrl = await uploadFile(file);
      setFileUrl(uploadedFileUrl); // 업로드된 파일의 URL 설정
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFileUrl(null); // 파일 URL을 null로 설정하여 이미지를 제거
    setSelectedFileName(''); // 선택된 파일명 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('item_name', itemName);
    formData.append('start_price', startPrice);
    formData.append('user_num', userId);  
    formData.append('content', content);
    if (fileUrl) {
      formData.append('imageUrl', fileUrl); // 파일 URL을 폼 데이터에 추가
    }

    try {
      await createAuctionItem(formData);
      navigate('/auction');
    } catch (error) {
      console.error('경매 아이템을 등록하는 중 오류 발생:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        경매 상품 등록
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="상품 이름"
          fullWidth
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'transparent' }, '&.Mui-focused fieldset': { borderColor: 'transparent' } }, '& .MuiInputBase-input': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#fff' } }}
        />
        <TextField
          label="시작가 입력"
          fullWidth
          value={startPrice}
          onChange={(e) => setStartPrice(e.target.value)}
          sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'transparent' }, '&.Mui-focused fieldset': { borderColor: 'transparent' } }, '& .MuiInputBase-input': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#fff' } }}
        />
        <TextField
          label="내용" 
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'transparent' }, '&.Mui-focused fieldset': { borderColor: 'transparent' } }, '& .MuiInputBase-input': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#fff' } }}
        />

        {fileUrl && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom sx={{ color: '#fff' }}>
              업로드된 이미지:
            </Typography>
            <img 
              src={fileUrl} 
              alt="Uploaded" 
              style={{ width: '100%', height: 'auto', borderRadius: '10px', margin: '20px 0' }} 
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemoveImage}
              sx={{ textTransform: 'none', mt: 2 }}
            >
              이미지 제거
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            component="label"
            variant="contained"
            disabled={uploading}
            sx={{
              borderColor: '#fff',
              color: '#fff',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#fff', color: 'gold' },
              marginRight: '1rem',
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input
              type="file"
              onChange={handleFileUpload}
              hidden
            />
          </Button>

          <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
            {selectedFileName || '선택된 파일 없음'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>  
          <Button 
            type="submit" 
            variant="contained" 
            sx={{
              mr: 1,
              borderColor: '#fff',
              color: '#fff',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#fff',
                color: 'gold',
              }
            }}
          >
            작성하기
          </Button>
          <Button
            component={Link}
            to="/auction"
            variant="contained"
            sx={{
              borderColor: '#fff',
              color: '#fff',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#fff',
                color: 'gold',
              }
            }}
          >
            목록
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateAuction;
