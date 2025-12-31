import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "./../contexts/axiosInstance";

const EVENTS = {
    DM_SEND_ADMIN: "dm:admin:send",
    DM_RECEIVE: "dm:receive",
};

export default function AdminChats() {
    const [conversations, setConversations] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [name, setName] = useState("");

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loadingList, setLoadingList] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const socketRef = useRef(null);
    const bottomRef = useRef(null);

    const authUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("auth_user") || "null");
        } catch {
            return null;
        }
    }, []);

    // ✅ connect socket مرة واحدة
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const s = io("http://localhost:8008", {
            auth: { token },
            transports: ["websocket"],
            withCredentials: true,
        });

        socketRef.current = s;

        s.on(EVENTS.DM_RECEIVE, (payload) => {
            const me = String(authUser?._id);
            const other = String(selectedUserId);

            const related =
                selectedUserId &&
                ((String(payload.sender) === me && String(payload.receiver) === other) ||
                    (String(payload.sender) === other && String(payload.receiver) === me));

            if (related) {
                const normalized = {
                    _id: payload._id || `${payload.sender}-${payload.createdAt || Date.now()}`,
                    sender: payload.sender,
                    receiver: payload.receiver,
                    message: payload.message,
                    createdAt: payload.createdAt || new Date().toISOString(),
                };
                setMessages((prev) => [...prev, normalized]);
            }

            const otherId = String(payload.sender) === me ? String(payload.receiver) : String(payload.sender);

            setConversations((prev) => {
                const copy = [...prev];
                const idx = copy.findIndex((c) => String(c.userId) === otherId);

                const updated = {
                    userId: otherId,
                    name: copy[idx]?.name || `User ${otherId.slice(-4)}`,
                    lastMessage: payload.message,
                    updatedAt: payload.createdAt || new Date().toISOString(),
                    unreadCount:
                        String(selectedUserId) === otherId ? 0 : (copy[idx]?.unreadCount || 0) + 1,
                };

                if (idx >= 0) copy.splice(idx, 1);
                return [updated, ...copy];
            });
        });

        return () => {
            s.disconnect();
            socketRef.current = null;
        };
    }, [authUser?._id, selectedUserId]);

    useEffect(() => {
        const loadInbox = async () => {
            const token = localStorage.getItem("auth_token");
            if (!token) return;

            setLoadingList(true);
            try {
                const res = await api.get("/api/chat/conversations", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const list = res.data?.conversations || res.data || [];
                setConversations(list);

                if (!selectedUserId && list.length) {
                    setSelectedUserId(list[0].userId);
                }
            } catch (e) {
                console.log("inbox error:", e?.response?.data || e.message);
            } finally {
                setLoadingList(false);
            }
        };

        loadInbox();
    }, []);

    useEffect(() => {
        const loadHistory = async () => {
            if (!selectedUserId) {
                setMessages([]);
                return;
            }

            const token = localStorage.getItem("auth_token");
            if (!token) return;

            setLoadingChat(true);
            try {
                const res = await api.get(`/api/chat/history/${selectedUserId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(res.data?.messages || []);
                // reset unread
                setConversations((prev) =>
                    prev.map((c) =>
                        String(c.userId) === String(selectedUserId) ? { ...c, unreadCount: 0 } : c
                    )
                );
            } catch (e) {
                console.log("history error:", e?.response?.data || e.message);
            } finally {
                setLoadingChat(false);
            }
        };

        loadHistory();
    }, [selectedUserId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = () => {
        const clean = text.trim();
        if (!clean || !selectedUserId) return;

        setText("");

        // optimistic
        setMessages((prev) => [
            ...prev,
            {
                _id: `temp-${Date.now()}`,
                sender: authUser?._id,
                receiver: selectedUserId,
                message: clean,
                createdAt: new Date().toISOString(),
            },
        ]);

        socketRef.current?.emit(EVENTS.DM_SEND_ADMIN, {
            toUserId: selectedUserId,
            message: clean,
        });
    };

    useEffect(() => {
        const getUserName = async () => {
            try {
                if (!selectedUserId) return;

                const res = await api.get(`/api/users/${selectedUserId}`);
                const user = res.data;

                setName(`${user.firstName} ${user.lastName}`);
            } catch (err) {
                console.error(err);
            }
        };

        getUserName();
    }, [selectedUserId]);

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4">
                {/* ✅ Sidebar / Inbox */}
                <div className="col-span-4 bg-white border border-gray-200 rounded-2xl p-3 h-[75vh] flex flex-col">
                    <div className="font-extrabold text-gray-900 mb-2">Inbox</div>

                    {loadingList ? (
                        <div className="text-sm text-gray-500">Loading...</div>
                    ) : conversations.length === 0 ? (
                        <div className="text-sm text-gray-500">No conversations yet.</div>
                    ) : (
                        <div className="flex-1 overflow-auto space-y-2 pr-1">
                            {conversations.map((c) => {
                                const active = String(c.userId) === String(selectedUserId);
                                return (
                                    <button
                                        key={c.userId}
                                        onClick={() => setSelectedUserId(c.userId)}
                                        className={`w-full text-left p-3 rounded-xl border transition ${
                                            active ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="font-extrabold text-sm text-gray-900">
                                                {name}
                                            </div>
                                            {!!c.unreadCount && (
                                                <span className="text-xs font-extrabold bg-gray-900 text-white px-2 py-0.5 rounded-full">
                          {c.unreadCount}
                        </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                            {c.lastMessage || "—"}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ✅ Chat panel */}
                <div className="col-span-8 bg-white border border-gray-200 rounded-2xl p-4 h-[75vh] flex flex-col">
                    <div className="border-b border-gray-100 pb-3 mb-3">
                        <div className="text-lg font-extrabold text-gray-900">Admin Chat</div>
                        <div className="text-xs font-semibold text-gray-500">
                            Selected User:{" "}
                            <span className="text-gray-800">{name || "None"}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto space-y-2 pr-1">
                        {loadingChat ? (
                            <div className="text-sm text-gray-500">Loading chat...</div>
                        ) : !selectedUserId ? (
                            <div className="text-sm text-gray-500">Select a user to start.</div>
                        ) : messages.length === 0 ? (
                            <div className="text-sm text-gray-500">No messages yet.</div>
                        ) : (
                            messages.map((m) => {
                                const mine = String(m.sender) === String(authUser?._id);
                                return (
                                    <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2 border text-sm font-semibold ${
                                                mine
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "bg-white text-gray-800 border-gray-200"
                                            }`}
                                        >
                                            <div className="text-[11px] opacity-80 mb-1">{mine ? "admin" : "user"}</div>
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

                    <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
                            placeholder="Reply as admin..."
                            className="flex-1 h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 font-semibold text-sm"
                        />
                        <button
                            onClick={send}
                            className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-extrabold text-sm"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
