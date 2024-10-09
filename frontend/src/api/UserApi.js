import axios from 'axios';

// API 기본 설정
//const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080'; // TEST
const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://health-coach.shop';

/*
export const fetchUserRecords = async (userNum) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/mypage/${user_num}/records`);
    const sortedData = response.data.records.sort(
      (a, b) => new Date(a.ex_date) - new Date(b.ex_date)
    );
    return sortedData;
  } catch (error) {
    console.error('운동 기록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};*/

// 특정 사용자 ID의 운동 기록을 가져옵니다.
export const fetchUserRecords = async (user_num) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mypage/${user_num}/records`);
    const records = response.data;
    console.log('API 응답:', records);

    if (Array.isArray(records)) {
      // ex_date를 기준으로 데이터 정렬
      const sortedData = records.sort((a, b) => new Date(a.exDate) - new Date(b.exDate));
      return sortedData;
    } else {
      console.error('응답 데이터가 배열이 아닙니다:', records);
      throw new Error('운동 기록을 가져오는 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('운동 기록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 특정 운동 기록을 삭제합니다.
export const deleteRecord = async (userNum, recordId) => {
  try {
    await axios.delete(`${API_BASE_URL}/mypage/${userNum}/records/${recordId}`);
  } catch (error) {
    console.error('운동 기록을 삭제하는 중 오류 발생:', error);
    throw error;
  }
};

// 특정 운동 기록을 업데이트합니다.
export const updateRecord = async (recordId, updatedRecord) => { // userNum 제거
  try {
    await axios.put(`${API_BASE_URL}/mypage/${updatedRecord.userNum}/records/${recordId}`, {
      exId: updatedRecord.exId,
      exDate: updatedRecord.exDate,
      exTime: updatedRecord.exTime,
    });
  } catch (error) {
    console.error('운동 기록을 수정하는 중 오류 발생:', error);
    throw error;
  }
};

// 사용자 정보를 업데이트합니다.
export const updateUser = async (userNum, updatedUser) => {
  try {
    await axios.put(`${API_BASE_URL}/users/${userNum}`, updatedUser);
  } catch (error) {
    console.error('사용자 정보를 수정하는 중 오류 발생:', error);
    throw error;
  }
};

// 특정 사용자를 삭제합니다.
export const deleteUser = async (userNum) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${userNum}`);
  } catch (error) {
    console.error('사용자 정보를 삭제하는 중 오류 발생:', error);
    throw error;
  }
};

// 사용자 로그인을 처리합니다.
export const loginUser = async (email, pw) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, { email, pw });
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};



// 사용자 회원가입을 처리합니다.
export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/signup`, data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// 사용자의 즐겨찾기 목록을 가져옵니다.
export const fetchFavorites = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/stars`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    throw error;
  }
};

// 즐겨찾기 추가 요청
export const addFavorite = async (userId, postId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/stars`, {
      user_num: userId,  // 이 부분이 서버에서 요구하는 필드와 일치하는지 확인
      post_id: postId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add favorite:', error);
    throw error;
  }
};
/*
// 즐겨찾기 제거 요청 및 게시물 상태 업데이트
export const removeFavoriteAndUpdatePost = async (userId, star_id, post_id) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${userId}/stars/${star_id}`);
    await axios.patch(`${API_BASE_URL}/posts/${post_id}`, { user_num: userId });
  } catch (error) {
    console.error('Failed to remove favorite or update post:', error);
    throw error;
  }
};
*/
// 즐겨찾기 제거 요청
export const removeFavorite = async (userId, star_id) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${userId}/stars/${star_id}`);
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    throw error;
  }
};

// 운동 목록을 가져옵니다.
export const fetchExercises = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/exercises`);
    return response.data;
  } catch (error) {
    console.error('운동 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 새로운 운동 기록을 추가합니다.
export const addRecord = async (recordToAdd) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/mypage/${recordToAdd.user_num}/records`, recordToAdd);
    return response.data;
  } catch (error) {
    console.error('운동 기록을 추가하는 중 오류 발생:', error);
    throw error;
  }
};

// 게시물 생성
export const createPost = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create post:', error);
    throw error;
  }
};

// 게시물 수정
export const updatePost = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/posts/${id}`, formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update post:', error);
    throw error;
  }
};

// 파일 업로드
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    return response.data.url; // 서버에서 반환된 파일 URL
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

// 카테고리 가져오기
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ctg_post`);
    const categoryMap = response.data.reduce((acc, category) => {
      acc[category.ctgId] = category.ctgName;
      return acc;
    }, {});
    return categoryMap;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};


// 게시물 삭제 요청
export const deletePost = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/posts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete post:', error);
    throw error;
  }
};

// 전체 게시물 목록을 가져옵니다.
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
};

// 최신 게시물 목록을 가져옵니다.
export const getLatestPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    const posts = response.data;

    // 날짜 기준으로 최신 게시물을 정렬
    const sortedPosts = posts.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    // 최신 게시물 6개만 반환
    return sortedPosts.slice(0, 6);
  } catch (error) {
    console.error('Failed to fetch latest posts:', error);
    throw error;
  }
};



// 카테고리 정보 가져오기
export const getPostCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ctg_post/${categoryId}`); // BASE_URL을 API_BASE_URL로 변경
    return response.data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    throw error;
  }
};

// 특정 게시물을 가져오는 함수
export const fetchPostDetail = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post details:', error);
    throw error;
  }
};

// 게시물의 상세 정보를 가져옵니다.
export const getPostDetail = async (Id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${Id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    throw error;
  }
};



// 경매 아이템 목록을 가져옵니다.
export const fetchAuctionItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auction`);
    return response.data;
  } catch (error) {
    console.error('경매 아이템 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 경매 아이템의 상세 정보를 가져옵니다.
export const fetchAuctionItemDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auction/${id}`);
    return response.data;
  } catch (error) {
    console.error('경매 아이템 상세 정보를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 경매 아이템을 생성합니다.
export const createAuctionItem = async (auctionItemData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auction`, auctionItemData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('경매 아이템을 생성하는 중 오류 발생:', error);
    throw error;
  }
};

// 경매 입찰을 등록합니다.
export const placeBid = async (id, bidAmount, bidderUsername) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auction/bid/${id}?bidAmount=${bidAmount}&bidderUsername=${bidderUsername}`);
    return response.data;
  } catch (error) {
    console.error('입찰 등록 중 오류 발생:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// 경매를 종료합니다.
export const endAuction = async (id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auction/end/${id}`);
    return response.data;
  } catch (error) {
    console.error('경매 종료 중 오류 발생:', error);
    throw error;
  }
};

