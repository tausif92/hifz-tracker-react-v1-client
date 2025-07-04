import React from "react";
import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Container,
	IconButton,
	Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import BugReportIcon from "@mui/icons-material/BugReport";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import RepeatIcon from "@mui/icons-material/Repeat";
import FlagIcon from "@mui/icons-material/Flag";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import VerifiedIcon from "@mui/icons-material/Verified";
import { FaKaaba, FaMosque } from "react-icons/fa";

const quotes = [
	{
		title: "Preservation of the Qur'an",
		description:
			"Indeed, it is We who sent down the Qur'an and indeed, We will be its guardian. - Surah Al-Hijr (15:9)",
		icon: <FaKaaba size={32} color='black' />,
	},

	{
		title: "Retention of the Qur’an",
		description:
			"Keep refreshing your knowledge of the Qur’an, for (I swear) by the One in Whose Hand is my soul, it is more likely to slip away than a tied camel - Sahih Bukhari 5033, Sahih Muslim 789",
		icon: <FaMosque size={32} color='#2e7d32' />,
	},
	{
		title: "Qur'an Made Easy to Remember",
		description:
			"And We have certainly made the Qur'an easy for remembrance, so is there any who will remember? - Surah Al-Qamar (54:17)",
		icon: <FaKaaba size={32} color='black' />,
	},
	{
		title: "The Best of the People",
		description:
			"The best among you are those who learn the Qur'an and teach it - Sahih al-Bukhari 5027",
		icon: <FaMosque size={32} color='#2e7d32' />,
	},
	{
		title: "Qur’an is a Healing and Mercy",
		description:
			"And We send down of the Qur'an that which is healing and mercy for the believers... - Surah Al-Isra (17:82)",
		icon: <FaKaaba size={32} color='black' />,
	},
	{
		title: "Rewards of Reciting the Qur'an",
		description:
			"Those to whom We have given the Book recite it with its true recital. They [are the ones] who believe in it - Surah Al-Baqarah (2:121)",
		icon: <FaKaaba size={32} color='black' />,
	},

	{
		title: "Rank in Jannah",
		description:
			"It will be said to the companion of the Qur'an: Recite and rise, and recite as you used to recite in the world, for your rank will be at the last verse you recite. - Abu Dawood 1464, Tirmidhi 2914",
		icon: <FaMosque size={32} color='#2e7d32' />,
	},
	{
		title: "Qur’an is a Light",
		description:
			"O mankind, there has come to you a clear proof from your Lord, and We have sent down to you a clear light. - Surah An-Nisa (4:174)",
		icon: <FaKaaba size={32} color='black' />,
	},
	{
		title: "Qur’an Will Intercede on the Day of Judgment",
		description:
			"Recite the Qur’an, for it will come as an intercessor for its companions on the Day of Resurrection. - (Sahih Muslim, 804)",
		icon: <FaMosque size={32} color='#2e7d32' />,
	},
];

const benefits = [
	{
		title: "Consistent Progress Tracking",
		description:
			"Tracks how many pages, paras, or surahs you've memorized. Helps ensure daily/weekly goals are met. Visual progress motivates continued effort.",
		icon: <TrackChangesIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
	},
	{
		title: "Mistake & Revision Management",
		description:
			"Records mistakes made during recitation. Encourages active revision for better retention.",
		icon: <BugReportIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
	},
	{
		title: "Structured Routine",
		description:
			"Helps plan and stick to a revision schedule. Prevents neglecting earlier sections.",
		icon: <AccessAlarmIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
	},
	{
		title: "Balanced New v/s Old Revision",
		description:
			"Encourages a balance between new memorization and reviewing older parts.",
		icon: <RepeatIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
	},
	{
		title: "Goal Setting & Motivation",
		description:
			"Set daily/weekly/monthly goals and celebrate milestones. Keeps motivation high.",
		icon: <FlagIcon sx={{ fontSize: 40, color: "#fbc02d" }} />,
	},
	{
		title: "Personalized Learning",
		description:
			"Identifies strengths and weaknesses by Para, Surah, or Page. Makes learning efficient.",
		icon: <PersonSearchIcon sx={{ fontSize: 40, color: "#7b1fa2" }} />,
	},
	{
		title: "Spiritual Discipline",
		description:
			"Reinforces regular Qur'an interaction. Promotes deeper spiritual connection.",
		icon: <SelfImprovementIcon sx={{ fontSize: 40, color: "#0097a7" }} />,
	},
	{
		title: "Build Consistency",
		description:
			"Develop daily habits and structured routines for consistent memorization.",
		icon: <AutoGraphIcon sx={{ fontSize: 40, color: "#7b1fa2" }} />,
	},
	{
		title: "Achieve Quality",
		description:
			"Maintain accuracy with regular revisions and mistake tracking.",
		icon: <VerifiedIcon sx={{ fontSize: 40, color: "#e64a19" }} />,
	},
];

