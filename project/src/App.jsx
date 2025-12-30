import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import ChatPage from "./Components/ChatPage.jsx";
import AdminChats from "./Components/AdminChats.jsx";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Tournaments from "./Components/Tournaments";
import Stadiums from "./Components/Stadiums";
import Home from "./Components/Home";
import AdminDashboard from "./Components/Admin.jsx";
import { getUsers } from "./methods/functions/user_functions.jsx";
import TournamentDetails from "./Components/TournamentDetails.jsx";
import AddTournament from "./Components/addTournament.jsx";
import EditTournament from "./Components/EditTournament.jsx";
import AddStadium from "./Components/addStadium.jsx";
import EditStadium from "./Components/editStadium.jsx";
import AddMatchPage from "./Components/AddMatch.jsx";

const ProtectedRoute = ({ authReady, isLoggedIn, children }) => {
    if (!authReady) return null;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return children;
};

const AdminRoute = ({ authReady, isLoggedIn, user, children }) => {
    if (!authReady) return null;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (user?.role !== "admin") return <Navigate to="/home" replace />;
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authReady, setAuthReady] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        if (stored) {
            try {
                const parsedUser = JSON.parse(stored);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (e) {
                localStorage.removeItem("auth_user");
                setUser(null);
                setIsLoggedIn(false);
            }
        }
        setAuthReady(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getUsers();
                setAllUsers(users);
            } catch (e) {
                console.log("getUsers error:", e);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Navbar
                user={user}
                isLoggedIn={isLoggedIn}
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
            />

            <div className="bg-gray-50 min-h-screen">
                <Routes>
                    <Route
                        path="/login"
                        element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />}
                    />

                    <Route
                        path="/register"
                        element={<Register setUser={setUser} setIsLoggedIn={setIsLoggedIn} />}
                    />

                    <Route
                        path="/tournaments"
                        element={
                            <ProtectedRoute authReady={authReady} isLoggedIn={isLoggedIn}>
                                <Tournaments />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/stadiums"
                        element={
                            <ProtectedRoute authReady={authReady} isLoggedIn={isLoggedIn}>
                                <Stadiums />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/home"
                        element={<Home isLoggedIn={isLoggedIn} allUsers={allUsers} />}
                    />

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute
                                authReady={authReady}
                                isLoggedIn={isLoggedIn}
                                user={user}
                            >
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />

                    <Route path="/tournaments/:id" element={<TournamentDetails />} />

                    <Route
                        path="/admin/tournaments/new"
                        element={
                            <AdminRoute
                                authReady={authReady}
                                isLoggedIn={isLoggedIn}
                                user={user}
                            >
                                <AddTournament />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/tournaments/:id/edit"
                        element={
                            <AdminRoute authReady={authReady} isLoggedIn={isLoggedIn} user={user}>
                                <EditTournament />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/stadiums/new"
                        element={
                            <AdminRoute authReady={authReady} isLoggedIn={isLoggedIn} user={user}>
                                <AddStadium />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/stadiums/:id/edit"
                        element={
                            <AdminRoute authReady={authReady} isLoggedIn={isLoggedIn} user={user}>
                                <EditStadium />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/chat"
                        element={
                            <ProtectedRoute authReady={authReady} isLoggedIn={isLoggedIn}>
                                <ChatPage user={user} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/chats"
                        element={
                            <AdminRoute authReady={authReady} isLoggedIn={isLoggedIn} user={user}>
                                <AdminChats user={user} />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/matches/new"
                        element={
                            <AdminRoute authReady={authReady} isLoggedIn={isLoggedIn} user={user}>
                                <AddMatchPage />
                            </AdminRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
