const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { userDb } = require('./db'); // db.js 모듈 가져오기

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('API is running...');
});

// 로그인 엔드포인트
app.post('/api/login', (req, res) => {
  const { email, pw } = req.body;
  const query = 'SELECT * FROM user WHERE email = ? AND pw = ?';
  userDb.query(query, [email, pw], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
    if (results.length > 0) {
      res.status(200).json({ user: results[0] });
    } else {
      res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }
  });
});

// 회원가입 엔드포인트
app.post('/api/register', (req, res) => {
  const { email, name, pw } = req.body;
  const query = 'INSERT INTO user (email, name, pw) VALUES (?, ?, ?)';
  userDb.query(query, [email, name, pw], (err, result) => {
    if (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
    }
    res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
  });
});

// 사용자 정보 수정 엔드포인트
app.put('/users/:userID', (req, res) => {
  const { userID } = req.params;
  const { email, name, pw } = req.body;
  console.log(`Update request received for user: ${userID}`); // 로그 추가
  const query = 'UPDATE user SET email = ?, name = ?, pw = ? WHERE user_num = ?';
  userDb.query(query, [email, name, pw, userID], (err, result) => {
    if (err) {
      console.error('Error updating user info:', err);
      return res.status(500).json({ message: '사용자 정보 수정 중 오류가 발생했습니다.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ user_num: userID, email, name, pw });
  });
});

// 사용자 정보 삭제 엔드포인트
app.delete('/users/:userID', (req, res) => {
  const { userID } = req.params;
  console.log(`Delete request received for user: ${userID}`); // 로그 추가
  
  // 관련된 운동 기록 삭제
  const deleteExerciseRecordsQuery = 'DELETE FROM exercise_records WHERE user_num = ?';
  userDb.query(deleteExerciseRecordsQuery, [userID], (err, result) => {
    if (err) {
      console.error('Error deleting exercise records:', err);
      return res.status(500).json({ message: '운동 기록 삭제 중 오류가 발생했습니다.' });
    }

    // 사용자 삭제
    const deleteUserQuery = 'DELETE FROM user WHERE user_num = ?';
    userDb.query(deleteUserQuery, [userID], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: '사용자 삭제 중 오류가 발생했습니다.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
      res.status(200).json({ success: true });
    });
  });
});


// 운동 기록 가져오기 엔드포인트
app.get('/api/records', (req, res) => {
  const userNum = req.query.user_num;
  const query = `
    SELECT er.*, e.ex_name 
    FROM exercise_records er
    JOIN exercise e ON er.ex_id = e.ex_id
    WHERE er.user_num = ?`;
  userDb.query(query, [userNum], (err, results) => {
    if (err) {
      console.error('Error fetching records:', err);
      return res.status(500).json({ message: '운동 기록을 가져오는 중 오류가 발생했습니다.' });
    }
    console.log('Fetched records:', results);
    res.status(200).json({ records: results });
  });
});

// 운동 기록 추가 엔드포인트
app.post('/api/records', (req, res) => {
  const { user_num, ex_id, ex_date, ex_time } = req.body;
  const query = 'INSERT INTO exercise_records (user_num, ex_id, ex_date, ex_time) VALUES (?, ?, ?, ?)';
  userDb.query(query, [user_num, ex_id, ex_date, ex_time], (err, result) => {
    if (err) {
      console.error('Error adding record:', err);
      return res.status(500).json({ message: '운동 기록을 추가하는 중 오류가 발생했습니다.' });
    }
    res.status(201).json({ message: '운동 기록이 성공적으로 추가되었습니다.', insertId: result.insertId });
  });
});

// 날짜 형식을 변환하는 유틸리티 함수
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [year, month, day].join('-');
};

// 운동 기록 수정 엔드포인트
app.put('/api/records/:record_id', (req, res) => {
  const { record_id } = req.params;
  const { ex_date, ex_time, ex_id } = req.body;
  const formattedDate = formatDate(ex_date); // 날짜 형식 변환
  const query = 'UPDATE exercise_records SET ex_date = ?, ex_time = ?, ex_id = ? WHERE record_id = ?';
  userDb.query(query, [formattedDate, ex_time, ex_id, record_id], (err, result) => {
    if (err) {
      console.error('Error updating exercise record:', err);
      return res.status(500).json({ message: '운동 기록 수정 중 오류가 발생했습니다.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
    }
    res.status(200).json({ success: true });
  });
});

// 운동 기록 삭제 엔드포인트
app.delete('/api/records/:record_id', (req, res) => {
  const { record_id } = req.params;
  const query = 'DELETE FROM exercise_records WHERE record_id = ?';
  userDb.query(query, [record_id], (err, result) => {
    if (err) {
      console.error('Error deleting record:', err);
      return res.status(500).json({ message: '운동 기록을 삭제하는 중 오류가 발생했습니다.' });
    }
    res.sendStatus(204);
  });
});

// 운동 목록 가져오기 엔드포인트
app.get('/api/exercises', (req, res) => {
  const query = 'SELECT * FROM exercise';
  userDb.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching exercises:', err);
      return res.status(500).json({ message: '운동 목록을 가져오는 중 오류가 발생했습니다.' });
    }
    res.status(200).json({ exercises: results });
  });
});

// 즐겨찾기 추가 엔드포인트
app.post('/api/favorites', (req, res) => {
  const { user_id, post_id } = req.body;
  const query = 'INSERT INTO star (user_num, post_id) VALUES (?, ?)';
  userDb.query(query, [user_id, post_id], (err, result) => {
    if (err) {
      console.error('Error adding favorite:', err);
      return res.status(500).json({ message: '즐겨찾기를 추가하는 중 오류가 발생했습니다.' });
    }
    res.status(201).json({ message: '즐겨찾기가 성공적으로 추가되었습니다.' });
  });
});

