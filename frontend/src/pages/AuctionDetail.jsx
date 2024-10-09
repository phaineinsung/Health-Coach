import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAuctionItemDetails, placeBid, endAuction } from '../api/UserApi';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

const AuctionDetail = () => {
  const { id } = useParams();
  const [auctionItem, setAuctionItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.user_num;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAuctionItemDetails(id);
      if (data.remainingTime === "경매 종료") {
        setMessage("경매가 종료되었습니다.");
      }
      setAuctionItem(data);
    };

    fetchData();
  }, [id]);

  // 경매 종료 시 API 호출
  useEffect(() => {
    if (auctionItem && auctionItem.remainingTime === "경매 종료") {
      const endAuctionProcess = async () => {
        try {
          const response = await endAuction(id);
          console.log(response.message); 
        } catch (error) {
          console.error('경매 종료 중 오류 발생:', error);
        }
      };
      endAuctionProcess();
    }
  }, [auctionItem, id]);

  const handleBid = async () => {
    if (auctionItem.remainingTime === "경매 종료") {
        setMessage("경매가 이미 종료되었습니다. 입찰할 수 없습니다.");
        return;
    }

    try {
        const response = await placeBid(id, bidAmount, userId);
        setMessage(response);
        const updatedData = await fetchAuctionItemDetails(id);
        if (updatedData.remainingTime === "경매 종료") {
            setMessage("경매가 종료되었습니다.");
        }
        setAuctionItem(updatedData);
    } catch (error) {
        setMessage('입찰 실패: ' + (error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'));
    }
  };

  const getCurrentHighestBid = () => {
    if (auctionItem.remainingTime === "경매 종료") {
      return auctionItem.highestBid ? auctionItem.highestBid : auctionItem.startPrice;
    } else {
      return auctionItem.tempHighestBid ? auctionItem.tempHighestBid : auctionItem.startPrice;
    }
  };

  if (!auctionItem) return <div>Loading...</div>;

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{fontWeight: '700'}}>{auctionItem.itemName}</Typography>
        <Typography variant="body1" gutterBottom sx={{ mt: 5, fontSize: '25px' }}>{auctionItem.content}</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, fontSize: '17px', fontWeight: '500' }}>
          시작가: {auctionItem.startPrice ? auctionItem.startPrice.toLocaleString('ko-KR') : 'N/A'} 원
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, fontSize: '17px', fontWeight: '500' }}>
          현재 최고가: {getCurrentHighestBid().toLocaleString('ko-KR')} 원
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 2, mb: 2, fontSize: '17px', fontWeight: '500' }}>
          남은 시간: {auctionItem.remainingTime}
        </Typography>
        {auctionItem.image ? (
          <img src={auctionItem.image} alt={auctionItem.itemName} width="300" />
        ) : (
          <Typography variant="body2" color="textSecondary">
            No Image Available
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Your Bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            disabled={auctionItem.remainingTime === "경매 종료"}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBid} 
            disabled={auctionItem.remainingTime === "경매 종료"}
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
            입찰하기
          </Button>
          <Button
            component={Link}
            to="/auction"
            variant="contained"
            sx={{
              ml: 80,
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
          
          {message && (
            <Typography variant="body1" color="error" sx={{ mt: 2, fontSize: '20px', fontWeight: '700' }}>
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AuctionDetail;
