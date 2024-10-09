import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Layout from '../components/layout/Layout.jsx';
import { fetchPosts, fetchFavorites, addFavorite, removeFavorite, deletePost, fetchCategories, fetchPostDetail } from '../api/UserApi';
import { SearchBar, PostCard, Pagination, PreviewPost } from '../components/Community/CommunityComponents.jsx';
import { useParams } from 'react-router-dom';
import '../assets/CustomStyles/CustomStyles.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]); // 즐겨찾기 상태
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('title+content');
  const [currentPage, setCurrentPage] = useState(0);
  const [previewPost, setPreviewPost] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [error, setError] = useState(null);
  const postsPerPage = 7;

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { user_num: null };
  const userId = currentUser.user_num;

  const { postId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시물과 카테고리 데이터를 가져옵니다.
        const [postsData, categoriesData] = await Promise.all([
          fetchPosts(),
          fetchCategories(),
        ]);

        // 게시물을 최신순으로 정렬합니다.
        const sortedPosts = postsData.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        setPosts(sortedPosts);
        setCategories(categoriesData);

        // 로그인된 경우에만 즐겨찾기 데이터를 가져옵니다.
        if (userId) {
          const favoritesData = await fetchFavorites(userId);
          setFavorites(favoritesData); // 전체 즐겨찾기 데이터를 저장
        }

        // 특정 게시물의 상세 정보를 가져옵니다.
        if (postId) {
          const postDetails = await fetchPostDetail(postId);
          setPreviewPost(postDetails);
        }
      } catch (error) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId, postId]);

  const handleFavoriteToggle = async (post_id) => {
    if (!userId) {
      alert('로그인 후에 즐겨찾기 기능을 이용할 수 있습니다.');
      return;
    }

    const favorite = favorites.find(fav => fav.post_id === post_id);

    if (favorite) {
      // 즐겨찾기 제거
      try {
        await removeFavorite(userId, favorite.star_id);
        setFavorites(favorites.filter(fav => fav.post_id !== post_id)); // 상태에서 제거
      } catch (error) {
        console.error('즐겨찾기 제거 중 오류 발생:', error);
        alert('즐겨찾기 제거 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } else {
      // 즐겨찾기 추가
      try {
        const response = await addFavorite(userId, post_id);
        setFavorites([...favorites, { post_id, star_id: response.star_id }]); // 상태에 추가
      } catch (error) {
        console.error('즐겨찾기 추가 중 오류 발생:', error);
        alert('즐겨찾기 추가 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(0);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
      console.error('Access token is missing');
      alert('로그인 후에 삭제할 수 있습니다.');
      return;
    }
  
    if (!favorites || favorites.length === 0) {
      alert('즐겨찾기 데이터가 없습니다. 삭제를 진행할 수 없습니다.');
      return;
    }
  
    const starId = favorites[0]?.star_id; // 배열의 첫 번째 요소에서 star_id 가져오기
  
    if (!starId) {
      alert('즐겨찾기 ID가 없습니다. 삭제를 진행할 수 없습니다.');
      return;
    }
  
    if (window.confirm('삭제하시겠습니까?')) {
      try {
        await removeFavorite(userId, starId);
        await deletePost(id, token);
        console.log('Post deleted successfully');
        setPosts(posts.filter((post) => post.postId !== id));
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('게시물 삭제 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
      }
    }
  }; // 비동기식 데이터 렌더링 조건부로 변경
  
  const handleMouseEnter = (post) => {
    const timeout = setTimeout(() => {
      setPreviewPost(post);
    }, 1000);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setPreviewPost(null);
  };

  const filteredPosts = posts.filter((post) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchField === 'title') {
      return post.title.toLowerCase().includes(searchTermLower);
    } else if (searchField === 'content') {
      return post.content.toLowerCase().includes(searchTermLower);
    } else {
      return (
        post.title.toLowerCase().includes(searchTermLower) ||
        post.content.toLowerCase().includes(searchTermLower)
      );
    }
  });

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * postsPerPage;
  const currentPageData = filteredPosts.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <Layout>
      <Container>
        <Box sx={{ mt: 4, display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
              커뮤니티
            </Typography>
            <SearchBar
              searchField={searchField}
              handleSearchFieldChange={handleSearchFieldChange}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              isLoggedIn={Boolean(userId)}
            />
            {error && (
              <Typography variant="body2" sx={{ color: 'red' }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentPageData.map((post) => (
                <PostCard
                  key={post.postId}
                  post={post}
                  userId={userId}
                  categories={categories}
                  onFavoriteToggle={() => handleFavoriteToggle(post.postId)}
                  onDelete={() => handleDelete(post.postId)}
                  onMouseEnter={() => handleMouseEnter(post)}
                  onMouseLeave={handleMouseLeave}
                  isFavorite={favorites.some((fav) => fav.post_id === post.postId)}
                />
              ))}
            </Box>
            <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
          </Box>
          {previewPost && <PreviewPost post={previewPost} />}
        </Box>
      </Container>
    </Layout>
  );
};

export default Community;