// 즐겨찾기 삭제 엔드포인트
app.delete('/api/favorites', (req, res) => {
  const { user_id, post_id } = req.body;
  const query = 'DELETE FROM star WHERE user_num = ? AND post_id = ?';
  userDb.query(query, [user_id, post_id], (err, result) => {
    if (err) {
      console.error('Error deleting favorite:', err);
      return res.status(500).json({ message: '즐겨찾기를 삭제하는 중 오류가 발생했습니다.' });
    }
    res.sendStatus(204);
  });
});

// 즐겨찾기 목록 가져오기 엔드포인트
app.get('/api/favorites/:user_num', (req, res) => {
  const { user_num } = req.params;
  const query = `
    SELECT p.*
    FROM star s
    JOIN post p ON s.post_id = p.post_id
    WHERE s.user_num = ?`;
  userDb.query(query, [user_num], (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      return res.status(500).json({ message: '즐겨찾기 목록을 가져오는 중 오류가 발생했습니다.' });
    }
    res.status(200).json(results);
  });
});

// 게시물 가져오기 엔드포인트
app.get('/api/posts', (req, res) => {
  const { searchTerm, searchField } = req.query;
  let query = `
    SELECT p.*, c.ctg_name 
    FROM post p 
    JOIN ctg_post c ON p.ctg_id = c.ctg_id`;

  if (searchTerm) {
    query += ` WHERE ${searchField.replace('+', ' LIKE ? OR ')} LIKE ?`;
  }

  query += ` ORDER BY p.upload_date DESC`; // 내림차순 정렬

  userDb.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).json({ message: '게시물을 가져오는 중 오류가 발생했습니다.' });
    }
    res.status(200).json(results);
  });
});

// 게시물 세부 정보 가져오기 엔드포인트
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM post WHERE post_id = ?';
  userDb.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching post:', err);
      return res.status(500).json({ message: '게시물 세부 정보를 가져오는 중 오류가 발생했습니다.' });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
  });
});

// 중고거래 게시물 가져오기 엔드포인트
app.get('/api/post/used', (req, res) => {
  const query = `
    SELECT p.*, c.ctg_name 
    FROM post p 
    JOIN ctg_post c ON p.ctg_id = c.ctg_id 
    WHERE c.ctg_name = '중고거래' 
    ORDER BY p.upload_date DESC 
    LIMIT 6`;

  userDb.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching used posts:', err);
      return res.status(500).json({ message: '중고거래 게시물을 가져오는 중 오류가 발생했습니다.' });
    }
    console.log('Results:', results); // 로그 추가
    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
  });
});

// 게시물 작성 엔드포인트
app.post('/api/posts', upload.single('image'), (req, res) => {
  const { title, content, authorId, categoryId } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const query = 'INSERT INTO post (title, content, user_num, image, ctg_id) VALUES (?, ?, ?, ?, ?)';
  userDb.query(query, [title, content, authorId, imagePath, categoryId], (err, result) => {
    if (err) {
      console.error('Error creating post:', err);
      return res.status(500).json({ message: '게시물 작성 중 오류가 발생했습니다.' });
    }
    res.status(201).json({ message: '게시물이 성공적으로 작성되었습니다.' });
  });
});

// 게시물 수정 엔드포인트
app.put('/api/posts/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId } = req.body;
  let imagePath;

  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  } else if (req.body.existingImage) {
    imagePath = req.body.existingImage;
  }

  const query = 'UPDATE post SET title = ?, content = ?, image = ?, ctg_id = ? WHERE post_id = ?';
  userDb.query(query, [title, content, imagePath, categoryId, id], (err, result) => {
    if (err) {
      console.error('Error updating post:', err);
      return res.status(500).json({ message: '게시물 수정 중 오류가 발생했습니다.' });
    }
    res.status(200).json({ message: '게시물이 성공적으로 수정되었습니다.' });
  });
});

// 게시물 삭제 엔드포인트
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;

  // 먼저 즐겨찾기에서 해당 게시물을 삭제합니다.
  const deleteFavoritesQuery = 'DELETE FROM star WHERE post_id = ?';
  userDb.query(deleteFavoritesQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting from favorites:', err);
      return res.status(500).json({ message: '즐겨찾기에서 삭제하는 중 오류가 발생했습니다.' });
    }

    // 즐겨찾기 삭제 후 게시물을 삭제합니다.
    const deletePostQuery = 'DELETE FROM post WHERE post_id = ?';
    userDb.query(deletePostQuery, [id], (err, result) => {
      if (err) {
        console.error('Error deleting post:', err);
        return res.status(500).json({ message: '게시물 삭제 중 오류가 발생했습니다.' });
      }
      res.status(204).json({ message: '게시물이 성공적으로 삭제되었습니다.' });
    });
  });
});

// 커뮤니티 목록에서 즐겨찾기 해제 상태 업데이트 엔드포인트
app.patch('/api/posts/:post_id/remove-favorite', (req, res) => {
  const { post_id } = req.params;
  const { user_num } = req.body;
  const query = 'DELETE FROM star WHERE post_id = ? AND user_num = ?';
  userDb.query(query, [post_id, user_num], (err, results) => {
    if (err) {
      console.error('Failed to update community favorite status:', err);
      res.status(500).send('Failed to update community favorite status');
    } else {
      res.sendStatus(204);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
