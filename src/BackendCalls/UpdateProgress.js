import axios from "axios";

const API_URL = "http://localhost:4000/progress";


export async function updateProgress(data) {
  const formatted = data.map((item) => ({
    para: item.para,
    completed_pages: item.completed,
    total_pages: item.total,
  }));

  try {
    const response = await axios.post(API_URL, formatted);
    return response.data; // { message: "...", count: ... }
  } catch (error) {
    console.error("❌ Bulk insert failed:", error.message);
    throw error;
  }
}
