import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// PostDetailContent 컴포넌트: 게시물의 제목, 내용, 이미지, 날짜, 카테고리를 렌더링합니다.
const PostDetailContent = ({ post, category }) => {
  return (
    <>
      <Typography variant="h4" gutterBottom sx={{fontWeight: '700'}}>{post.title}</Typography>
      <Typography variant="body1" gutterBottom sx={{ mt: 5, fontSize: '25px' }}>{post.content}</Typography>
      {post.image && (
        <img src={`${post.image}`} alt={post.title} style={{ width: '100%', height: 'auto', margin: '20px 0' }} />
      )}
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 2, fontSize: '17px', fontWeight: '500' }}>
        {new Date(post.uploadDate).toLocaleString()}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 2, fontSize: '17px', fontWeight: '500' }}>
        {post.userNum || '이메일 없음'} {/* 게시물 작성자의 사용자 번호 표시 */}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 2, fontSize: '17px', fontWeight: '500' }}>
        {category?.ctgName || '카테고리 없음'} {/* 카테고리 이름 표시 */}
      </Typography>
    </>
  );
};

// PostDetailActions 컴포넌트: 수정, 삭제, 즐겨찾기 해제 등의 액션 버튼을 렌더링합니다.
const PostDetailActions = ({ post, handleDelete, handleRemoveFavorite }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const location = useLocation();
  const isFavoritePage = location.state?.fromFavorites || false;

  const renderEditAndDeleteButtons = () => {
    if (currentUser?.user_num === post.userNum) {
      return (
        <>
          <Button
            component={Link}
            to={`/community/edit/${post.postId}`}
            variant="contained"
            color="primary"
            sx={{ 
              borderColor: '#fff',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              textTransform: 'none',
              marginRight: '1rem',
              '&:hover': {
              backgroundColor: '#fff',
              color: 'gold',
             }}
            }
          >
            수정
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ 
              textTransform: 'none',
              borderColor: '#fff',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              marginRight: '1rem',
              '&:hover': {
              backgroundColor: '#fff',
              color: 'gold',
             }}}
          >
            삭제
          </Button>
        </>
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {isFavoritePage && (
          <Button
            component={Link}
            to="/favorites"
            variant="contained"
            color="primary"
          >
            즐겨찾기 목록
          </Button>
        )}
        {renderEditAndDeleteButtons()}
        {isFavoritePage && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFavorite(post.postId);
            }}
            variant="contained"
            color="secondary"
            sx={{ textTransform: 'none' }}
          >
            즐겨찾기 해제
          </Button>
        )}
      </Box>
      <Button
        component={Link}
        to={isFavoritePage ? '/community' : '/community'}
        variant="contained"
        color="primary"
        sx={{ 
          ml: 'auto',
          textTransform: 'none',
          borderColor: '#fff',
          borderRadius: '20px',
          padding: '0.5rem 1rem',
          marginRight: '1rem',
          '&:hover': {
          backgroundColor: '#fff',
          color: 'gold',}
         }}
      >
        {isFavoritePage ? '커뮤니티' : '목록'}
      </Button>
    </Box>
  );
};

export { PostDetailContent, PostDetailActions };
