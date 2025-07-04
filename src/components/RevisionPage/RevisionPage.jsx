import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	TextField,
	Card,
	CardContent,
	IconButton,
	Tooltip,
	Button,
	Snackbar,
	Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Sidebar from "../Sidebar";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { InputAdornment } from "@mui/material";
const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
	const token = localStorage.getItem("token");
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

const getMistakeColor = (count) => {
	if (count === 0) return "#C8E6C9";
	if (count <= 2) return "#FFE0B2";
	return "#FFCDD2";
};

const getStatusIcon = (count) => {
	if (count === 0)
		return (
			<Tooltip title='No Mistakes'>
				<CheckCircleIcon color='success' />
			</Tooltip>
		);
	if (count <= 2)
		return (
			<Tooltip title='Minor Mistakes'>
				<WarningAmberIcon sx={{ color: "#FB8C00" }} />
			</Tooltip>
		);
	return (
		<Tooltip title='Major Mistakes'>
			<ErrorIcon color='error' />
		</Tooltip>
	);
};

const RevisionPage = () => {
	const [selectedPara, setSelectedPara] = useState("");
	const [selectedSurah, setSelectedSurah] = useState("");
	const [selectedMistakeColor, setSelectedMistakeColor] = useState("");
	const [data, setData] = useState({});
	const [originalData, setOriginalData] = useState({});
	const [surahOptions, setSurahOptions] = useState([]);
	const [showSuccess, setShowSuccess] = useState(false);
	const headingRefs = useRef({});
	const [visibleParas, setVisibleParas] = useState([]);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const dataRef = useRef({});

	useEffect(() => {
		axios
			.get(`${API_URL}/para_surah`, getAuthHeaders())
			.then((res) => {
				setData(res.data);
				dataRef.current = res.data;
				setOriginalData(JSON.parse(JSON.stringify(res.data)));
				const allParas = Object.keys(res.data).sort(
					(a, b) =>
						parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1])
				);
				// Start animation for initial load
				animateTables(allParas);
			})
			.catch((err) => {
				console.error("Failed to fetch para_surah:", err);
				alert("Authentication failed. Please login again.");
			});
	}, []);

	const animateTables = (parasList) => {
		let index = 0;
		setVisibleParas([]);
		const interval = setInterval(() => {
			if (index < parasList.length) {
				setVisibleParas((prev) => [...prev, parasList[index]]);
				index++;
			} else {
				clearInterval(interval);
				setIsInitialLoad(false);
			}
		}, 100);
		return () => clearInterval(interval);
	};

	const allParas = Object.keys(data).sort(
		(a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1])
	);

	useEffect(() => {
		if (selectedPara) {
			const surahs = [
				...new Set(data[selectedPara]?.map((item) => item.surah)),
			];
			setSurahOptions(surahs);
		} else {
			const allSurahs = [
				...new Set(
					Object.values(data)
						.flat()
						.map((item) => item.surah)
				),
			];
			setSurahOptions(allSurahs);
		}
	}, [selectedPara, data]);

	useEffect(() => {
		if (selectedPara && headingRefs.current[selectedPara]) {
			headingRefs.current[selectedPara].scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	}, [selectedPara]);

	useEffect(() => {
		if (!isInitialLoad) {
			const filtered = filterData(dataRef.current);
			const parasList = Object.keys(filtered).sort(
				(a, b) =>
					parseInt(a.match(/\d+/)?.[0] || 0) -
					parseInt(b.match(/\d+/)?.[0] || 0)
			);
			animateTables(parasList);
		}
	}, [selectedPara, selectedSurah, selectedMistakeColor]);

	const filterData = (sourceData = data) => {
		return Object.entries(sourceData).reduce((acc, [para, entries]) => {
			if (selectedPara && para !== selectedPara) return acc;
			const filtered = entries.filter((entry) => {
				const matchSurah =
					!selectedSurah || entry.surah === selectedSurah;
				const matchColor =
					!selectedMistakeColor ||
					(selectedMistakeColor === "green" &&
						entry.mistakes === 0) ||
					(selectedMistakeColor === "orange" &&
						entry.mistakes >= 1 &&
						entry.mistakes <= 2) ||
					(selectedMistakeColor === "red" && entry.mistakes >= 3);
				return matchSurah && matchColor;
			});
			if (filtered.length > 0) acc[para] = filtered;
			return acc;
		}, {});
	};

	const handleMistakeChange = (para, index, value) => {
		const updated = { ...data };
		updated[para] = [...updated[para]];
		updated[para][index] = {
			...updated[para][index],
			mistakes: parseInt(value) || 0,
		};
		setData(updated);
	};

	const handleUpdate = () => {
		const flattened = [];
		for (const [para, rows] of Object.entries(data)) {
			for (const row of rows) {
				flattened.push({
					para,
					surah: row.surah,
					page: row.page,
					mistakes: row.mistakes,
				});
			}
		}
		axios
			.post(`${API_URL}/para_surah`, flattened, getAuthHeaders())
			.then(() => {
				setOriginalData(JSON.parse(JSON.stringify(data)));
				setShowSuccess(true);
			})
			.catch((err) => {
				console.error("Update failed:", err);
				alert("Failed to update data.");
			});
	};

	const hasChanges = () => {
		for (const para in data) {
			const original = originalData[para];
			const updated = data[para];
			if (!original) return true;
			for (let i = 0; i < updated.length; i++) {
				if (updated[i].mistakes !== original[i]?.mistakes) return true;
			}
		}
		return false;
	};

	const handleResetFilters = () => {
		setSelectedPara("");
		setSelectedSurah("");
		setSelectedMistakeColor("");
	};

	const filteredData = filterData();

	return (
		<Box sx={{ display: "flex", p: 2 }}>
			<Sidebar />
			<Card
				sx={{
					width: 260,
					mr: 2,
					p: 2,
					backgroundColor: "#f9f9f9",
					position: "sticky",
					top: 20,
					height: "fit-content",
					alignSelf: "flex-start",
					zIndex: 5,
				}}
			>
				<CardContent>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
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
					<FormControl fullWidth sx={{ mb: 2 }} size='small'>
						<InputLabel shrink>Para</InputLabel>
						<Select
							value={selectedPara}
							onChange={(e) => setSelectedPara(e.target.value)}
							displayEmpty
							notched
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
					<FormControl fullWidth sx={{ mb: 2 }} size='small'>
						<InputLabel shrink>Surah</InputLabel>
						<Select
							value={selectedSurah}
							onChange={(e) => setSelectedSurah(e.target.value)}
							displayEmpty
							notched
							label='Surah'
						>
							<MenuItem value=''>All</MenuItem>
							{surahOptions.map((surah) => (
								<MenuItem key={surah} value={surah}>
									{surah}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth size='small'>
						<InputLabel shrink>Mistakes</InputLabel>
						<Select
							value={selectedMistakeColor}
							onChange={(e) =>
								setSelectedMistakeColor(e.target.value)
							}
							displayEmpty
							notched
							label='Mistakes'
						>
							<MenuItem value=''>All</MenuItem>
							<MenuItem value='green'>Green (0)</MenuItem>
							<MenuItem value='orange'>Orange (1-2)</MenuItem>
							<MenuItem value='red'>Red (3+)</MenuItem>
						</Select>
					</FormControl>
					<Button
						variant='contained'
						fullWidth
						onClick={handleUpdate}
						disabled={!hasChanges()}
						sx={{
							backgroundColor: "#28a745",
							"&:hover": { backgroundColor: "#757575" },
							marginTop: 4,
						}}
					>
						Update
					</Button>
				</CardContent>
			</Card>

			<Box sx={{ flexGrow: 1 }}>
				{Object.entries(filteredData)
					.filter(([para]) => visibleParas.includes(para))
					.map(([para, rows]) => (
						<Box key={para} sx={{ mb: 4 }}>
							<Typography
								ref={(el) => (headingRefs.current[para] = el)}
								variant='h6'
								align='center'
								sx={{
									mb: 1,
									backgroundColor: "#e0e0e0",
									p: 1,
									borderRadius: 1,
									fontWeight: "bold",
									position: "sticky",
									top: 0,
									zIndex: 2,
								}}
							>
								{para}
							</Typography>
							<TableContainer component={Paper}>
								<Table size='small'>
									<TableHead>
										<TableRow
											sx={{
												backgroundColor: "#f5f5f5",
												top: 48,
												zIndex: 1,
											}}
										>
											<TableCell
												align='center'
												sx={{ fontWeight: "bold" }}
											>
												Surah
											</TableCell>
											<TableCell
												align='center'
												sx={{ fontWeight: "bold" }}
											>
												Page #
											</TableCell>
											<TableCell
												align='center'
												sx={{ fontWeight: "bold" }}
											>
												# of Mistakes
											</TableCell>
											<TableCell
												align='center'
												sx={{ fontWeight: "bold" }}
											>
												Status
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row, idx) => (
											<TableRow
												key={idx}
												sx={{
													"&:hover": {
														backgroundColor:
															"#f5f5f5",
													},
												}}
											>
												<TableCell align='center'>
													{row.surah}
												</TableCell>
												<TableCell align='center'>
													{row.page}
												</TableCell>
												{/* <TableCell align='center'>
													<TextField
														type='number'
														variant='standard'
														value={row.mistakes}
														onChange={(e) =>
															handleMistakeChange(
																para,
																idx,
																e.target.value
															)
														}
														inputProps={{
															min: 0,
															style: {
																textAlign:
																	"center",
															},
														}}
														sx={{ width: 60 }}
													/>
												</TableCell> */}

												<TableCell align='center'>
													<Box
														sx={{
															border: "1px solid #ccc",
															borderRadius: "4px",
															padding: "4px",
															display:
																"inline-block",
															"&:hover": {
																borderColor:
																	"#999",
															},
															"&:focus-within": {
																borderColor:
																	"#1976d2",
																boxShadow:
																	"0 0 0 1px #1976d2",
															},
														}}
													>
														<TextField
															type='number'
															variant='outlined'
															size='small'
															value={row.mistakes}
															onChange={(e) =>
																handleMistakeChange(
																	para,
																	idx,
																	e.target
																		.value
																)
															}
															inputProps={{
																min: 0,
																style: {
																	textAlign:
																		"center",
																	padding:
																		"4px 8px",
																},
															}}
															sx={{
																width: 100,
																"& .MuiOutlinedInput-root":
																	{
																		"& fieldset":
																			{
																				border: "none",
																			},
																		"&:hover fieldset":
																			{
																				border: "none",
																			},
																		"&.Mui-focused fieldset":
																			{
																				border: "none",
																			},
																	},
															}}
														/>
													</Box>
												</TableCell>

												<TableCell
													align='center'
													sx={{
														backgroundColor:
															getMistakeColor(
																row.mistakes
															),
													}}
												>
													{getStatusIcon(
														row.mistakes
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
					))}
			</Box>

			<Snackbar
				open={showSuccess}
				autoHideDuration={3000}
				onClose={() => setShowSuccess(false)}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert
					onClose={() => setShowSuccess(false)}
					severity='success'
					variant='filled'
					sx={{ width: "100%" }}
				>
					Mistakes updated successfully!
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default RevisionPage;
