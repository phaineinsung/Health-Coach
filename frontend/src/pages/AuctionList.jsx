import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchAuctionItems, endAuction } from '../api/UserApi';
import ReactPaginate from 'react-paginate';
import '../assets/CustomStyles/CustomStyles.css'; // 페이지네이션 스타일

const AuctionList = () => {
  const [auctionItems, setAuctionItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9; // 페이지당 항목 수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAuctionItems();

        // 경매 종료 처리
        const updatedItems = await Promise.all(
          data.map(async (item) => {
            if (item.remainingTime === '경매 종료' && !item.processed) {
              try {
                const response = await endAuction(item.auctionId);
                console.log(response.message);
                return { ...item, processed: true };
              } catch (error) {
                console.error('경매 종료 중 오류 발생:', error);
              }
            }
            return item;
          })
        );

        updatedItems.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        setAuctionItems(updatedItems);
      } catch (error) {
        console.error('경매 아이템 목록을 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  // 페이지네이션 처리
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = auctionItems.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(auctionItems.length / itemsPerPage);

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
        경매 게시판
      </Typography>

      <Button
        component={Link}
        to="/create-auction"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ mb: 2, gab: 2 , borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' } }}
      >
        글쓰기
      </Button>

      <Grid container spacing={4}>
        {currentPageData.map(item => (
          <Grid item key={item.auctionId} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' } }}>
              <Box sx={{ flexGrow: 1 }}>
                <CardMedia
                  component="img"
                  image={item.image} // 이미지 경로 수정
                  alt={item.itemName}
                  sx={{ height: '200px', objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{ color: '#fff' }}>
                    {item.itemName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    시작 가격: {item.startPrice.toLocaleString('ko-KR')} 원
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    남은 시간: {item.remainingTime}
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/auction/${item.auctionId}`}
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' } }}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

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
          breakLinkClassName={'page-link'}
        />
      </Box>
    </Container>
  );
};

export default AuctionList;
