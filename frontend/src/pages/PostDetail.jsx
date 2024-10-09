import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import { getPostDetail, deletePost, fetchFavorites, removeFavorite, getPostCategory } from '../api/UserApi.js';
import { PostDetailContent, PostDetailActions } from '../components/PostDetail/PostDetailComponents';

// 즐겨찾기 fetch, remove import

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const [favorites, setFavorites] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.user_num;
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const location = useLocation();

  // state에서 fromFavorites와 star_id 여부 확인
  const isFavoritePage = location.state?.fromFavorites || false;
  const is_star_id = location.state?.star_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post details
        const postData = await getPostDetail(id);
        setPost(postData);
        
        // Fetch post category
        const categoryData = await getPostCategory(postData.ctgId);
        setCategory(categoryData);
        
        // Fetch user favorites
        const favoritesData = await fetchFavorites(userId);
        setFavorites(favoritesData);
        console.log('Fetched favorites data:', favoritesData);
  
      } catch (error) {
        setError('An error occurred while fetching data.');
      }
    };
  
    fetchData();
  }, [id, userId]);

  const handleDelete = () => {
    if (window.confirm('삭제를 하시겠습니까?')) {
      if (favorites && favorites.length > 0 && favorites[0].star_id) { // 페치 데이터 조건 완성시에만 렌더링
        console.log('favorites data:', favorites);
        removeFavorite(userId, favorites[0].star_id)
          .then(() => deletePost(id, token))
          .then(() => navigate('/community'))
          .catch(error => setError('게시물을 삭제하는 중 오류가 발생했습니다.'));
      } else {
        setError('즐겨찾기 데이터가 올바르지 않습니다.');
      }
    }
  };
  
  const handleRemoveFavorite = () => {
    if (is_star_id && favorites && favorites.length > 0 && favorites[0].star_id) {
      removeFavorite(userId, favorites[0].star_id)
        .then(() => {
          setPost(prevPost => ({ ...prevPost, isFavorite: false }));
          navigate('/favorites');
        })
        .catch(error => setError('즐겨찾기를 해제하는 중 오류가 발생했습니다.'));
    } else {
      setError('즐겨찾기 데이터가 올바르지 않습니다.');
    }
  };
  

  if (error) {
    return (
      <Layout>
        <Container>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Button component={Link} to="/favorites" variant="contained" sx={{ mt: 4 }}>
              즐겨찾기 목록
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <Container>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Loading...
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Box sx={{ mt: 4 }}>
                 {/* Log favorites during rendering */}
        {console.log('Current favorites state:', favorites)}

          <PostDetailContent post={post} category={category} />
          <PostDetailActions 
            post={post}
            userId={userId}
            isFavoritePage={isFavoritePage}
            handleDelete={handleDelete}
            handleRemoveFavorite={handleRemoveFavorite}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default PostDetail;
