import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import { Container, Box, Typography } from '@mui/material';
import { getPostDetail, createPost, updatePost, fetchCategories, uploadFile } from '../api/UserApi.js';
import PostFormContent from '../components/PostForm/PostFormContent';

const PostForm = () => {
  const { id } = useParams(); // URL에서 id 파라미터를 가져옴
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(''); // 파일명 상태 추가
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.user_num;
  const userEmail = currentUser?.email;

  useEffect(() => {
    const fetchData = async () => {
        try {
            // 모든 카테고리 가져오기
            const categoryMap = await fetchCategories();

            // 객체를 배열로 변환
            const categoryArray = Object.keys(categoryMap).map(key => ({
                ctgId: key,
                ctgName: categoryMap[key]
            }));

            setCategories(categoryArray);

            if (id) {
                // 게시물 상세 정보 가져오기
                const post = await getPostDetail(id);
                setTitle(post.title);
                setContent(post.content);
                setFileUrl(post.image); // 이미지 URL을 fileUrl에 설정
                setCategoryId(post.ctgId);
            } 

            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    fetchData();
}, [id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setSelectedFileName(file.name); // 파일명 설정
    setUploading(true);
    setError(null);

    try {
      const uploadedFileUrl = await uploadFile(file);
      setFileUrl(uploadedFileUrl);
    } catch (err) {
      setError('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFileUrl(null); // 파일 URL을 null로 설정하여 이미지를 제거
    setSelectedFileName(''); // 선택된 파일명 초기화
  };

  const handleSubmit = async () => {
    const message = id ? '수정을 하시겠습니까?' : '작성을 하시겠습니까?';
    if (!window.confirm(message)) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('user_num', userId);
    formData.append('email', userEmail);
    formData.append('ctg_id', categoryId);

    if (fileUrl) {
      formData.append('imageUrl', fileUrl); // fileUrl을 이미지로 사용
    }

    try {
      if (id) {
        await updatePost(id, formData);
      } else {
        await createPost(formData);
      }
      navigate('/community');
    } catch (error) {
      console.error(
        id ? 'Failed to update post:' : 'Failed to create post:',
        error
      );
      setError(
        id
          ? '게시물을 수정하는 중 오류가 발생했습니다.'
          : '게시물을 작성하는 중 오류가 발생했습니다.'
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
              로딩 중...
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <PostFormContent
        id={id}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories} 
        handleFileUpload={handleFileUpload}
        uploading={uploading}
        handleSubmit={handleSubmit}
        error={error}
        selectedFileName={selectedFileName} // 파일명 전달
        fileUrl={fileUrl} // 파일 URL 전달
        handleRemoveImage={handleRemoveImage} // 이미지 제거 핸들러 전달
        />
    </Layout>
  );
};

export default PostForm;
