import React, { useState, useEffect } from "react";
import {
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	IconButton,
	Toolbar,
	Typography,
	Box,
	Tooltip,
	Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import UpdateIcon from "@mui/icons-material/Update";
import BookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(true);
	const [userRole, setUserRole] = useState(null);
	const drawerWidth = isOpen ? 220 : 64;
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"http://localhost:4000/user/me",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setUserRole(response.data.role);
			} catch (error) {
				console.error("Failed to fetch user role:", error);
				setUserRole(null);
			}
		};

		fetchUser();
	}, []);

	const toggleDrawer = () => {
		setIsOpen(!isOpen);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	const navItems = React.useMemo(() => {
		const items = [
			{ link: "/", label: "HOME", icon: <HomeIcon /> },
			{ link: "/dashboard", label: "DASHBOARD", icon: <DashboardIcon /> },
			{
				link: "/paraStatus",
				label: "PARA STATUS",
				icon: <AssessmentIcon />,
			},
			{
				link: "/revision",
				label: "UPDATE REVISION",
				icon: <UpdateIcon />,
			},
			{ link: "/updateSabaq", label: "UPDATE SABAQ", icon: <BookIcon /> },
			{
				link: "/timeTaken",
				label: "PARA TIME",
				icon: <AccessTimeIcon />,
			},
		];
		if (userRole === "admin") {
			items.push({
				link: "/users",
				label: "USERS",
				icon: <PeopleIcon />,
			});
		}
		return items;
	}, [userRole]);

	return (
		<Drawer
			variant='permanent'
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: drawerWidth,
					transition: "width 0.3s",
					overflowX: "hidden",
					boxSizing: "border-box",
					backgroundColor: "#f9f9f9",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				},
			}}
		>
			<Box>
				<Toolbar
					sx={{
						display: "flex",
						justifyContent: isOpen ? "space-between" : "center",
						alignItems: "center",
						px: 2,
					}}
				>
					{isOpen && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<BookIcon sx={{ color: "#00b050" }} />
							<Typography
								variant='h6'
								noWrap
								sx={{
									fontWeight: "bold",
									color: "#00b050",
									letterSpacing: "1px",
									textTransform: "uppercase",
									fontSize: "1.1rem",
								}}
							>
								Hifz App
							</Typography>
						</Box>
					)}
					<IconButton onClick={toggleDrawer}>
						{isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
					</IconButton>
				</Toolbar>

				<List>
					{navItems.map((item) => {
						const isActive = location.pathname === item.link;
						return (
							<Tooltip
								title={!isOpen ? item.label : ""}
								placement='right'
								key={item.label}
							>
								<Link
									to={item.link}
									style={{
										textDecoration: "none",
										color: "inherit",
									}}
								>
									<ListItem
										button
										sx={{
											backgroundColor: isActive
												? "#e0f7e9"
												: "transparent",
											"&:hover": {
												backgroundColor: "#d3f2e2",
											},
											px: isOpen ? 2 : 1,
											borderRadius: "8px",
											margin: "4px 8px",
										}}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												justifyContent: "center",
												color: isActive
													? "#00b050"
													: "#444",
											}}
										>
											{item.icon}
										</ListItemIcon>
										{isOpen && (
											<ListItemText
												primary={item.label}
												sx={{
													ml: 2,
													span: {
														color: isActive
															? "#00b050"
															: "#333",
														fontWeight: isActive
															? "bold"
															: "normal",
														fontSize: "0.95rem",
													},
												}}
											/>
										)}
									</ListItem>
								</Link>
							</Tooltip>
						);
					})}
				</List>
			</Box>

			{/* Logout Button at Bottom */}
			<Box>
				<Divider />
				<List>
					<Tooltip title={!isOpen ? "Logout" : ""} placement='right'>
						<ListItem
							button
							onClick={handleLogout}
							sx={{
								px: isOpen ? 2 : 1,
								borderRadius: "8px",
								margin: "6px 8px",
								"&:hover": {
									backgroundColor: "#fdecea",
								},
							}}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									justifyContent: "center",
									color: "#c62828",
								}}
							>
								<LogoutIcon />
							</ListItemIcon>
							{isOpen && (
								<ListItemText
									primary='Logout'
									sx={{
										ml: 2,
										span: {
											color: "#c62828",
											fontWeight: "bold",
											fontSize: "0.95rem",
										},
									}}
								/>
							)}
						</ListItem>
					</Tooltip>
				</List>
			</Box>
		</Drawer>
	);
};

export default Sidebar;
