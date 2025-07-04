import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LabelList,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const formatPercentage = (value) => {
	const num = Number(value);
	return num % 1 === 0 ? num.toString() : num.toFixed(1);
};

const CustomLabel = ({ x, y, width, height, value }) => {
	if (!value) return null;
	return (
		<g transform={`translate(${x + width / 2}, ${y + height / 2})`}>
			<text
				textAnchor='middle'
				dominantBaseline='middle'
				transform='rotate(-90)'
				fill='#484848'
				fontSize={14}
				fontWeight='bold'
			>
				{`${formatPercentage(value)}%`}
			</text>
		</g>
	);
};

export default function BarChartComponent({ data }) {
	// Sort by numeric part of "Para X"
	const sortedData = [...data].sort((a, b) => {
		const aNum = parseInt(a.name.replace(/\D/g, ""), 10);
		const bNum = parseInt(b.name.replace(/\D/g, ""), 10);
		return aNum - bNum;
	});

	return (
		<Card elevation={5} sx={{ borderRadius: 3 }}>
			<CardContent>
				<Typography
					variant='h6'
					fontWeight='bold'
					mb={1}
					color='#787878'
					align='center'
				>
					Para Progress
				</Typography>
				<ResponsiveContainer width='100%' height={400}>
					<BarChart
						data={sortedData}
						margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							dataKey='name'
							angle={-90}
							textAnchor='end'
							interval={0}
							height={100}
							style={{ fontSize: 12 }}
						/>
						<YAxis
							tickFormatter={(value) => `${value}%`}
							domain={[0, 100]}
							style={{ fontSize: 12 }}
						/>
						<Tooltip formatter={(value) => `${value}%`} />
						<Bar
							dataKey='value'
							fill='#28a745'
							radius={[3, 3, 0, 0]}
						>
							<LabelList content={<CustomLabel />} />
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
