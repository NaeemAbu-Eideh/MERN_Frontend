import React, {useEffect, useState} from "react";
import "./App.css";
import {Routes, Route, Navigate} from "react-router-dom";

import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Tournaments from "./Components/Tournaments";
import Stadiums from "./Components/Stadiums";
import Home from "./Components/Home";
import AdminDashboard from "./Components/Admin.jsx";

const ProtectedRoute = ({isLoggedIn, children}) => {
    if (!isLoggedIn) return <Navigate to="/login" replace/>;
    return children;
};

const AdminRoute = ({isLoggedIn, user, children}) => {
    if (!isLoggedIn) return <Navigate to="/login" replace/>;
    if (user?.role !== "admin") return <Navigate to="/home" replace/>;
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ✅ رجّع الحالة بعد refresh
    useEffect(() => {
        const saved = localStorage.getItem("auth_user");
        if (saved) {
            const u = JSON.parse(saved);
            setUser(u);
            setIsLoggedIn(true);
        }
    }, []);

    return (<>
            <Navbar user={user} isLoggedIn={isLoggedIn} setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>

            <div className="bg-gray-50 min-h-screen">
                <Routes>
                    <Route
                        path="/login"
                        element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>}
                    />
                    <Route path="/register" element={<Register/>}/>

                    <Route
                        path="/tournaments"
                        element={<ProtectedRoute isLoggedIn={isLoggedIn}>
                            <Tournaments/>
                        </ProtectedRoute>}
                    />

                    <Route
                        path="/stadiums"
                        element={<ProtectedRoute isLoggedIn={isLoggedIn}>
                            <Stadiums/>
                        </ProtectedRoute>}
                    />

                    <Route
                        path="/home"
                        element={
                            <Home isLoggedIn={isLoggedIn}/>}
                    />

                    <Route
                        path="/admin"
                        element={<AdminRoute isLoggedIn={isLoggedIn} user={user}>
                            <AdminDashboard/>
                        </AdminRoute>}
                    />

                    {/* default */}
                    <Route path="*" element={<Navigate to="/home" replace/>}/>
                </Routes>
            </div>
        </>);
}

export default App;