const HomePage = () => {
	const isLoggedIn = !!localStorage.getItem("token");
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	const handleStartTracking = () => {
		if (isLoggedIn) {
			navigate("/dashboard");
		} else {
			navigate("/register");
		}
	};

	return (
		<Box sx={{ bgcolor: "#f5f6f8", minHeight: "100vh", py: 3 }}>
			<Container maxWidth='xl' sx={{ mb: 20 }}>
				{/* Header */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 4,
						pt: 0,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<IconButton sx={{ p: 0, mr: 1 }}>
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

					<Typography
						variant='h3'
						fontWeight={700}
						sx={{
							mt: 1,
							fontFamily: "'Poppins', sans-serif",
							letterSpacing: "0.5px",
							lineHeight: 1.2,
							textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
							color: "#2E7D32",
						}}
					>
						Quran Hifz Tracker
					</Typography>

					{/* Auth Buttons */}
					<Stack direction='row' spacing={2}>
						{isLoggedIn ? (
							<>
								{/* <Button
									variant='outlined'
									sx={{
										color: "#00b050",
										borderColor: "#00b050",
										"&:hover": {
											borderColor: "#008a3e",
											backgroundColor:
												"rgba(0, 176, 80, 0.08)",
										},
									}}
									component={Link}
									to='/dashboard'
								>
									Dashboard
								</Button> */}

								<Button
									variant='contained'
									sx={{
										backgroundColor: "#00b050",
										"&:hover": {
											backgroundColor: "#008a3e",
										},
									}}
									component={Link}
									to='/dashboard'
								>
									Dashboard
								</Button>
								<Button
									variant='contained'
									onClick={handleLogout}
									sx={{
										backgroundColor: "#00b050",
										"&:hover": {
											backgroundColor: "#008a3e",
										},
									}}
								>
									Logout
								</Button>
							</>
						) : (
							<>
								<Button
									variant='contained'
									sx={{
										backgroundColor: "#00b050",
										"&:hover": {
											backgroundColor: "#008a3e",
										},
									}}
									component={Link}
									to='/login'
								>
									Login
								</Button>
								<Button
									variant='contained'
									sx={{
										backgroundColor: "#00b050",
										"&:hover": {
											backgroundColor: "#008a3e",
										},
									}}
									component={Link}
									to='/register'
								>
									Register
								</Button>
							</>
						)}
					</Stack>
				</Box>

				{/* Hero */}
				<Box textAlign='center' mb={5} mt={5}>
					<Typography
						variant='h6'
						color='textSecondary'
						maxWidth={600}
						mx='auto'
						paragraph
					>
						Memorizing the Quran is a sacred journey. Our tracker
						helps you stay organized, consistent, and motivated —
						from Juz 1 to 30.
					</Typography>
					<Button
						variant='contained'
						size='large'
						sx={{
							mt: 4,
							px: 4,
							py: 1,
							backgroundColor: "#00b050",
							"&:hover": {
								backgroundColor: "#008a3e",
							},
						}}
						onClick={handleStartTracking}
					>
						Start Tracking Now
					</Button>
				</Box>

				{/* Benefits */}
				<Box sx={{ mb: 8 }}>
					<Typography
						variant='h4'
						component='h2'
						fontWeight='bold'
						textAlign='center'
						gutterBottom
						sx={{ mb: 6 }}
					>
						Why Track Your Memorization?
					</Typography>

					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 4,
							justifyContent: "center",
						}}
					>
						{benefits.map((benefit, index) => (
							<Card
								key={index}
								sx={{
									width: 350,
									height: 150,
									display: "flex",
									flexDirection: "column",
									p: 3,
									borderRadius: 2,
									boxShadow: 3,
									transition: "transform 0.3s",
									"&:hover": {
										transform: "translateY(-5px)",
									},
								}}
							>
								<CardContent
									sx={{
										display: "flex",
										flexDirection: "column",
										height: "100%",
										p: 0,
										"&:last-child": {
											pb: 0,
										},
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "flex-start",
											mb: 2,
										}}
									>
										<Box sx={{ mr: 2, flexShrink: 0 }}>
											{benefit.icon}
										</Box>
										<Typography
											variant='h6'
											fontWeight='bold'
											sx={{ wordBreak: "break-word" }}
										>
											{benefit.title}
										</Typography>
									</Box>
									<Typography
										variant='body1'
										color='text.secondary'
										sx={{
											flexGrow: 1,
											wordBreak: "break-word",
											overflow: "hidden",
											textOverflow: "ellipsis",
											display: "-webkit-box",
											WebkitLineClamp: 4,
											WebkitBoxOrient: "vertical",
										}}
									>
										{benefit.description}
									</Typography>
								</CardContent>
							</Card>
						))}
					</Box>
				</Box>

				{/* Quotes */}
				<Box sx={{ mb: 8 }}>
					<Typography
						variant='h4'
						component='h2'
						fontWeight='bold'
						textAlign='center'
						gutterBottom
						sx={{ mb: 6 }}
					>
						Quranic and Hadith Inspiration
					</Typography>

					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 4,
							justifyContent: "center",
						}}
					>
						{quotes.map((quote, index) => (
							<Card
								key={index}
								sx={{
									width: 350,
									height: 150,
									display: "flex",
									flexDirection: "column",
									p: 3,
									borderRadius: 2,
									boxShadow: 3,
									transition: "transform 0.3s",
									"&:hover": {
										transform: "translateY(-5px)",
									},
								}}
							>
								<CardContent
									sx={{
										display: "flex",
										flexDirection: "column",
										height: "100%",
										p: 0,
										"&:last-child": {
											pb: 0,
										},
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "flex-start",
											mb: 2,
										}}
									>
										<Box sx={{ mr: 2, flexShrink: 0 }}>
											{quote.icon}
										</Box>
										<Typography
											variant='h6'
											fontWeight='bold'
											sx={{ wordBreak: "break-word" }}
										>
											{quote.title}
										</Typography>
									</Box>
									<Typography
										variant='body1'
										color='text.secondary'
										sx={{
											flexGrow: 1,
											wordBreak: "break-word",
											overflow: "hidden",
											textOverflow: "ellipsis",
											display: "-webkit-box",
											WebkitLineClamp: 4,
											WebkitBoxOrient: "vertical",
										}}
									>
										{quote.description}
									</Typography>
								</CardContent>
							</Card>
						))}
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default HomePage;
