import axios from "axios";

export const postRequestToAi = async (object) => {
    if (!object) return;
    try {
        const res = await axios.post('http://localhost:8008/api/ai/chat', object);
        return res.data.text;
    } catch (err) {
        console.error("AI API Error:", err.response?.data || err.message);
        throw err;
    }
}