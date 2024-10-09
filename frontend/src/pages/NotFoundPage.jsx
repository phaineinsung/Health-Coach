import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 리다이렉트 할 때 이전 경로를 사용
  React.useEffect(() => {
    if (location.state && location.state.from) {
      navigate(location.state.from, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, location]);

  return null; // 컴포넌트에서 아무것도 렌더링하지 않음
};

export default NotFoundPage;
