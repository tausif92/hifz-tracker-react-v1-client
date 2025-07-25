import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const PrivateRoute = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
	const token = localStorage.getItem("token");

	useEffect(() => {
		const verifyToken = async () => {
			if (!token) {
				setIsAuthenticated(false);
				return;
			}

			try {
				await axios.get(`${API_URL}/user/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setIsAuthenticated(true);
			} catch (err) {
				localStorage.removeItem("token");
				localStorage.removeItem("currentPara");
				setIsAuthenticated(false);
			}
		};

		verifyToken();
	}, [token]);

	if (isAuthenticated === null) return <p>Checking session...</p>;

	return isAuthenticated ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
