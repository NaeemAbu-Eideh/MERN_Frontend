import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrophy, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
// import axios from "axios";
import api from "./../contexts/axiosInstance.js"

export default function Home({ isLoggedIn }) {
    const [tournaments, setTournaments] = useState([]);
    const [stadiums, setStadiums] = useState([]);
    const [usersCount, setUsersCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tRes, sRes, uRes] = await Promise.all([
                    api.get("api/tournaments"),
                    api.get("api/stadiums"),
                    api.get("api/users/count"),
                ]);

                setTournaments(tRes.data || []);
                setStadiums(sRes.data || []);
                setUsersCount(uRes.data?.count || 0);
            } catch (err) {
                console.log(err);

                setTournaments((prev) => prev || []);
                setStadiums((prev) => prev || []);
                setUsersCount(0);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tRes, sRes, uRes] = await Promise.all([
                    api.get("api/tournaments"),
                    api.get("api/stadiums"),
                    api.get("api/users"),
                ]);

                setTournaments(tRes.data || []);
                setStadiums(sRes.data || []);
                setUsersCount(Array.isArray(uRes.data) ? uRes.data.length : 0);
            } catch (err) {
                console.log(err);
                setTournaments([]);
                setStadiums([]);
                setUsersCount(0);
            }
        };

        fetchData();
    }, []);


    const featuredTournaments = useMemo(() => {
        if (!tournaments.length) return [];
        const shuffled = [...tournaments].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }, [tournaments]);


    const formatRange = (start, end) => {
        const opts = { year: "numeric", month: "short", day: "numeric" };
        const s = start ? new Date(start).toLocaleDateString("en-US", opts) : "—";
        const e = end ? new Date(end).toLocaleDateString("en-US", opts) : "—";
        return `${s} - ${e}`;
    };

    const statusClass = (status) => {
        switch (status) {
            case "open":
                return "text-green-600 bg-green-50 border-green-200";
            case "ongoing":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "finished":
                return "text-gray-600 bg-gray-50 border-gray-200";
            case "draft":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const upcomingCount = tournaments.filter((t) => t.startDate && new Date(t.startDate) > new Date()).length;

    const stats = [
        { id: 1, label: "TOURNAMENTS", value: String(tournaments.length), icon: <FaTrophy />, color: "text-blue-600" },
        { id: 2, label: "USERS", value: String(usersCount), icon: <FaUsers />, color: "text-green-600" },
        { id: 3, label: "STADIUMS", value: String(stadiums.length), icon: <FaMapMarkerAlt />, color: "text-purple-600" },
        { id: 4, label: "UPCOMING EVENTS", value: String(upcomingCount), icon: <FaCalendarAlt />, color: "text-orange-500" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10 mb-8">
                <div className="w-full md:w-1/2 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight">
                        TOURNAMENT<br />MANAGEMENT SYSTEM
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Organize, manage, and participate in tournaments with ease. Real-time updates, AI-powered insights, and seamless coordination.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            to="/tournaments"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-200 transition-all"
                        >
                            BROWSE TOURNAMENTS
                        </Link>

                        {!isLoggedIn ? (
                            <Link
                                to="/login"
                                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-bold py-3 px-8 rounded-lg transition-all"
                            >
                                SIGN IN
                            </Link>
                        ) : null}
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-80 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200">
                    <img
                        alt="cover"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkcEMvifGRXnI85AnCJ5dQRKAIfiytz9ivjQ-xHWA4&s"
                        className="h-full w-full rounded-2xl object-cover"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
                    >
                        <div className={`text-4xl mb-4 ${stat.color}`}>{stat.icon}</div>
                        <h3 className={`text-3xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</h3>
                        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-800 uppercase">Featured Tournaments</h2>
                    <Link
                        to="/tournaments"
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        VIEW ALL
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredTournaments.map((t) => (
                        <div
                            key={t._id}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col p-5"
                        >
                            <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-5">
                                <span className="text-gray-400 font-bold text-xs tracking-wider">TOURNAMENT</span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-3">{t.title}</h3>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaCalendarAlt className="mr-2 text-blue-500" /> {formatRange(t.startDate, t.endDate)}
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaUsers className="mr-2 text-purple-500" />{" "}
                                    {t.mode === "team"
                                        ? `${t.participantsTeams?.length || 0} Teams`
                                        : `${t.participantsUsers?.length || 0} Players`}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusClass(t.status)}`}>
                  {t.status}
                </span>

                                <Link
                                    to={isLoggedIn ? `/tournaments/${t._id}` : "/login"}
                                    className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-bold uppercase"
                                >
                                    View Details <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
