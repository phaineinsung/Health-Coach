import React, { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

import Layout from "./components/layout/Layout";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import IntroPage from "./pages/IntroPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage";
import Community from './pages/Community.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostForm from './pages/PostForm.jsx';
import AddRecordPage from './pages/AddRecordPage';
import FavoritesPage from './pages/FavoritesPage';
import ScrollToTop from './components/ScrollToTop';
import AuctionList from './pages/AuctionList';
import AuctionDetail from './pages/AuctionDetail';
import CreateAuction from './pages/CreateAuction';
import NotFoundPage from './pages/NotFoundPage'; // 404 페이지 컴포넌트 임포트
import { setupAxiosInterceptors } from './authService'; // 인터셉터 설정 함수 (Token)


const App = () => {
  useEffect(() => {
    setupAxiosInterceptors(); // 앱이 로드될 때 한 번만 인터셉터 설정 ( JWT Token 설정)
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/add-record" element={<AddRecordPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/new" element={<PostForm />} />
          <Route path="/community/edit/:id" element={<PostForm />} />
          <Route path="/community/:id" element={<PostDetail />} />
          <Route path="/auction" element={<AuctionList />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/create-auction" element={<CreateAuction />} />
          <Route path="*" element={<NotFoundPage />} /> {/* 잘못된 경로 접근 시 404 페이지로 이동 */}
        </Routes>
      </Layout>
      <Footer attr={"footer__wrap section score3 bg-black"} />
    </HashRouter>
  );
};

export default App;
