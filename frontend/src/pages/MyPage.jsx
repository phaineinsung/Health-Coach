import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Grid, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, TextField } from '@mui/material';
import UserInfo from '../components/mypage/UserInfo';
import RecordCard from '../components/mypage/RecordCard';
import ExerciseChart from '../components/mypage/ExerciseChart';
import { fetchUserRecords, deleteRecord, updateRecord, updateUser, deleteUser } from '../api/UserApi';
import '../assets/CustomStyles/CustomStyles.css';

const MyPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [user, setUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRecordDialogOpen, setEditRecordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    // 사용자
    const currentUserString = localStorage.getItem('currentUser');
    let currentUser;
    try {
      if (currentUserString) {
        currentUser = JSON.parse(currentUserString);
      } else {
        throw new Error('No currentUser in localStorage');
      }
    } catch (error) {
      console.error('Invalid JSON in localStorage:', error);
      localStorage.removeItem('currentUser');
      navigate('/login');
      return;
    }

    console.log('isLoggedIn:', isLoggedIn);
    console.log('currentUser:', currentUser);
    
    if (isLoggedIn !== 'true' || !currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      setEmail(currentUser.email);
      setName(currentUser.name);
      loadRecords(currentUser.user_num);
    }
  }, [navigate]);

  // 다이얼로그 열림/닫힘 상태에 따라 inert 속성 관리
  useEffect(() => {
    if (editDialogOpen || editRecordDialogOpen || deleteDialogOpen) {
      document.querySelector('#root').setAttribute('inert', true);
    } else {
      document.querySelector('#root').removeAttribute('inert');
    }

    return () => {
      document.querySelector('#root').removeAttribute('inert');
    };
  }, [editDialogOpen, editRecordDialogOpen, deleteDialogOpen]);

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const loadRecords = async (user_num) => {
    try {
      const data = await fetchUserRecords(user_num);
      setRecords(data);
    } catch (error) {
      console.error('운동 기록을 가져오는 중 오류 발생:', error);
    }
  };

  const handleRecordClick = (record) => {
    setSelectedRecords((prevState) =>
      prevState.includes(record)
        ? prevState.filter((r) => r.recordId !== record.recordId)
        : [...prevState, record]
    );
  };

  const handleRemoveRecord = async (recordId) => {
    try {
      await deleteRecord(user.user_num, recordId); 
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.recordId !== recordId)
      );
      setSelectedRecords((prevSelected) =>
        prevSelected.filter((record) => record.recordId !== recordId)
      );
    } catch (error) {
      console.error('운동 기록을 삭제하는 중 오류 발생:', error);
    }
  };
  

  const handleEditRecord = async () => {
    if (!currentRecord || !user?.user_num || !currentRecord.recordId) {
      showSnackbar('필수 정보가 누락되었습니다.', 'error');
      return;
    }
  
    try {
      await updateRecord(currentRecord.recordId, {
        exId: currentRecord.exId,
        exDate: currentRecord.exDate,
        exTime: currentRecord.exTime,
        userNum: user.user_num, // userNum 추가
      });
      
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.recordId === currentRecord.recordId ? currentRecord : record
        )
      );
      setEditRecordDialogOpen(false);
      showSnackbar('운동 기록이 성공적으로 수정되었습니다.', 'success');
    } catch (error) {
      console.error('운동 기록을 수정하는 중 오류 발생:', error);
      showSnackbar('운동 기록을 수정하는 중 오류가 발생했습니다.', 'error');
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

  const handleEditUser = async () => {
    console.log('Editing user with userNum:', user.user_num);
    console.log('Updated user details:', { email, name, password });

    if (password && !validatePassword(password)) {
      showSnackbar('비밀번호는 최소 8자 이상이어야 하며, 문자와 숫자를 포함해야 합니다.', 'error');
      return;
    }

    const updatedEmail = email || user.email;
    const updatedName = name || user.name;
    const updatedPassword = password || user.pw;

    try {
      await updateUser(user.user_num, {
        email: updatedEmail,
        name: updatedName,
        pw: updatedPassword,
      });
      const updatedUser = {
        ...user,
        email: updatedEmail,
        name: updatedName,
        pw: updatedPassword,
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setEditDialogOpen(false);
      showSnackbar('사용자 정보가 성공적으로 수정되었습니다.', 'success');
    } catch (error) {
      console.error('사용자 정보를 수정하는 중 오류 발생:', error);
      showSnackbar('사용자 정보를 수정하는 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleDeleteUser = async () => {
    console.log('Deleting user with userNum:', user.user_num);

    try {
      await deleteUser(user.user_num);
      localStorage.removeItem('currentUser');
      localStorage.setItem('isLoggedIn', 'false');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('사용자 정보를 삭제하는 중 오류 발생:', error);
      showSnackbar('사용자 정보를 삭제하는 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true);

  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);

  const handleOpenEditRecordDialog = (record) => {
    if (!record.exId) {
      console.error('exId가 존재하지 않습니다:', record);
      return;
    }
    setCurrentRecord({ ...record, exDate: record.exDate.split('T')[0], exId: record.exId });
    setEditRecordDialogOpen(true);
  };
  

  const handleCloseEditRecordDialog = () => {
    setEditRecordDialogOpen(false);
    setCurrentRecord(null);
  };

  const handleDeselectAll = () => {
    setSelectedRecords([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const aggregateRecordsByDate = (records) => {
    const aggregated = {};
    records.forEach((record) => {
      const date = formatDate(record.exDate);
      if (!aggregated[date]) aggregated[date] = 0;
      aggregated[date] += record.exTime / 60;
    });
    return aggregated;
  };

  const sortedSelectedRecords = selectedRecords
    .slice()
    .sort((a, b) => new Date(a.exDate) - new Date(b.exDate));
  const aggregatedRecords = aggregateRecordsByDate(sortedSelectedRecords);

  const graphData = {
    labels: Object.keys(aggregatedRecords),
    datasets: [
      {
        label: '운동 시간 (시간)',
        data: Object.values(aggregatedRecords).map((time) => time.toFixed(2)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { font: { size: 14, weight: 'bold' }, padding: 20 },
      },
      title: { display: true, text: '운동 시간', font: { size: 18 } },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 10,
        caretPadding: 10,
      },
    },
    scales: {
      x: {
        title: { display: true, text: '날짜', font: { size: 14, weight: 'bold' } },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: '시간 (시간)', font: { size: 14, weight: 'bold' } },
        grid: { color: 'rgba(200, 200, 200, 0.3)' },
      },
    },
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography component="h1" variant="h4" sx={{ color: '#fff', marginBottom: 2 }}>
          사용자 정보
        </Typography>
        <UserInfo user={user} onEditClick={handleOpenEditDialog} onDeleteClick={handleOpenDeleteDialog} />
      </Grid>

      {/* 운동 기록 섹션 */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ color: '#fff', marginBottom: 2 }}>
          운동 기록
        </Typography>
        <Button variant="outlined" color="inherit" sx={buttonStyle} onClick={handleDeselectAll}>
          선택 해제
        </Button>
        </Grid>

        <Grid item xs={12}>
        <Box className="scroll-container" sx={scrollContainerStyle}>
          {records.length === 0 ? (
            <Typography color="text.secondary">데이터가 없습니다</Typography>
          ) : (
            <Grid container spacing={2}>
              {records.map((record, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <RecordCard
                    record={record}
                    isSelected={selectedRecords.includes(record)}
                    onClick={() => handleRecordClick(record)}
                    onEditClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditRecordDialog(record);
                    }}
                    onDeleteClick={(e) => {
                      e.stopPropagation();
                      handleRemoveRecord(record.recordId);
                    }}
                    formatDate={formatDate}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Grid>

      {selectedRecords.length > 0 && (
        <Grid item xs={12} style={{ height: '400px' }}>
          <Typography component="h1" variant="h4" sx={{ color: '#fff', marginBottom: 2 }}>
            운동 기록 그래프
          </Typography>
          <ExerciseChart graphData={graphData} graphOptions={graphOptions} />
        </Grid>
      )}

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="inherit" sx={buttonStyle} component={Link} to="/add-record">
          운동 기록 추가
        </Button>
        <Button variant="outlined" color="inherit" sx={buttonStyle} component={Link} to="/favorites">
          즐겨찾기 목록 조회
        </Button>
      </Grid>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>사용자 정보 수정</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="이메일"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="이름"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="비밀번호"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            취소
          </Button>
          <Button onClick={handleEditUser} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editRecordDialogOpen} onClose={handleCloseEditRecordDialog}>
        <DialogTitle>운동 기록 수정</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="날짜"
            type="date"
            fullWidth
            variant="standard"
            value={currentRecord?.exDate || ''}
            onChange={(e) =>
              setCurrentRecord({ ...currentRecord, exDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="시간 (분)"
            type="number"
            fullWidth
            variant="standard"
            value={currentRecord?.exTime || ''}
            onChange={(e) =>
              setCurrentRecord({ ...currentRecord, exTime: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditRecordDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleEditRecord} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>사용자 정보 삭제</DialogTitle>
        <DialogContent>
          <Typography>정말로 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleDeleteUser} color="primary">
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

const scrollContainerStyle = {
  maxHeight: '400px',
  overflowY: 'auto',
  pr: 2,
  border: '1px solid #ccc',
  borderRadius: '20px',
  padding: '16px',
  boxSizing: 'border-box',
  background: 'rgba(255, 255, 255, 0.1)',
};

const buttonStyle = {
  mt: 5,
  borderColor: '#fff',
  color: '#fff',
  borderRadius: '20px',
  padding: '0.5rem 1rem',
  textTransform: 'none',
  marginRight: '1rem',
  '&:hover': {
    backgroundColor: '#fff',
    color: 'gold',
  },
};

export default MyPage;
