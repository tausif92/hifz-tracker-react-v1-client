import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Link,
	Container,
	IconButton,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
const API_URL = process.env.REACT_APP_API_URL;

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailTouched, setEmailTouched] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const [emailError, setEmailError] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);

	// 🚀 Redirect if already logged in
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/dashboard");
		}
	}, [navigate]);

	useEffect(() => {
		validateForm();
	}, [email, password]);

	const validateForm = () => {
		let emailErr = "";
		let isValid = true;

		if (!email.trim()) {
			emailErr = "Email is required";
			isValid = false;
		} else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			emailErr = "Invalid email format";
			isValid = false;
		}

		if (!password.trim()) {
			isValid = false;
		}

		setEmailError(emailErr);
		setIsFormValid(isValid);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || "Login failed");
			}

			localStorage.setItem("token", data.token);
			navigate("/dashboard");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ bgcolor: "#f5f6f8", minHeight: "100vh" }}>
			<Container maxWidth='xl'>
				{/* Header Section */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 6, // Increased margin bottom
						pt: 3,
						position: "relative",
					}}
				>
					{/* Logo on left */}
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<IconButton
							component={RouterLink}
							to='/'
							sx={{ p: 0, mr: 1 }}
						>
							<MenuBookIcon
								sx={{
									fontSize: 40,
									backgroundColor: "white",
									borderRadius: "50%",
									p: 1,
									boxShadow: 2,
									color: "#00b050",
								}}
							/>
						</IconButton>
						<Typography
							variant='h5'
							fontWeight='bold'
							sx={{ color: "#00b050" }}
						>
							Hifz App
						</Typography>
					</Box>

					{/* Centered title */}
					<Typography
						variant='h3'
						fontWeight={700}
						sx={{
							position: "absolute",
							left: "50%",
							transform: "translateX(-50%)",
							fontFamily: "'Poppins', sans-serif",
							letterSpacing: "0.5px",
							lineHeight: 1.2,
							textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
							color: "#2E7D32",
						}}
					>
						Quran Hifz Tracker
					</Typography>

					{/* Home button on right */}
					<IconButton
						component={RouterLink}
						to='/'
						sx={{
							color: "#00b050",
							"&:hover": {
								backgroundColor: "rgba(0, 176, 80, 0.08)",
							},
						}}
					>
						<HomeIcon fontSize='large' />
					</IconButton>
				</Box>

				{/* Login form with increased top margin */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						mt: 8, // Added margin top to move form down
					}}
				>
					<Paper elevation={3} sx={{ padding: 4, width: 350 }}>
						<Typography variant='h5' textAlign='center' mb={3}>
							Login
						</Typography>

						{error && (
							<Alert severity='error' sx={{ mb: 2 }}>
								{error}
							</Alert>
						)}

						<form onSubmit={handleLogin}>
							<TextField
								fullWidth
								label='Email'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onBlur={() => setEmailTouched(true)}
								error={emailTouched && !!emailError}
								helperText={emailTouched && emailError}
								margin='normal'
								required
							/>
							<TextField
								fullWidth
								label='Password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								margin='normal'
								required
							/>

							<Box mt={3}>
								<Button
									type='submit'
									variant='contained'
									fullWidth
									disabled={loading || !isFormValid}
									sx={{
										backgroundColor: "#00b050",
										"&:hover": {
											backgroundColor: "#008a3e",
										},
									}}
								>
									{loading ? (
										<CircularProgress size={24} />
									) : (
										"Login"
									)}
								</Button>
							</Box>
						</form>

						<Typography
							variant='body2'
							textAlign='center'
							mt={3}
							color='text.secondary'
						>
							Don't have an account?{" "}
							<Link
								component={RouterLink}
								to='/register'
								underline='hover'
								color='primary'
								fontWeight='medium'
							>
								Register
							</Link>
						</Typography>
					</Paper>
				</Box>
			</Container>
		</Box>
	);
}

export default LoginPage;
