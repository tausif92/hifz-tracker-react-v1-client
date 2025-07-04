import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
	Box,
	Typography,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Card,
	CardContent,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	Tooltip,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Sidebar from "../Sidebar";

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);

const formatDate = (dateStr, withTime = false) => {
	if (!dateStr) return "—";
	const parsed = dayjs(dateStr);
	return parsed.isValid()
		? parsed.format(withTime ? "DD-MM-YYYY hh:mm A" : "DD-MM-YYYY")
		: "—";
};

const getDurationInYearsMonthsDays = (start, end) => {
	if (!start || !end) return "—";
	const s = dayjs(start),
		e = dayjs(end);
	if (!s.isValid() || !e.isValid() || e.isBefore(s)) return "—";

	const years = e.diff(s, "year");
	const months = e.diff(s.add(years, "year"), "month");
	const days = e.diff(s.add(years, "year").add(months, "month"), "day");

	return [
		...(years ? [`${years} year${years > 1 ? "s" : ""}`] : []),
		...(months ? [`${months} month${months > 1 ? "s" : ""}`] : []),
		...(days || (!years && !months)
			? [`${days} day${days !== 1 ? "s" : ""}`]
			: []),
	].join(", ");
};

const ActivityPage = () => {
	const [activityData, setActivityData] = useState([]);
	const [selectedPara, setSelectedPara] = useState("");
	const [refreshFlag, setRefreshFlag] = useState(false);

	const allParas = Array.from({ length: 30 }, (_, i) => `Para ${i + 1}`);
	const token = localStorage.getItem("token");

	const fetchData = async () => {
		try {
			const activityRes = await axios.get(
				"http://localhost:4000/activities/grouped",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setActivityData(activityRes.data);
		} catch (err) {
			console.error("Failed to fetch activity data:", err);
		}
	};

	useEffect(() => {
		fetchData();

		// Listen for external triggers to refresh (from other components)
		const refreshHandler = () => setRefreshFlag((f) => !f);
		window.addEventListener("refresh-activity", refreshHandler);

		return () => {
			window.removeEventListener("refresh-activity", refreshHandler);
		};
	}, []);

	useEffect(() => {
		fetchData();
	}, [refreshFlag]);

	const handleResetFilters = () => setSelectedPara("");

	const filteredParas = selectedPara
		? [parseInt(selectedPara.split(" ")[1], 10) - 1]
		: Array.from({ length: 30 }, (_, i) => i);

	return (
		<Box sx={{ display: "flex" }}>
			<Sidebar />

			<Card
				sx={{
					width: 260,
					ml: 2,
					p: 2,
					bgcolor: "#f9f9f9",
					position: "sticky",
					top: 18,
					alignSelf: "flex-start",
					zIndex: 5,
				}}
			>
				<CardContent>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							mb: 1,
						}}
					>
						<Typography variant='h6'>Filters</Typography>
						<Tooltip title='Reset Filters'>
							<IconButton onClick={handleResetFilters}>
								<RestartAltIcon />
							</IconButton>
						</Tooltip>
					</Box>
					<FormControl fullWidth size='small'>
						<InputLabel shrink>Para</InputLabel>
						<Select
							value={selectedPara}
							onChange={(e) => setSelectedPara(e.target.value)}
							displayEmpty
							label='Para'
						>
							<MenuItem value=''>All</MenuItem>
							{allParas.map((para) => (
								<MenuItem key={para} value={para}>
									{para}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</CardContent>
			</Card>

			<Box sx={{ flexGrow: 1, pr: 3, ml: 5, mt: 2, mr: 3 }}>
				<Stack spacing={3} alignItems='center'>
					{filteredParas.map((i) => {
						const para = `Para ${i + 1}`;
						const data = activityData.find(
							(d) => d.para === para
						) || {
							start_date: null,
							end_date: null,
							total_pages: 0,
							completed_pages: 0,
							remaining_pages: 0,
							logs: [],
						};

						const filteredLogs =
							data.logs?.filter(
								(log) => log.pages_memorized > 0
							) || [];

						return (
							<Paper
								key={para}
								elevation={3}
								sx={{
									p: 2,
									borderRadius: 2,
									bgcolor: "#f5f5f5",
									width: "100%",
									maxWidth: 800,
								}}
							>
								<Box
									sx={{
										bgcolor: "#616161",
										color: "#fff",
										p: 1,
										borderRadius: 1,
										mb: 1,
									}}
								>
									<Typography variant='h6' fontWeight='bold'>
										{para}
									</Typography>
								</Box>

								<Box sx={{ ml: 1, mb: 2 }}>
									{[
										{
											label: "Start Date",
											value: formatDate(data.start_date),
										},
										{
											label: "End Date",
											value: formatDate(data.end_date),
										},
										{
											label: "Completion Duration",
											value: getDurationInYearsMonthsDays(
												data.start_date,
												data.end_date
											),
										},
										{
											label: "Total Pages",
											value: data.total_pages,
										},
										{
											label: "Completed Pages",
											value: data.completed_pages,
										},
										{
											label: "Remaining Pages",
											value: data.remaining_pages,
										},
									].map((row, idx) => (
										<Box
											key={idx}
											sx={{ display: "flex", mb: 0.5 }}
										>
											<Typography
												variant='body2'
												sx={{
													width: 180,
													fontWeight: 500,
												}}
											>
												<strong>{row.label}</strong>
											</Typography>
											<Typography variant='body2'>
												: {row.value}
											</Typography>
										</Box>
									))}
								</Box>

								<TableContainer>
									<Table size='small'>
										<TableHead>
											<TableRow
												sx={{ bgcolor: "#e0e0e0" }}
											>
												<TableCell>
													<strong>Time Stamp</strong>
												</TableCell>
												<TableCell>
													<strong>
														Pages Memorized
													</strong>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{filteredLogs.length ? (
												filteredLogs.map((log, idx) => (
													<TableRow key={idx}>
														<TableCell>
															{formatDate(
																log.timestamp,
																true
															)}
														</TableCell>
														<TableCell>
															{
																log.pages_memorized
															}
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={2}
														align='center'
														sx={{
															fontStyle: "italic",
															color: "gray",
														}}
													>
														No activity logged
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						);
					})}
				</Stack>
			</Box>
		</Box>
	);
};

export default ActivityPage;
