import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;


export async function updateProgress(data) {
  const formatted = data.map((item) => ({
    para: item.para,
    completed_pages: item.completed,
    total_pages: item.total,
  }));

  try {
    const response = await axios.post(`${API_URL}/progress`, formatted);
    return response.data; // { message: "...", count: ... }
  } catch (error) {
    console.error("❌ Bulk insert failed:", error.message);
    throw error;
  }
}
