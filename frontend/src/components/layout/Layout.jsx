import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios'; // axios를 import
import {
  AppBar, Toolbar, Typography, Container, List, ListItem, ListItemText, IconButton, Drawer, Box, Button, Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const theme = createTheme({
  typography: {
    h5: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
  },
  palette: {
    primary: {
      main: '#5c97c3',
    },
    secondary: {
      main: '#ff8f00',
    },
  },
});

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // 초기 상태 설정

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      // await axios.post('http://localhost:8080/users/logout'); // 서버에 로그아웃 요청
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('currentUser');
      setIsLoggedIn(false);
      navigate('/login');
      // window.location.reload(); // 강제 새로고침을 제거
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) {
      navigate(0); // 현재 페이지와 동일하면 페이지를 새로고침하도록 navigate(0) 사용
    } else {
      navigate(path);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" sx={{ backgroundColor: '#5c97c3', boxShadow: 'none', height: '80px' }}>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 1rem', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer' }} onClick={(e) => handleLinkClick(e, '/home')}>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
              Health Coach
            </Typography>
            <Typography variant="h5" sx={{ color: 'orange', fontWeight: 'bold' }}>
              .
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              onClick={(e) => handleLinkClick(e, '/community')}
              variant="outlined"
              color="inherit"
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
              커뮤니티
            </Button>
            <Button
              onClick={(e) => handleLinkClick(e, '/auction')}
              variant="outlined"
              color="inherit"
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
              경매 게시판
            </Button>
            {!isLoggedIn ? (
              <Button 
                onClick={(e) => handleLinkClick(e, '/login')}
                variant="outlined" 
                color="inherit"
                sx={{ 
                  borderColor: '#fff', 
                  color: '#fff', 
                  borderRadius: '20px', 
                  padding: '0.5rem 1rem', 
                  textTransform: 'none',
                  marginRight: 'auto',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: 'gold',
                  }
                }}
              >
                로그인
              </Button>
          ) : (
            <Button 
              onClick={(e) => handleLinkClick(e, '/mypage')}
              variant="outlined" 
              color="inherit"
              sx={{ 
                borderColor: '#fff', 
                color: '#fff', 
                borderRadius: '20px', 
                padding: '0.5rem 1rem', 
                textTransform: 'none',
                marginRight: 'auto',
                '&:hover': {
                  backgroundColor: '#fff',
                  color: 'gold',
                }
              }}
            >
              마이페이지
            </Button>
          )}
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* 고정된 AppBar의 높이만큼 공간 확보 */}
      
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <Typography variant="h6">메뉴</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            <ListItem  onClick={(e) => handleLinkClick(e, '/home')}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem  onClick={(e) => handleLinkClick(e, '/intro')}>
              <ListItemText primary="소개" />
            </ListItem>
            <ListItem  onClick={(e) => handleLinkClick(e, '/mypage')}>
              <ListItemText primary="마이페이지" />
            </ListItem>
            <ListItem  onClick={(e) => handleLinkClick(e, '/community')}>
              <ListItemText primary="게시판" />
            </ListItem>
            <ListItem  onClick={(e) => handleLinkClick(e, '/auction')}>
              <ListItemText primary="경매 게시판" />
            </ListItem>
            {!isLoggedIn && (
              <>
                <ListItem onClick={(e) => handleLinkClick(e, '/login')}>
                  <ListItemText primary="로그인" />
                </ListItem>
                <ListItem  onClick={(e) => handleLinkClick(e, '/register')}>
                  <ListItemText primary="회원가입" />
                </ListItem>
              </>
            )}
            {isLoggedIn && (
              <ListItem onClick={handleLogout}>
                <ListItemText primary="로그아웃" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
