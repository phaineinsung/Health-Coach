import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddRecordForm from '../components/AddRecord/AddRecordForm';
import { fetchExercises, addRecord } from '../api/UserApi';

const AddRecord = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [newRecord, setNewRecord] = useState({
    ex_name: '',
    ex_date: '',
    ex_time: '',
  });

  useEffect(() => {
    fetchExercises()
      .then(data => setExercises(data))
      .catch(error => console.error('운동 목록을 가져오는 중 오류 발생:', error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRecord(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddRecord = () => {
    const selectedExercise = exercises.find((e) => e.exName === newRecord.ex_name);

    if (!selectedExercise) {
      console.error('운동을 찾을 수 없습니다:', newRecord.ex_name);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.user_num) {
      console.error('User ID not found in currentUser.');
      return;
    }

    const recordToAdd = {
      user_num: currentUser.user_num,
      exId: selectedExercise.exId,
      exDate: newRecord.ex_date,
      exTime: parseInt(newRecord.ex_time, 10),
    };

    addRecord(recordToAdd)
      .then(() => navigate('/mypage'))
      .catch(error => console.error('운동 기록을 추가하는 중 오류 발생:', error));
  };

  return (
    <AddRecordForm
      exercises={exercises}
      newRecord={newRecord}
      handleInputChange={handleInputChange}
      handleAddRecord={handleAddRecord}
    />
  );
};

export default AddRecord;
