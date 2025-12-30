import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "./../contexts/axiosInstance";

const EVENTS = {
    DM_SEND_USER: "dm:user:send",
    DM_RECEIVE: "dm:receive",
};

const ADMIN_ID = "694e945afc34aa398d1baa1b";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const socketRef = useRef(null);
    const bottomRef = useRef(null);

    const authUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("auth_user") || "null");
        } catch {
            return null;
        }
    }, []);

    const myId = authUser?._id;

    // ✅ connect socket once
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const s = io("http://localhost:8008", {
            auth: { token },
            transports: ["polling", "websocket"],
            withCredentials: true,
        });

        socketRef.current = s;

        s.on("connect", () => console.log("socket connected:", s.id));
        s.on("connect_error", (err) => console.log("socket error:", err.message));

        // ✅ receive realtime messages (both my messages + admin messages)
        s.on(EVENTS.DM_RECEIVE, (payload) => {
            const normalized = {
                _id: payload._id || `${payload.sender}-${payload.createdAt}`,
                sender: payload.sender,
                receiver: payload.receiver,
                message: payload.message,
                createdAt: payload.createdAt,
            };

            // ✅ show only messages between me and admin
            const senderId = String(normalized.sender);
            const receiverId = String(normalized.receiver);

            const related =
                (senderId === String(myId) && receiverId === String(ADMIN_ID)) ||
                (senderId === String(ADMIN_ID) && receiverId === String(myId));

            if (!related) return;

            // ✅ dedup
            setMessages((prev) => {
                if (prev.some((m) => String(m._id) === String(normalized._id))) return prev;
                return [...prev, normalized];
            });
        });

        return () => {
            s.disconnect();
            socketRef.current = null;
        };
    }, [myId]);

    useEffect(() => {
        const load = async () => {
            if (!ADMIN_ID) {
                console.log("Missing VITE_ADMIN_ID in frontend .env");
                return;
            }

            setLoading(true);
            try {
                // ✅ ROUTE الصحيح من ملف routes عندك
                const res = await api.get(`/api/chat/history/${ADMIN_ID}`);

                // مرونة حسب شكل الريسبونس عندك
                const list = res.data?.messages || res.data?.data || res.data || [];
                setMessages(list);
            } catch (e) {
                console.log("history error:", e?.response?.data || e.message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // ✅ auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = () => {
        const clean = text.trim();
        if (!clean) return;

        setText("");
        socketRef.current?.emit(EVENTS.DM_SEND_USER, { message: clean });
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 flex flex-col max-h-[80vh] overflow-y-scroll">
                {/* Header */}
                <div className="border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
                    <div>
                        <div className="text-lg font-extrabold text-gray-900">Chat</div>
                        <div className="text-xs font-semibold text-gray-500">With Admin</div>
                    </div>
                    <div className="text-xs font-bold text-gray-400">{authUser?.role || "user"}</div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {loading ? (
                        <div className="text-sm text-gray-500">Loading...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-sm text-gray-500">No messages yet.</div>
                    ) : (
                        messages.map((m) => {
                            const mine = String(m.sender) === String(myId);
                            return (
                                <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 border text-sm font-semibold ${
                                            mine
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-800 border-gray-200"
                                        }`}
                                    >
                                        <div className="text-[11px] opacity-80 mb-1">{mine ? "me" : "admin"}</div>
                                        <div>{m.message}</div>
                                        <div className="text-[10px] opacity-70 mt-1">
                                            {m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : ""}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
                        placeholder="Type your message..."
                        className="flex-1 h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold text-sm"
                    />
                    <button
                        onClick={send}
                        className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
