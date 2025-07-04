import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import DonutChart from "./DonutChart";
import BarChartComponent from "./BarChart";
import TitleCard from "./TitleCard";
import Sidebar from "../Sidebar";
import useProgressData from "../../BackendCalls/GetProgress";
import { getUserDetails } from "../../BackendCalls/User";

const Dashboard = () => {
	const [currentPara, setCurrentPara] = useState("");
	const { progress, loading } = useProgressData();

	useEffect(() => {
		const fetchCurrentPara = async () => {
			try {
				const user = await getUserDetails(); // fetches from /user/me
				setCurrentPara(user.currentPara);
			} catch (err) {
				console.error("Failed to fetch user info", err);
			}
		};
		fetchCurrentPara();
	}, []);

	let completedSum = 0;
	let totalPages = 0;

	if (loading) return <p>Loading progress data...</p>;

	for (let i = 0; i < progress.length; i++) {
		completedSum += progress[i].completed;
		totalPages += progress[i].total;
	}

	const returnPercentage = (completed, total) => {
		if (total === 0) return 0;
		return (completed / total) * 100;
	};

	const overallPercent = returnPercentage(completedSum, totalPages);

	const progressData = progress.map((item) => ({
		name: item.para,
		value: returnPercentage(item.completed, item.total),
	}));

	const currentParaProgress =
		progressData.find((item) => item.name === currentPara)?.value || 0;

	return (
		<Box sx={{ display: "flex" }}>
			<Sidebar />
			<Box sx={{ flex: 1, p: 3 }}>
				<Grid container spacing={3} justifyContent='center'>
					<Grid item>
						<DonutChart
							percentage={Number(overallPercent)}
							label='Overall Hifz'
						/>
					</Grid>
					<Grid item>
						<TitleCard title='Hifz Tracker' />
					</Grid>
					<Grid item>
						<DonutChart
							percentage={Number(currentParaProgress)}
							label={`Current ${currentPara}`}
						/>
					</Grid>
				</Grid>

				<Box mt={4}>
					<BarChartComponent data={progressData} />
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
