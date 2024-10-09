import React from 'react';
import PropTypes from 'prop-types'; // PropTypes 추가
import { Card, CardContent, CardActions, Typography, Box, Avatar, IconButton, TextField, MenuItem, Select, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ReactPaginate from 'react-paginate';


// PostCard 컴포넌트: 각 게시물의 카드 레이아웃을 담당
export const PostCard = ({ post, userId, categories, onFavoriteToggle, onDelete, onMouseEnter, onMouseLeave, isFavorite }) => (
  <Card
    sx={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 2,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {post.image ? (
          <Avatar src={`${post.image}`} alt={post.title} sx={{ width: 56, height: 56 }} />
        ) : (
          <Avatar sx={{ width: 56, height: 56, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            {post.title ? post.title[0] : '?'}
          </Avatar>
        )}
        <Box>
          <Typography
            variant="h5"
            component={Link}
            to={`/community/${post.postId}`}
            style={{ textDecoration: 'none', color: '#fff' }}
          >
            {post.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {post.content}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {new Date(post.uploadDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {categories[post.ctgId] || '카테고리 없음'}
          </Typography>
        </Box>
        <IconButton onClick={onFavoriteToggle}>
          {isFavorite ? (
            <StarIcon sx={{ color: 'gold' }} />
          ) : (
            <StarBorderIcon sx={{ color: '#fff' }} />
          )}
        </IconButton>
      </Box>
    </CardContent>
    {userId && userId === post.userNum && (
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          component={Link}
          to={`/community/edit/${post.postId}`}
          aria-label="edit"
          sx={{ color: '#fff', '&:hover': { color: 'gold' } }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={onDelete}
          sx={{ color: '#fff', '&:hover': { color: 'red' } }}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    )}
  </Card>
);

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  userId: PropTypes.number,
  categories: PropTypes.object.isRequired,  // 이 부분 추가
  onFavoriteToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

// SearchBar 컴포넌트: 검색과 필터링을 처리
export const SearchBar = ({ searchField, handleSearchFieldChange, searchTerm, setSearchTerm, handleSearch, isLoggedIn }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: isLoggedIn ? 'space-between' : 'flex-end', width: '100%', gap: 2 }}>
      {isLoggedIn && (
        <Button
          component={Link}
          to="/community/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
          }}
        >
          글쓰기
        </Button>
      )}
      <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, justifyContent: 'flex-end' }}>
        <Select
          value={searchField}
          onChange={handleSearchFieldChange}
          variant="outlined"
          sx={{
            width: '150px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            borderRadius: '10px',
            '& .MuiSelect-icon': { color: '#fff' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
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
            color: '#fff',
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
            '&:hover': { backgroundColor: '#fff', color: 'gold' },
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  </Box>
);

SearchBar.propTypes = {
  searchField: PropTypes.string.isRequired,
  handleSearchFieldChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired, // 로그인 여부 prop 추가
};

// Pagination 컴포넌트: 페이지네이션 기능을 처리
export const Pagination = ({ pageCount, handlePageClick }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      breakClassName={'break-me'}
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
      breakLinkClassName={'page-link'}
    />
  </Box>
);

Pagination.propTypes = {
  pageCount: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
};

// PreviewPost 컴포넌트: 게시물의 미리보기 내용을 표시
export const PreviewPost = ({ post }) => (
  <Box
    sx={{
      ml: 4,
      width: '30%',
      position: 'fixed',
      right: '5%',
      top: '20%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '10px',
      p: 2,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Typography variant="h5" sx={{ color: '#333', mb: 2 }}>
      {post.title}
    </Typography>
    <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
      {post.content}
    </Typography>
    {post.image && (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={`${post.image}`}
          alt={post.title}
          style={{ maxWidth: '100%', borderRadius: '10px' }}
        />
      </Box>
    )}
  </Box>
);

PreviewPost.propTypes = {
  post: PropTypes.object.isRequired,
};
