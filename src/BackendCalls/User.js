import axios from "axios";

export const getUserDetails = async () => {
	const token = localStorage.getItem("token");
	const res = await axios.get("http://localhost:4000/user/me", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

export const updateCurrentPara = async (para) => {
	const token = localStorage.getItem("token");
	await axios.post(
		"http://localhost:4000/user/updateCurrentPara",
		{ currentPara: para },
		{ headers: { Authorization: `Bearer ${token}` } }
	);
};

