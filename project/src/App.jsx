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
import {getUsers} from "./methods/functions/user_functions.jsx";

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
    const [check, setCheck] = useState("false");
    const [allUsers, setAllUsers] = useState([]);
    useEffect(() =>{
        const fetchData = async () => {
            const users = await getUsers();
            setAllUsers(users);
            await setCheck("false");
        }
        fetchData();
    }, [check])

    return (<>
            <Navbar user={user} isLoggedIn={isLoggedIn} setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>

            <div className="bg-gray-50 min-h-screen">
                <Routes>
                    <Route path="/login" element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/tournaments" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Tournaments/></ProtectedRoute>}/>
                    <Route path="/stadiums" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Stadiums/></ProtectedRoute>}/>
                    <Route path="/home" element={<Home isLoggedIn={isLoggedIn} allUsers={allUsers} />}/>
                    <Route path="/admin" element={<AdminRoute isLoggedIn={isLoggedIn} user={user}><AdminDashboard/></AdminRoute>}/>
                    <Route path="*" element={<Navigate to="/home" replace/>}/>
                    <Route path="/tournaments/:id" element={<TournamentDetails />} />
                </Routes>
            </div>
        </>);
}

export default App;
