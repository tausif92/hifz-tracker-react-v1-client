import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/progress";

export default function useProgressData() {
	const [progress, setProgress] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProgress = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(API_URL, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(response.data);
				const formatted = response.data.map((item) => ({
					para: item.para,
					completed: item.completed_pages,
					total: item.total_pages,
					start_date: item.start_date,
					end_date: item.end_date,
				}));
				setProgress(formatted);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching progress:", err);
				setLoading(false);
			}
		};

		fetchProgress();
	}, []);

	return { progress, loading };
}
