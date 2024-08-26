import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  plugins,
} from "chart.js";
import { purple, purpleLight } from "../../constants/color";
import { getLast7Days } from "../../lib/features";
import { orange } from "@mui/material/colors";

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,

  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: purpleLight,
        borderColor: purple,
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  cutout: 120
};

const DoughnutChart = ({value=[], labels=[]}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        fill: true,
        backgroundColor: [purpleLight, orange[200]],
        hoverBackgroundColor: [purple, orange[400]],
        borderColor: [purple, orange[400]],
        offset: 5
      },
    ],
  };
  return <Doughnut style={{zIndex: 10}} data={data} options={doughnutChartOptions}/>;
};

export { LineChart, DoughnutChart };
