import { io } from "socket.io-client";

export function createSocket() {
    const stored = localStorage.getItem("auth_user");
    const user = stored ? JSON.parse(stored) : null;

    return io("http://localhost:8008", {
        auth: {
            token: user?.token,
        },
        transports: ["websocket"],
    });
}