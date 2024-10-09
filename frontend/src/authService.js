import axios from 'axios';

// Access Token 갱신 요청
export const refreshAccessToken = async () => {
  try {
    // 로컬 스토리지에서 refreshToken 가져오기
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('Attempting to refresh token with:', refreshToken);

    if (!refreshToken) {
      console.error('리프레시 토큰이 존재하지 않습니다.');
      return null; // 리프레시 토큰이 없으면 갱신하지 않고 종료
    }

    // Access token 갱신 요청 보내기
    const response = await axios.post('http://health-coach.shop/users/refresh', {}, {
      headers: {
        'Refresh-Token': refreshToken //  커스텀 헤더 추가
      }
    });
    console.log('Refresh token response:', response.data);

    // 서버로부터 새로운 access token을 응답받음 (리프레시 토큰은 그대로 사용)
    const { accessToken } = response.data; 
    
    // 갱신된 액세스 토큰 저장
    localStorage.setItem('accessToken', accessToken);

    console.log('새로운 Access Token이 성공적으로 저장되었습니다:', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Access Token 갱신 실패:', error);

    // 리프레시 토큰이 만료되어 403 Forbidden 응답을 받은 경우 로그아웃 처리
    if (error.response && error.response.status === 403) {
      console.error('리프레시 토큰이 만료되었습니다. 로그아웃 처리합니다.');
      handleLogout(); // 로그아웃 처리
    }

    throw error;
  }
};

// Axios 인터셉터 설정
export const setupAxiosInterceptors = (navigate) => {

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 accessToken 가져오기
      console.log('Access Token from localStorage:', token); // 로드된 토큰 확인
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // 요청 헤더에 accessToken 추가
      } else {
        console.log('localStorage에서 토큰을 찾을 수 없습니다.');
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.response) {
        console.error('네트워크 오류 또는 서버 응답 없음:', error.message || error);
        return Promise.reject(new Error('Network error or server is down'));
      }

      const originalRequest = error.config;

      // 재시도 플래그 설정
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }

      // 401 Unauthorized 처리 (로그아웃 처리)
      if (error.response.status === 401) {
        console.error('401 에러: 토큰이 유효하지 않습니다. 로그아웃 처리합니다.');
        handleLogout(navigate);
        return Promise.reject(error);
      }

      // 403 Forbidden 처리 (리프레시 토큰으로 액세스 토큰 갱신)
      if (error.response.status === 403 && originalRequest._retryCount < 1) {
        originalRequest._retryCount += 1;
        try {
          console.log('403 에러: 리프레시 토큰을 통해 새로운 액세스 토큰 발급 시도 중...');
          const newAccessToken = await refreshAccessToken();

          if (!newAccessToken) {
            console.error('액세스 토큰 갱신 실패. 로그아웃 처리합니다.');
            handleLogout(navigate);
            return Promise.reject(error);
          } else {    // 토큰 갱신 성공

          // 새로운 액세스 토큰으로 원래 요청 재시도
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
          }

        } catch (refreshError) {
          console.error('리프레시 토큰 갱신 중 오류 발생:', refreshError);
          handleLogout(navigate);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};


// 로그아웃 함수
// Token 정보 삭제 후 로그인 페이지 이동
export const handleLogout = (navigate) => {
  localStorage.removeItem('accessToken'); // accessToken 삭제
  localStorage.removeItem('refreshToken'); // refreshToken 삭제
  localStorage.removeItem('currentUser'); // 사용자 정보 삭제
  localStorage.setItem('isLoggedIn', 'false'); // 로그인 상태 false로 설정
  navigate('/login'); // 로그인 페이지로 이동
};
