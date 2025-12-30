import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaTrophy,
    FaClock,
    FaInfoCircle,
    FaArrowLeft,
    FaShieldAlt,
    FaUserFriends,
    FaRobot,
    FaTimes,
    FaCopy,
} from "react-icons/fa";
import axios from "axios";
import {sendPostToAi} from "../methods/functions/ai.jsx";

export default function TournamentDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [joinLoading, setJoinLoading] = useState(false);
    const [joinMsg, setJoinMsg] = useState("");

    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ AI Summary states
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryText, setSummaryText] = useState("");
    const [summaryErr, setSummaryErr] = useState("");

    // ✅ Get logged-in user from localStorage (same place you stored it after login)
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

    const handleJoinRequest = async () => {
        if (!authUser?._id) {
            setJoinMsg("Please login first.");
            return;
        }

        if (!tournament) return;

        if (tournament.status !== "open") {
            setJoinMsg("Registration is closed.");
            return;
        }

        setJoinLoading(true);
        setJoinMsg("");

        try {
            let requestType = "solo";
            let teamId = null;

            // ✅ إذا mode team أو both: جيب teams تبعون اليوزر
            if (tournament.mode === "team" || tournament.mode === "both") {
                const teamsRes = await axios.get(
                    `http://localhost:8008/api/my-teams/${authUser._id}`
                );
                const myTeams = teamsRes?.data?.data ?? teamsRes?.data ?? [];

                if (Array.isArray(myTeams) && myTeams.length > 0) {
                    teamId = myTeams[0]._id;
                }

                if (tournament.mode === "team" && !teamId) {
                    setJoinMsg("You must have a team to join this tournament.");
                    return;
                }

                if (tournament.mode === "both" && teamId) {
                    requestType = "team";
                }
            }

            if (tournament.mode === "team") {
                requestType = "team";
            }

            const payload = {
                tournamentId: tournament._id || id,
                requestType,
                userId: authUser._id,
                ...(requestType === "team" ? { teamId } : {}),
            };

            await axios.post("http://localhost:8008/api/createjoin", payload);

            setJoinMsg("✅ Join request sent! (pending)");
        } catch (err) {
            console.log("Join request error:", err?.response?.data || err);
            setJoinMsg(err?.response?.data?.message || "❌ Failed to send join request.");
        } finally {
            setJoinLoading(false);
        }
    };

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

    // ✅ AI Summary handler
    const handleOpenSummary = async () => {
        if (!tournament) return;

        setSummaryOpen(true);
        setSummaryErr("");

        // لو في نص موجود، ما تعيد توليده (اختياري)
        if (summaryText) return;

        setSummaryLoading(true);
        setSummaryText("");

        try {
            const object = {
                rule: tournament.rules,
                startDate: tournament.startDate,
                endDate: tournament.endDate,
                sportType: tournament.sportType,
                mode: tournament.mode,
                duration: durationDays,
            };

            const res = await axios.post('http://localhost:8008/api/ai/chat', object);

            const text = res?.data?.text || "";
            if (!text) throw new Error("Empty summary response");

            setSummaryText(text);
        } catch (err) {
            console.log("AI summary error:", err?.response?.data || err);
            setSummaryErr(err?.response?.data?.error || err?.message || "Failed to generate summary.");
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleCopySummary = async () => {
        try {
            if (!summaryText) return;
            await navigator.clipboard.writeText(summaryText);
        } catch (e) {
            console.log(e);
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

                        {isAdmin && (
                            <button
                                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition"
                                onClick={() => {
                                    navigate("/tournaments/" + id + "/edit");
                                }}
                            >
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
                            <button
                                onClick={handleJoinRequest}
                                disabled={joinLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-blue-200 shadow-lg disabled:opacity-50"
                            >
                                {joinLoading ? "SENDING..." : "JOIN TOURNAMENT"}
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

                        {joinMsg && (
                            <p className="text-center text-sm font-bold mt-3 text-gray-700">{joinMsg}</p>
                        )}
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

                    {/* ORGANIZED BY CARD */}
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

                    {/* ✅ BUTTON UNDER ORGANIZED BY */}
                    <button
                        onClick={handleOpenSummary}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition"
                    >
                        <FaRobot /> Generate Summary
                    </button>
                </div>
            </div>

            {/* ✅ SUMMARY MODAL */}
            {summaryOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setSummaryOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                <FaRobot className="text-gray-800" /> Tournament Summary
                            </h3>
                            <button
                                onClick={() => setSummaryOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                aria-label="Close"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {summaryLoading ? (
                            <div className="text-gray-500 font-bold">Generating...</div>
                        ) : summaryErr ? (
                            <div className="text-red-600 font-bold text-sm">{summaryErr}</div>
                        ) : (
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {summaryText || "No summary yet."}
                            </div>
                        )}

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setSummaryOpen(false)}
                                className="px-4 py-2 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-800"
                            >
                                Close
                            </button>

                            <button
                                onClick={handleCopySummary}
                                disabled={!summaryText}
                                className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex items-center gap-2"
                            >
                                <FaCopy /> Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
