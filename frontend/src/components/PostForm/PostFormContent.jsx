import React from 'react';
import { Container, Typography, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';

// PostFormContent 컴포넌트: 게시물 작성 및 수정 폼을 렌더링합니다.
const PostFormContent = ({ id, title, setTitle, content, setContent, categoryId, setCategoryId, handleFileUpload, handleSubmit, categories, uploading, error, selectedFileName, fileUrl, handleRemoveImage }) => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
          {id ? '글 수정' : '글 작성'}
        </Typography>
        <TextField
          label="제목"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'transparent' },
              '&.Mui-focused fieldset': { borderColor: 'transparent' },
            },
            '& .MuiInputBase-input': { color: '#fff' },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
          }}
        />
        <TextField
          label="내용"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            mb: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'transparent' },
              '&.Mui-focused fieldset': { borderColor: 'transparent' },
            },
            '& .MuiInputBase-input': { color: '#fff' },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
          }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="category-label" sx={{ color: 'rgba(255, 255, 255, 0.5)', '&.Mui-focused': { color: '#fff' } }}>카테고리</InputLabel>
          <Select
            labelId="category-label"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              '& .MuiSelect-icon': { color: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            }}
          >
            {Array.isArray(categories) && categories.map((category) => (
              <MenuItem key={category.ctgId} value={category.ctgId}>
                {category.ctgName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* 업로드된 이미지 미리보기 */}
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
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderColor: '#fff',
              color: '#fff',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              textTransform: 'none',
              marginRight: '1rem',
              '&:hover': {
                backgroundColor: '#fff',
                color: 'gold',
              }
            }}
          >
            {id ? '수정하기' : '작성하기'}
          </Button>
          <Button
            component={Link}
            to="/community"
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
            취소
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default PostFormContent;
