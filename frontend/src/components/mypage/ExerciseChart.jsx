import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// ChartJS 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ExerciseChart = ({ graphData, graphOptions }) => {
  return <Line data={graphData} options={graphOptions} />;
};

export default ExerciseChart;
