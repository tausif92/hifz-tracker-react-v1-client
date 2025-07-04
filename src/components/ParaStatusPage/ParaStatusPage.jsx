import React, { useEffect } from "react";
import Sidebar from "../Sidebar";
import { Box } from "@mui/material";
import useProgressData from "../../BackendCalls/GetProgress";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import { useGlobalContext } from "../../GlobalContext";
import { getUserDetails } from "../../BackendCalls/User"; // New API to get current user

const ParaStatusPage = () => {
	const { currentPara, setCurrentPara } = useGlobalContext();
	const { progress, loading } = useProgressData();

	useEffect(() => {
		const fetchCurrentPara = async () => {
			if (!currentPara) {
				try {
					const user = await getUserDetails(); // This hits /user/me
					setCurrentPara(user.currentPara);
				} catch (error) {
					console.error("Failed to fetch user details:", error);
				}
			}
		};
		fetchCurrentPara();
	}, [currentPara, setCurrentPara]);

	if (loading)
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					color: "text.secondary",
				}}
			>
				<p>Loading progress data...</p>
			</Box>
		);

	let completedSum = 0;
	let totalPages = 0;

	progress.forEach((row) => {
		completedSum += row.completed;
		totalPages += row.total;
	});

	const returnPercentage = (completed, total) => {
		if (total === 0) return "0%";
		return `${((completed / total) * 100).toFixed(2)}%`;
	};

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: "#f5f7fa",
			}}
		>
			<Sidebar />
			<Box
				sx={{
					flexGrow: 1,
					p: { xs: 0, md: 4 },
					marginLeft: { xs: 0, md: "50px" },
					marginRight: { xs: 0, md: "100px" },
				}}
			>
				<TableContainer
					component={Paper}
					sx={{
						borderRadius: "6px",
						boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
						width: "100%",
						maxWidth: "1200px",
						overflow: "auto",
						maxHeight: "calc(100vh - 100px)",
						"&::-webkit-scrollbar": {
							width: "2px",
							height: "1px",
						},
						"&::-webkit-scrollbar-thumb": {
							backgroundColor: "#c1c1c1",
							borderRadius: "4px",
						},
					}}
				>
					<Table stickyHeader size='small'>
						<TableHead>
							<TableRow
								sx={{
									"& th": {
										fontWeight: "600",
										fontSize: "0.95rem",
										color: "#fff",
										textAlign: "center",
										padding: "6px 8px",
										borderBottom: "none",
										backgroundColor: "#606060",
									},
								}}
							>
								{[
									"Para",
									"Completed Pages",
									"Remaining Pages",
									"Total Pages",
									"% Completed",
								].map((heading, idx) => (
									<TableCell key={idx}>{heading}</TableCell>
								))}
							</TableRow>
						</TableHead>

						<TableBody>
							{[...progress]
								.sort((a, b) => {
									const getNum = (para) =>
										parseInt(para.replace("Para ", ""));
									return getNum(a.para) - getNum(b.para);
								})
								.map((row) => {
									const isCurrent = row.para === currentPara;
									const isCompletedZero = row.completed === 0;
									const isRemainingZero =
										row.total - row.completed === 0;

									return (
										<TableRow
											key={row.para}
											sx={{
												backgroundColor: isCurrent
													? "#ffe6cc"
													: isCompletedZero
													? "#D0D0D0"
													: isRemainingZero
													? "#AFE1AF"
													: "#fff",
												"& td": {
													padding: "10px 12px",
													borderBottom:
														"1px solid rgba(168, 163, 163, 0.58)",
												},
											}}
										>
											<TableCell
												align='center'
												sx={{
													fontWeight: isCurrent
														? "600"
														: "normal",
												}}
											>
												{row.para}
											</TableCell>
											<TableCell align='center'>
												{row.completed}
											</TableCell>
											<TableCell align='center'>
												{row.total - row.completed}
											</TableCell>
											<TableCell align='center'>
												{row.total}
											</TableCell>
											<TableCell
												align='center'
												sx={{
													fontWeight: "500",
													color: "#000",
												}}
											>
												{returnPercentage(
													row.completed,
													row.total
												)}
											</TableCell>
										</TableRow>
									);
								})}

							<TableRow
								sx={{
									backgroundColor: "#606060",
									position: "sticky",
									bottom: 0,
									"& td": {
										color: "#fff",
										fontWeight: "600",
										fontSize: "0.95rem",
										padding: "6px",
									},
								}}
							>
								{[
									"Overall",
									completedSum,
									totalPages - completedSum,
									totalPages,
									returnPercentage(completedSum, totalPages),
								].map((val, idx) => (
									<TableCell
										key={idx}
										align='center'
										sx={{
											"&:first-of-type": {
												borderBottomLeftRadius: "12px",
											},
											"&:last-of-type": {
												borderBottomRightRadius: "12px",
											},
										}}
									>
										{val}
									</TableCell>
								))}
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	);
};

export default ParaStatusPage;
