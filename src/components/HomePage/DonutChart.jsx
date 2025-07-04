// DonutChart.js
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Typography, Box, Paper } from '@mui/material';

const DonutChart = ({ percentage, label }) => {
  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  const COLORS = ['#00b050', '#808080']; // green and grey

  return (
    <Paper
      elevation={5}
      sx={{
        width: 275,
        height: 200,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={1} color='#787878'>
        {label}
      </Typography>

      <Box sx={{ position: 'relative', width: 180, height: 180 }}>
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            startAngle={90}
            endAngle={-270}
            paddingAngle={1}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                cornerRadius={2}
              />
            ))}
          </Pie>
        </PieChart>

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: '21px',
          }}
        >
          {percentage.toFixed(2)}%
        </Box>
      </Box>
    </Paper>
  );
};

export default DonutChart;
