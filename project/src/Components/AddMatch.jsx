// src/pages/admin/AddMatchPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaTrophy,
    FaUsers,
    FaMapMarkerAlt,
    FaClock,
    FaRegCalendarAlt,
    FaSave,
} from "react-icons/fa";
// import axios from "axios";
import api from "./../contexts/axiosInstance.js";

export default function AddMatchPage() {
    const navigate = useNavigate();

    const [tournaments, setTournaments] = useState([]);
    const [stadiums, setStadiums] = useState([]);
    const [loadingLists, setLoadingLists] = useState(true);

    const [selectedTournamentId, setSelectedTournamentId] = useState("");
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [teamsLoading, setTeamsLoading] = useState(false);
    const [joinedTeams, setJoinedTeams] = useState([]);

    const [teamAId, setTeamAId] = useState("");
    const [teamBId, setTeamBId] = useState("");
    const [stadiumId, setStadiumId] = useState("");

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [status, setStatus] = useState("scheduled");

    const [searchTeam, setSearchTeam] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formErr, setFormErr] = useState("");

    useEffect(() => {
        const fetchLists = async () => {
            setLoadingLists(true);
            try {
                const [tRes, sRes] = await Promise.allSettled([
                    api.get(`api/tournaments`),
                    api.get(`api/stadiums`),
                ]);

                const getData = (res) => res?.value?.data?.data ?? res?.value?.data ?? [];

                if (tRes.status === "fulfilled") setTournaments(getData(tRes));
                else console.log("tournaments fetch error:", tRes.reason);

                if (sRes.status === "fulfilled") setStadiums(getData(sRes));
                else console.log("stadiums fetch error:", sRes.reason);
            } catch (e) {
                console.log("fetchLists error:", e);
            } finally {
                setLoadingLists(false);
            }
        };

        fetchLists();
    }, []);

    const tournamentOptions = useMemo(() => [...tournaments], [tournaments]);
    const stadiumOptions = useMemo(() => [...stadiums], [stadiums]);

    const filteredTeams = useMemo(() => {
        const q = (searchTeam || "").toLowerCase().trim();
        if (!q) return joinedTeams;
        return joinedTeams.filter((t) => (t.name || "").toLowerCase().includes(q));
    }, [joinedTeams, searchTeam]);

    const teamAName = useMemo(
        () => joinedTeams.find((t) => t._id === teamAId)?.name || "Team A",
        [joinedTeams, teamAId]
    );

    const teamBName = useMemo(
        () => joinedTeams.find((t) => t._id === teamBId)?.name || "Team B",
        [joinedTeams, teamBId]
    );

    const isSoloTournament = (selectedTournament?.mode || "").toLowerCase() === "solo";
    const notEnoughTeams = selectedTournamentId && joinedTeams.length < 2;

    useEffect(() => {
        const fetchTournamentDetails = async () => {
            setSelectedTournament(null);
            setJoinedTeams([]);
            setTeamAId("");
            setTeamBId("");
            setFormErr("");

            if (!selectedTournamentId) return;

            setTeamsLoading(true);
            try {
                const res = await api.get(`api/tournaments/${selectedTournamentId}`);
                const t = res?.data?.data ?? res?.data;
                setSelectedTournament(t);

                const raw = Array.isArray(t?.participantsTeams) ? t.participantsTeams : [];
                const idsOnly = raw
                    .map((x) => (typeof x === "string" ? x : x?._id || x?.id))
                    .filter(Boolean);

                if (idsOnly.length === 0) {
                    setJoinedTeams([]);
                    return;
                }

                const requests = idsOnly.map((id) => api.get(`api/teams/${id}`));
                const results = await Promise.allSettled(requests);

                const teams = results
                    .filter((r) => r.status === "fulfilled")
                    .map((r) => r.value?.data?.data ?? r.value?.data)
                    .filter(Boolean)
                    .map((team) => ({ _id: team._id, name: team.name }))
                    .filter((x) => x._id && x.name);

                setJoinedTeams(teams);
            } catch (e) {
                console.log("Fetch tournament/teams error:", e?.response?.data || e);
                setFormErr("Failed to load tournament details / teams.");
            } finally {
                setTeamsLoading(false);
            }
        };

        fetchTournamentDetails();
    }, [selectedTournamentId]);

    const validate = () => {
        if (!selectedTournamentId) return "Please select a tournament.";
        if (isSoloTournament) return "This tournament is SOLO (cannot create team match).";
        if (joinedTeams.length < 2) return "Not enough joined teams (need at least 2).";

        if (!stadiumId) return "Please select a stadium (required).";

        if (!teamAId) return "Please select Team A.";
        if (!teamBId) return "Please select Team B.";
        if (teamAId === teamBId) return "Team A and Team B cannot be the same team.";

        if (!startDate) return "Please select Start Date.";
        if (!startTime) return "Please select Start Time.";
        if (!endDate) return "Please select End Date.";
        if (!endTime) return "Please select End Time.";

        const startISO = new Date(`${startDate}T${startTime}:00`).toISOString();
        const endISO = new Date(`${endDate}T${endTime}:00`).toISOString();

        const start = new Date(startISO).getTime();
        const end = new Date(endISO).getTime();

        if (Number.isNaN(start) || Number.isNaN(end)) return "Invalid start/end time.";
        if (end <= start) return "End time must be after start time.";

        return "";
    };


    const handleCreateMatch = async () => {
        const errMsg = validate();
        if (errMsg) {
            setFormErr(errMsg);
            return;
        }

        setSubmitLoading(true);
        setFormErr("");

        try {
            const startTimeISO = new Date(`${startDate}T${startTime}:00`).toISOString();
            const endTimeISO = new Date(`${endDate}T${endTime}:00`).toISOString();

            const payload = {
                tournamentId: selectedTournamentId,
                stadiumId,
                startTime: startTimeISO,
                endTime: endTimeISO,
                teamAId,
                teamBId,
                status,
            };

            await api.post(`api/creatematch`, payload);

            navigate("/admin");
        } catch (e) {
            console.log("Create match error:", e?.response?.data || e);
            setFormErr(e?.response?.data?.message || "Failed to create match.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-8 font-sans text-gray-800">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <Link
                            to="/admin"
                            className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-500 hover:text-blue-600"
                        >
                            <FaArrowLeft /> Back to Dashboard
                        </Link>

                        <h1 className="text-4xl font-extrabold text-black mt-3">Add Match</h1>
                        <p className="text-gray-500 text-sm mt-1">Create a match between two teams</p>
                    </div>

                    <button
                        onClick={() => navigate("/admin")}
                        type="button"
                        className="h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-extrabold text-sm text-gray-700 uppercase tracking-wide"
                    >
                        Cancel
                    </button>
                </div>

                {loadingLists ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 text-gray-500 font-bold">
                        Loading data...
                    </div>
                ) : (
                    <div className="space-y-6">

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FaTrophy className="text-gray-400" />
                                <h2 className="text-lg font-extrabold text-gray-900">Tournament</h2>
                            </div>

                            <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                Select Tournament
                            </label>
                            <select
                                value={selectedTournamentId}
                                onChange={(e) => setSelectedTournamentId(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800 bg-white"
                            >
                                <option value="">Select tournament...</option>
                                {tournamentOptions.map((t) => (
                                    <option key={t._id || t.id} value={t._id || t.id}>
                                        {t.title || "Untitled"} • {t.sportType || "Sport"} • {t.mode || "mode"}
                                    </option>
                                ))}
                            </select>

                            {selectedTournamentId && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <InfoPill icon={FaUsers} label="Joined Teams" value={joinedTeams.length} />
                                    <InfoPill icon={FaRegCalendarAlt} label="Start" value={fmtDate(selectedTournament?.startDate)} />
                                    <InfoPill icon={FaRegCalendarAlt} label="End" value={fmtDate(selectedTournament?.endDate)} />
                                    <InfoPill icon={FaClock} label="Status" value={selectedTournament?.status || "—"} />
                                </div>
                            )}

                            {selectedTournamentId && isSoloTournament && (
                                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-sm">
                                    ⚠ This tournament is SOLO.
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FaUsers className="text-gray-400" />
                                <h2 className="text-lg font-extrabold text-gray-900">Teams</h2>
                            </div>

                            {!selectedTournamentId ? (
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 font-bold">
                                    Select a tournament first.
                                </div>
                            ) : teamsLoading ? (
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 font-bold">
                                    Loading joined teams...
                                </div>
                            ) : notEnoughTeams ? (
                                <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 font-bold">
                                    Not enough joined teams to create a match (need at least 2).
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                            Search team (optional)
                                        </label>
                                        <input
                                            value={searchTeam}
                                            onChange={(e) => setSearchTeam(e.target.value)}
                                            placeholder="Search team name..."
                                            className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                                Team A
                                            </label>
                                            <select
                                                value={teamAId}
                                                onChange={(e) => setTeamAId(e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800 bg-white"
                                            >
                                                <option value="">Select team...</option>
                                                {filteredTeams.map((t) => (
                                                    <option key={t._id} value={t._id}>
                                                        {t.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                                Team B
                                            </label>
                                            <select
                                                value={teamBId}
                                                onChange={(e) => setTeamBId(e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800 bg-white"
                                            >
                                                <option value="">Select team...</option>
                                                {filteredTeams.map((t) => (
                                                    <option key={t._id} value={t._id}>
                                                        {t.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 rounded-2xl border border-gray-200 bg-gray-50">
                                        <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                            Preview
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <TeamBadge name={teamAName} />
                                            <div className="text-sm md:text-base font-extrabold text-gray-800">
                                                {teamAName} <span className="text-gray-400 mx-2">VS</span> {teamBName}
                                            </div>
                                            <TeamBadge name={teamBName} />
                                        </div>

                                        {teamAId && teamBId && teamAId === teamBId && (
                                            <div className="mt-3 text-sm font-bold text-red-600">
                                                Team A and Team B cannot be the same team.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FaClock className="text-gray-400" />
                                <h2 className="text-lg font-extrabold text-gray-900">Match Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                        Stadium (required)
                                    </label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select
                                            value={stadiumId}
                                            onChange={(e) => setStadiumId(e.target.value)}
                                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 font-bold text-gray-800 bg-white"
                                            disabled={!selectedTournamentId}
                                        >
                                            <option value="">Select stadium...</option>
                                            {stadiumOptions.map((s) => (
                                                <option key={s._id || s.id} value={s._id || s.id}>
                                                    {s.name || "Stadium"} • {s.location || ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800 bg-white"
                                        disabled={!selectedTournamentId}
                                    >
                                        <option value="scheduled">scheduled</option>
                                        <option value="live">live</option>
                                        <option value="finished">finished</option>
                                        <option value="cancelled">cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800"
                                        disabled={!selectedTournamentId}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800"
                                        disabled={!selectedTournamentId}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800"
                                        disabled={!selectedTournamentId}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 font-bold text-gray-800"
                                        disabled={!selectedTournamentId}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                {formErr ? (
                                    <div className="text-sm font-bold text-red-600">{formErr}</div>
                                ) : (
                                    <div className="text-sm font-bold text-gray-500">
                                        Fill required fields then create match.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleCreateMatch}
                                disabled={submitLoading}
                                type="button"
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm disabled:opacity-60"
                            >
                                <FaSave />
                                {submitLoading ? "Creating..." : "Create Match"}
                            </button>
                        </div>

                        {selectedTournamentId && joinedTeams.length === 0 && !teamsLoading ? (
                            <div className="text-xs text-gray-400 font-bold">
                                Hint: tournament has no <code>participantsTeams</code> IDs, or your teams endpoint is missing.
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}


function InfoPill({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                <Icon />
            </div>
            <div className="min-w-0">
                <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400">{label}</div>
                <div className="text-sm font-extrabold text-gray-800 truncate">{String(value ?? "—")}</div>
            </div>
        </div>
    );
}

function TeamBadge({ name }) {
    const letter = (name || "T").trim()[0]?.toUpperCase() || "T";
    return (
        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center font-extrabold text-gray-600">
            {letter}
        </div>
    );
}

function fmtDate(d) {
    if (!d) return "—";
    try {
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return String(d);
        return dt.toISOString().slice(0, 10);
    } catch {
        return String(d);
    }
}
