import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	TextField,
	Button,
	Paper,
	Typography,
	Box,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
	FormControlLabel,
	Switch,
	Snackbar,
	Alert,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../GlobalContext";
import useProgressData from "../../BackendCalls/GetProgress";
import { getUserDetails, updateCurrentPara } from "../../BackendCalls/User";
import dayjs from "dayjs";
const API_URL = process.env.REACT_APP_API_URL;

const UpdateForm = () => {
	const navigate = useNavigate();
	const { currentPara, setCurrentPara } = useGlobalContext();
	const { progress } = useProgressData();
	const [selectedPara, setSelectedPara] = useState("");
	const [progressValue, setProgressValue] = useState("");
	const [savedProgressValue, setSavedProgressValue] = useState("");
	const [totalPages, setTotalPages] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [setAsCurrent, setSetAsCurrent] = useState(true);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [resetSnackbar, setResetSnackbar] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		const loadInitial = async () => {
			try {
				const user = await getUserDetails();
				setSelectedPara(user.currentPara);
			} catch (err) {
				console.error("Failed to fetch user info", err);
			}
		};
		loadInitial();
	}, []);

	useEffect(() => {
		if (!selectedPara || !progress.length) return;

		const paraData = progress.find((item) => item.para === selectedPara);
		if (paraData) {
			setProgressValue(paraData.completed);
			setSavedProgressValue(paraData.completed);
			setTotalPages(paraData.total);
			setStartDate(paraData.start_date || dayjs().format("YYYY-MM-DD"));

			if (paraData.completed === paraData.total && !paraData.end_date) {
				setEndDate(dayjs().format("YYYY-MM-DD"));
			} else {
				setEndDate(paraData.end_date || "");
			}
		}
		setSetAsCurrent(true);
	}, [selectedPara, progress]);

	const handleChange = (e) => {
		const value = e.target.value;
		if (/^\d*\.?\d*$/.test(value)) {
			setProgressValue(value);
			const numeric = parseFloat(value);
			if (numeric === totalPages) {
				setEndDate(dayjs().format("YYYY-MM-DD"));
			} else {
				setEndDate("");
			}
		}
	};

	const handleUpdate = async () => {
		const numericValue = parseFloat(progressValue);
		if (isNaN(numericValue) || numericValue > totalPages) {
			alert(`Progress must be a number ≤ ${totalPages}`);
			return;
		}
		try {
			const token = localStorage.getItem("token");

			await axios.post(
				`${API_URL}/progress`,
				{
					para: selectedPara,
					completed_pages: numericValue,
					total_pages: totalPages,
					start_date: startDate,
					end_date: endDate || null,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (setAsCurrent) {
				await updateCurrentPara(selectedPara);
				setCurrentPara(selectedPara);
			}

			setSavedProgressValue(numericValue);
			setSnackbarOpen(true);
			setTimeout(() => navigate("/dashboard"), 1500);
		} catch (err) {
			alert("Update failed. Try again.");
			console.error(err);
		}
	};

	const handleResetAll = async () => {
		try {
			const token = localStorage.getItem("token");
			await axios.delete(`${API_URL}/reset-all`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			await updateCurrentPara("Para 30");
			setCurrentPara("Para 30");
			setResetSnackbar(true);
			setConfirmOpen(false);
			setTimeout(() => navigate("/dashboard"), 1500);
		} catch (err) {
			alert("Reset failed");
			console.error(err);
		}
	};

	return (
		<Box
			sx={{
				backgroundColor: "#f5f5f5",
				minHeight: "90vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				p: 2,
			}}
		>
			<Sidebar />

			<Box
				sx={{
					position: "absolute",
					top: 20,
					right: 40,
					zIndex: 1000,
				}}
			>
				<Button
					variant='contained'
					color='error'
					onClick={() => setConfirmOpen(true)}
				>
					Reset All Data
				</Button>
			</Box>

			<Paper
				elevation={5}
				sx={{
					backgroundColor: "#ffffff",
					padding: 4,
					width: "100%",
					maxWidth: 400,
					borderRadius: 2,
				}}
			>
				<Typography variant='h6' gutterBottom>
					Update Progress
				</Typography>

				{selectedPara && (
					<Typography
						variant='body2'
						color='textSecondary'
						sx={{ mb: 1 }}
					>
						Current progress: {savedProgressValue} / {totalPages}{" "}
						pages
					</Typography>
				)}

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel id='para-label'>Select Para</InputLabel>
					<Select
						labelId='para-label'
						value={selectedPara}
						label='Select Para'
						onChange={(e) => setSelectedPara(e.target.value)}
					>
						{Array.from({ length: 30 }, (_, i) => (
							<MenuItem key={i + 1} value={`Para ${i + 1}`}>
								Para {i + 1}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label='Completed pages'
					type='number'
					inputProps={{ step: 0.5, min: 0, max: totalPages }}
					variant='outlined'
					fullWidth
					value={progressValue}
					onChange={handleChange}
					sx={{ mb: 2 }}
					disabled={!selectedPara}
					helperText={
						progressValue > totalPages
							? `Cannot exceed total (${totalPages})`
							: ""
					}
					error={progressValue > totalPages}
				/>

				<Grid container spacing={2} sx={{ mb: 2 }}>
					<Grid item xs={6}>
						<TextField
							label='Start Date'
							type='date'
							fullWidth
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							label='End Date'
							type='date'
							fullWidth
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>
				</Grid>

				<FormControlLabel
					control={
						<Switch
							checked={setAsCurrent}
							onChange={(e) => setSetAsCurrent(e.target.checked)}
							color='primary'
						/>
					}
					label='Set this Para as current Para'
					sx={{ mb: 2 }}
				/>

				<Button
					variant='contained'
					fullWidth
					onClick={handleUpdate}
					sx={{
						backgroundColor: "#28a745",
						"&:hover": { backgroundColor: "#757575" },
					}}
				>
					Update
				</Button>

				<Snackbar
					open={snackbarOpen}
					autoHideDuration={3000}
					onClose={() => setSnackbarOpen(false)}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
				>
					<Alert
						onClose={() => setSnackbarOpen(false)}
						severity='success'
						variant='filled'
						sx={{ width: "100%" }}
					>
						Progress updated successfully!
					</Alert>
				</Snackbar>

				<Snackbar
					open={resetSnackbar}
					autoHideDuration={3000}
					onClose={() => setResetSnackbar(false)}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
				>
					<Alert
						severity='info'
						variant='filled'
						sx={{ width: "100%" }}
					>
						All progress and mistakes have been reset.
					</Alert>
				</Snackbar>
			</Paper>

			<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
				<DialogTitle>Confirm Reset</DialogTitle>
				<DialogContent>
					Are you sure you want to reset all progress, mistakes, and
					activity logs? This action cannot be undone.
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleResetAll}
						color='error'
						variant='contained'
					>
						Reset All
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default UpdateForm;
