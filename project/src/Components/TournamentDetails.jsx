import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaCalendarAlt,
    FaTrophy,
    FaClock,
    FaInfoCircle,
    FaArrowLeft,
    FaShieldAlt,
    FaUserFriends,
} from "react-icons/fa";
import axios from "axios";
import {sendPostToAi} from "../methods/functions/ai.jsx";

export default function TournamentDetails() {
    const { id } = useParams();
    const [aiData, setAiData] = useState("");
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);

    const authUser = JSON.parse(localStorage.getItem("auth_user") || "null");
    const isAdmin = authUser?.role === "admin";

    useEffect(() => {
        const getTournament = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8008/api/tournaments/${id}`);
                setTournament(res.data);
            } catch (err) {
                console.log(err);
                setTournament(null);
            } finally {
                setLoading(false);
            }
        };
        getTournament();
    }, [id]);

    const useAI = async () => {
        if (!tournament) return;

        setAiData("Generating summary...");
        const object = {
            rule: tournament.rules,
            startDate: tournament.startDate,
            endDate: tournament.endDate,
            sportType: tournament.sportType,
            mode: tournament.mode,
            duration: durationDays,
        };

        console.log("Sending to AI:", object);

        try {
            const data = await sendPostToAi(object);
            console.log("AI Response:", data);
            setAiData(data);
        } catch (error) {
            console.error("AI Error:", error);
            setAiData("Failed to generate description.");
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "open":
                return "bg-green-100 text-green-700 border-green-200";
            case "ongoing":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "finished":
                return "bg-gray-100 text-gray-600 border-gray-200";
            case "draft":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
                <p>Could not load tournament.</p>
                <Link to="/tournaments" className="text-blue-600 font-bold">
                    Back
                </Link>
            </div>
        );
    }

    const currentCount =
        tournament.mode === "team"
            ? tournament.participantsTeams?.length || 0
            : tournament.participantsUsers?.length || 0;

    const maxCount =
        tournament.mode === "team" ? tournament.maxTeams : tournament.maxParticipants;

    const progressPercentage =
        maxCount && maxCount > 0 ? Math.round((currentCount / maxCount) * 100) : 0;

    const durationDays =
        tournament.startDate && tournament.endDate
            ? Math.ceil(
                (new Date(tournament.endDate) - new Date(tournament.startDate)) /
                (1000 * 60 * 60 * 24)
            )
            : 0;

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans pb-12">
            <div className="bg-white border-b border-gray-200 px-6 py-6 mb-8">
                <div className="max-w-7xl mx-auto">
                    <Link
                        to="/tournaments"
                        className="inline-flex items-center text-gray-500 hover:text-blue-600 text-sm font-bold mb-4 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> BACK TO TOURNAMENTS
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyle(
                        tournament.status
                    )}`}
                >
                  {tournament.status}
                </span>
                                <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                  {tournament.sportType} • {tournament.mode} MODE
                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                                {tournament.title}
                            </h1>
                        </div>

                        {/* ✅ Show Edit button ONLY for admin users */}
                        {isAdmin && (
                            <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition">
                                Edit Tournament
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-64 rounded-2xl flex items-center justify-center shadow-sm">
                        <FaTrophy className="text-white opacity-20 text-9xl" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <FaInfoCircle className="mr-2 text-blue-600" /> Tournament Rules
                        </h2>
                        <div className="prose text-gray-600 leading-relaxed whitespace-pre-line">
                            {tournament.rules || "No specific rules provided for this tournament."}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <FaClock className="mr-2 text-blue-600" /> Event Schedule
                        </h2>
                        <div className="border-l-2 border-blue-100 pl-6 space-y-6">
                            <div className="relative">
                                <span className="absolute -left-[31px] bg-blue-600 h-4 w-4 rounded-full border-4 border-white"></span>
                                <h4 className="font-bold text-gray-800">Start Date</h4>
                                <p className="text-gray-500 text-sm">{formatDate(tournament.startDate)}</p>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-[31px] bg-green-500 h-4 w-4 rounded-full border-4 border-white"></span>
                                <h4 className="font-bold text-gray-800">End Date</h4>
                                <p className="text-gray-500 text-sm">{formatDate(tournament.endDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="mb-6">
                            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                <span>
                  {tournament.mode === "team" ? "TEAMS REGISTERED" : "PLAYERS REGISTERED"}
                </span>
                                <span className="text-blue-600">
                  {currentCount} / {maxCount ?? "—"}
                </span>
                            </div>

                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {tournament.status === "open" ? (
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-blue-200 shadow-lg">
                                JOIN TOURNAMENT
                            </button>
                        ) : (
                            <button
                                disabled
                                className="w-full bg-gray-200 text-gray-500 font-bold py-3.5 rounded-xl cursor-not-allowed"
                            >
                                REGISTRATION CLOSED
                            </button>
                        )}

                        <p className="text-center text-xs text-gray-400 mt-4">
                            By joining, you agree to the rules and terms.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="bg-white p-2 rounded-md shadow-sm text-blue-600 mr-3">
                                <FaShieldAlt />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Game</p>
                                <p className="font-bold text-gray-800">{tournament.sportType}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="bg-white p-2 rounded-md shadow-sm text-purple-600 mr-3">
                                <FaUserFriends />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Mode</p>
                                <p className="font-bold text-gray-800 capitalize">{tournament.mode}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="bg-white p-2 rounded-md shadow-sm text-green-600 mr-3">
                                <FaCalendarAlt />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Duration</p>
                                <p className="font-bold text-gray-800">{durationDays} Days</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                {tournament.createdByAdminId?.firstName?.[0] || "A"}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold">ORGANIZED BY</p>
                                <p className="text-sm font-bold text-gray-800">
                                    {tournament.createdByAdminId?.firstName}{" "}
                                    {tournament.createdByAdminId?.lastName}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className={"border"} onClick={useAI}>click to integration with api</button>
        </div>
    );
}
