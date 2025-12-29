import React, {useState} from "react";
import {FaUser} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

export default function Login({ setUser, setIsLoggedIn }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");

    const clearErrors = () => {
        setEmailErr("");
        setPasswordErr("");
    };

    const applyBackendErrors = (errorsObj = {}) => {
        clearErrors();
        if (errorsObj.email?.msg) setEmailErr(errorsObj.email.msg);
        if (errorsObj.password?.msg) setPasswordErr(errorsObj.password.msg);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        clearErrors();

        const user = {
            email: email.trim(),
            password,
        };

        try {
            const res = await axios.post("http://localhost:8008/api/login", user);
            console.log("LOGIN SUCCESS:", res.data);

            localStorage.setItem("auth_user", JSON.stringify(res.data.user));

            setUser(res.data.user);
            setIsLoggedIn(true);
            navigate(res.data.user.role === "admin" ? "/admin" : "/home");
            navigate("/home")
        } catch (err) {
            if (err.response.status === 422) {
                applyBackendErrors(err.response.data?.errors);
            }
            if (err.response.status === 401) {
                const msg = err.response.data?.message
                setPasswordErr(msg);
            }
        }
    };

    const inputBase =
        "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-300";
    const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500";
    const errText = "mt-2 text-xs font-bold text-red-500";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div
                className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full min-h-[600px]">
                <div className="w-full md:w-1/2 bg-[#F0F6FF] p-10 flex flex-col justify-center relative">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <FaUser className="text-white text-3xl"/>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2 leading-tight">TOURNAMENT<br/>ORGANIZER</h1>
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed mt-4">Manage tournaments, track participants, and coordinate events with real-time updates and AI-powered insights.</p>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Tournament management</h3>
                                <p className="text-sm text-gray-500">join and create tournament</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">AI-Powered Insights</h3>
                                <p className="text-sm text-gray-500">Smart analytics for tournament</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Stadium Management</h3>
                                <p className="text-sm text-gray-500">Coordinate venues and schedules efficiently</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 bg-white p-10 md:p-14 flex flex-col justify-center">
                    <div className="flex mb-8">
                        <button type="button" className="w-1/2 pb-2 text-center text-blue-600 font-bold border-b-2 border-blue-600">LOGIN</button>
                        <Link to="/register" className="w-1/2 pb-2 text-center text-gray-400 font-semibold border-b border-gray-200 hover:text-gray-600">REGISTER</Link>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Email</label>
                            <input value={email} onChange={(e) => {setEmail(e.target.value);if (emailErr) setEmailErr("");}} type="email" placeholder="your@email.com" className={`${inputBase} ${emailErr ? inputError : ""}`}/>
                            {emailErr && <p className={errText}>{emailErr}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Password</label>
                            <input value={password} onChange={(e) => {setPassword(e.target.value);if (passwordErr) setPasswordErr("");}} type="password" placeholder="••••••••" className={`${inputBase} ${passwordErr ? inputError : ""}`}/>
                            {passwordErr && <p className={errText}>{passwordErr}</p>}
                        </div>

                        <button
                            type="submit" className="w-full bg-[#1A5CFF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300 mb-6">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
