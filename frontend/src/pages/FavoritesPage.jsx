import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import { fetchFavorites, removeFavorite, fetchPostDetail } from '../api/UserApi';
import { FavoritesList, SearchBar, PaginationComponent } from '../components/Favorites/FavoritesComponents';
import '../assets/CustomStyles/CustomStyles.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('title+content');
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.user_num;

  const fetchFavoritesData = useCallback(async () => {
    try {
      const favoritesData = await fetchFavorites(userId);

      // 각 즐겨찾기 항목에 대해 해당 게시물의 상세 데이터를 가져와 결합
      const enrichedFavorites = await Promise.all(
        favoritesData.map(async (favorite) => {
          const postDetail = await fetchPostDetail(favorite.post_id);
          return {
            ...favorite,
            post: postDetail,
          };
        })
      );

      console.log('Enriched favorites:', enrichedFavorites);
      setFavorites(enrichedFavorites.reverse());
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavoritesData();
  }, [fetchFavoritesData]);

  const handleRemoveFavorite = (star_id, post_id) => {
    console.log('star_id:', star_id); // 확인용 로그
    console.log('post id:', post_id); // 확인용 로그
  // 즐겨찾기 제거 API 호출
  removeFavorite(userId, star_id)
    .then(() => {
      // API 호출 성공 시, 로컬 상태에서 즐겨찾기 항목 제거
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.star_id !== star_id));
    })
    .catch(error => {
      console.error('Failed to remove favorite:', error);
      alert('즐겨찾기 해제 중 오류가 발생했습니다. 다시 시도해 주세요.');
    });
};

  const filteredFavorites = favorites.filter(fav => {
    const title = fav.post?.title || '';
    const content = fav.post?.content || '';
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (searchField === 'title') {
      return title.toLowerCase().includes(lowerSearchTerm);
    } else if (searchField === 'content') {
      return content.toLowerCase().includes(lowerSearchTerm);
    } else {
      return title.toLowerCase().includes(lowerSearchTerm) || content.toLowerCase().includes(lowerSearchTerm);
    }
  });

  const offset = currentPage * postsPerPage;
  const currentPageData = filteredFavorites.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(filteredFavorites.length / postsPerPage);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography component="h1" variant="h4" sx={{ color: '#fff', marginBottom: 2 }}>
          즐겨찾기 목록
        </Typography>
        <SearchBar
          searchField={searchField}
          setSearchField={setSearchField}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
        />
        <FavoritesList
          favorites={currentPageData}
          handleRemoveFavorite={handleRemoveFavorite}
        />
        <PaginationComponent
          pageCount={pageCount}
          handlePageClick={({ selected }) => setCurrentPage(selected)}
        />
      </Grid>
    </Grid>
  );
};

export default Favorites;
