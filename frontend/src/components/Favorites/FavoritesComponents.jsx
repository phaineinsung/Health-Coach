import React from 'react';
import { Grid, Card, CardContent, Typography, IconButton, Box, Select, MenuItem, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import ReactPaginate from 'react-paginate';
import '../../assets/CustomStyles/CustomStyles.css';

// FavoritesList 컴포넌트: 즐겨찾기된 게시물 목록을 렌더링합니다.
const FavoritesList = ({ favorites, handleRemoveFavorite }) => {
  if (favorites.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ color: '#fff' }}>
        즐겨찾기한 게시물이 없습니다
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {favorites.map((fav, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Card
            sx={{
              mb: 2,
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              borderRadius: '16px',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
              <Link 
                to={`/community/${fav.post.postId}`} 
                state={{ fromFavorites: true, star_id: fav.star_id }} // star_id를 함께 전달
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {fav.post.title}
              </Link>
              </Typography>
              <Typography>{fav.post.content}</Typography>
              <Typography>{new Date(fav.post.uploadDate).toLocaleString()}</Typography>
            </CardContent>
            <IconButton
              aria-label="remove favorite"
              onClick={() => handleRemoveFavorite(fav.star_id, fav.post.postId)}
              sx={{ color: 'gold' }}
            >
              <StarIcon />
            </IconButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

/*<Typography variant="body2" color="text.secondary">
                      작성자: {post.user_num || '정보 없음'}
                    </Typography>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // 클릭 이벤트 전파 방지
                        handleRemoveFavorite(post.star_id, post.post_id);
                      }}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <StarIcon sx={{ color: 'gold' }} />
                    </IconButton>
                    <Link to={`/community/${post.post_id}`} style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="text.primary">
                        자세히 보기
                      </Typography>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>  */

// SearchBar 컴포넌트: 검색 필드와 검색어를 입력할 수 있는 검색 바를 렌더링합니다.
const SearchBar = ({ searchField, setSearchField, searchTerm, setSearchTerm, setCurrentPage }) => {
  const handleSearch = () => {
    setCurrentPage(0);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          variant="outlined"
          sx={{
            width: '150px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            color: '#fff',
            '& .MuiSelect-icon': {
              color: '#fff',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
            },
            '& .MuiMenuItem-root': {
                  color: '#000',
                },
          }}
        >
          <MenuItem value="title">제목</MenuItem>
          <MenuItem value="content">내용</MenuItem>
          <MenuItem value="title+content">제목+내용</MenuItem>
        </Select>
        <TextField
          label="검색"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <IconButton
          onClick={handleSearch}
          sx={{
            p: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#fff',
              color: 'gold',
            },
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

// PaginationComponent 컴포넌트: 페이지네이션을 처리하여 페이지 간 이동을 제공합니다.
const PaginationComponent = ({ pageCount, handlePageClick }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        disabledClassName={'disabled'}
      />
    </Box>
  );
};

export { FavoritesList, SearchBar, PaginationComponent };