import { useState } from 'react';

function App() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!prompt) return;
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            const data = await res.json();
            setResponse(data.text);
        } catch (err) {
            setResponse("فشل الاتصال بالسيرفر");
            console.log(err);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '40px' }}>
            <h1>Gemini + Express + React</h1>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                rows={4}
                style={{ width: '100%', marginBottom: '10px' }}
            />
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "جاري التفكير..." : "إرسال"}
            </button>

            <div style={{ marginTop: '20px', background: '#eee', padding: '15px' }}>
                <strong>الرد:</strong>
                <p>{response}</p>
            </div>
        </div>
    );
}

export default App;