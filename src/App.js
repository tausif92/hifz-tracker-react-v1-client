import Dashboard from "./components/HomePage/Dashboard";
import HomePage from "./components/HomePage/HomePage";
import ParaStatusPage from "./components/ParaStatusPage/ParaStatusPage";
import RevisionPage from "./components/RevisionPage/RevisionPage";
import ActivityPage from "./components/TimeTakenPage/ActivityPage";
import UpdateForm from "./components/UpdateSabaqPage/UpdateSabaqPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import PrivateRoute from "./components/Auth/PrivateRoute";

import useProgressData from "./BackendCalls/GetProgress";
import { GlobalProvider } from "./GlobalContext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";

function App() {
	const { progress, loading } = useProgressData();
	if (loading) return <p>Loading progress data...</p>;

	const currentPara = localStorage.getItem("currentPara") || "Para 1";

	const progressData = progress.map((item) => ({
		para: item.para,
		completed_pages: item.completed,
		total_pages: item.total,
	}));

	const currentParaProgress =
		progressData.find((item) => item.para === currentPara)
			?.completed_pages || 0;

	const currentParaTotalPages =
		progressData.find((item) => item.para === currentPara)?.total_pages ||
		0;

	return (
		<GlobalProvider>
			<Router>
				<Routes>
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/' element={<HomePage />} />
					{/* All Protected Routes Below */}
					<Route
						path='/dashboard'
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route
						path='/paraStatus'
						element={
							<PrivateRoute>
								<ParaStatusPage />
							</PrivateRoute>
						}
					/>
					<Route
						path='/revision'
						element={
							<PrivateRoute>
								<RevisionPage />
							</PrivateRoute>
						}
					/>
					<Route
						path='/timeTaken'
						element={
							<PrivateRoute>
								<ActivityPage />
							</PrivateRoute>
						}
					/>
					<Route
						path='/updateSabaq'
						element={
							<PrivateRoute>
								<UpdateForm
									totalPages={currentParaTotalPages}
									currentProgress={currentParaProgress}
								/>
							</PrivateRoute>
						}
					/>
					<Route
						path='/users'
						element={
							<PrivateRoute>
								<UsersPage />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		</GlobalProvider>
	);
}

export default App;
