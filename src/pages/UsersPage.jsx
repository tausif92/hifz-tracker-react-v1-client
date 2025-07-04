import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	CircularProgress,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteUserId, setDeleteUserId] = useState("");

	const fetchUsers = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const res = await axios.get("http://localhost:4000/users", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setUsers(res.data);
		} catch (err) {
			console.error("Failed to fetch users:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleDeleteUser = async () => {
		const token = localStorage.getItem("token");
		if (!deleteUserId || !token) return;

		try {
			await axios.delete(`http://localhost:4000/user/${deleteUserId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setDeleteDialogOpen(false);
			setDeleteUserId("");
			fetchUsers(); // Refresh list
		} catch (err) {
			console.error("Failed to delete user:", err);
		}
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
				{/* Header with user count and delete button */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Typography variant='h6' fontWeight='bold' color='#333'>
						Total Users: {users.length}
					</Typography>
					<Button
						variant='outlined'
						color='error'
						onClick={() => setDeleteDialogOpen(true)}
					>
						Delete User
					</Button>
				</Box>

				{loading ? (
					<CircularProgress />
				) : (
					<TableContainer
						component={Paper}
						elevation={3}
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
									<TableCell>Sl No</TableCell>
									<TableCell>ID</TableCell>
									<TableCell>Full Name</TableCell>
									<TableCell>Email</TableCell>
									<TableCell>Role</TableCell>
									<TableCell>
										Registration Date (dd/mm/yyyy)
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{users.map((user, index) => (
									<TableRow
										key={user.id}
										sx={{
											backgroundColor: "#fff",
											"& td": {
												padding: "10px 12px",
												borderBottom:
													"1px solid rgba(168, 163, 163, 0.58)",
											},
										}}
									>
										<TableCell align='center'>
											{index + 1}
										</TableCell>
										<TableCell align='center'>
											{user.id}
										</TableCell>
										<TableCell align='center'>
											{user.full_name}
										</TableCell>
										<TableCell align='center'>
											{user.email}
										</TableCell>
										<TableCell align='center'>
											{user.role}
										</TableCell>
										<TableCell align='center'>
											{user.register_date.toUpperCase()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}

				{/* Delete User Modal */}
				<Dialog
					open={deleteDialogOpen}
					onClose={() => setDeleteDialogOpen(false)}
				>
					<DialogTitle>Delete User</DialogTitle>
					<DialogContent>
						<TextField
							label='Enter User ID'
							value={deleteUserId}
							onChange={(e) => setDeleteUserId(e.target.value)}
							fullWidth
							autoFocus
							type='number'
							margin='normal'
						/>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => setDeleteDialogOpen(false)}
							color='secondary'
						>
							Cancel
						</Button>
						<Button
							onClick={handleDeleteUser}
							color='error'
							variant='contained'
						>
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Box>
	);
};

export default UsersPage;
