import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
export const getUserDetails = async () => {
	const token = localStorage.getItem("token");
	const res = await axios.get(`${API_URL}/user/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

export const updateCurrentPara = async (para) => {
	const token = localStorage.getItem("token");
	await axios.post(
		`${API_URL}/user/updateCurrentPara`,
		{ currentPara: para },
		{ headers: { Authorization: `Bearer ${token}` } }
	);
};

