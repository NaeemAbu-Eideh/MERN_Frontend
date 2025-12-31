import React, {useEffect, useMemo, useState} from "react";
import {
    FaPlus, FaTrophy, FaRegCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaEdit, FaTrash, FaEye, FaCheckCircle,
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
// import axios from "axios";
import api from "../contexts/axiosInstance.js";

// const API_BASE = "http://localhost:8008/api";

const StatCard = ({value, label, icon: Icon}) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
        <div>
            <div className="text-4xl font-extrabold text-black leading-none">{value}</div>
            <div className="mt-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                {label}
            </div>
        </div>
        <div
            className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
            <Icon className="text-xl"/>
        </div>
    </div>);

const TabButton = ({active, children, onClick}) => (<button
        onClick={onClick}
        className={`px-6 py-4 text-sm font-extrabold tracking-wide uppercase border-b-2 transition-colors ${active ? "text-blue-600 border-blue-600" : "text-gray-400 border-transparent hover:text-gray-600"}`}
        type="button"
    >
        {children}
    </button>);

const Pill = ({text}) => {
    const val = (text || "").toLowerCase();
    const isActive = val === "active";
    const isPending = val === "pending";
    const isDraft = val === "draft";

    const cls = isActive ? "bg-green-50 text-green-600 border-green-200" : isPending ? "bg-yellow-50 text-yellow-700 border-yellow-200" : isDraft ? "bg-gray-50 text-gray-600 border-gray-200" : "bg-blue-50 text-blue-600 border-blue-200";

    return <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cls}`}>{text}</span>;
};

const ActionIconBtn = ({onClick, title, children, danger}) => (<button
        onClick={onClick}
        title={title}
        type="button"
        className={`w-11 h-11 rounded-xl border transition-all flex items-center justify-center ${danger ? "border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600" : "border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-800"}`}
    >
        {children}
    </button>);

const ActionPrimaryBtn = ({onClick, children}) => (<button
        onClick={onClick}
        type="button"
        className="h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-extrabold text-sm text-gray-700 tracking-wide uppercase transition-all flex items-center gap-2"
    >
        {children}
    </button>);

const Pagination = ({currentPage, totalPages, onPrev, onNext}) => (
    <div className="flex justify-center items-center gap-3 mt-8">
        <button
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={onPrev}
            type="button"
        >
            Prev
        </button>

        <span className="text-sm text-gray-600 font-bold">
      {currentPage} / {totalPages}
    </span>

        <button
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={onNext}
            type="button"
        >
            Next
        </button>
    </div>);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("tournaments");

    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [stadiums, setStadiums] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [teams, setTeams] = useState([]); // ✅ to map ids -> names (if matches not populated)

    const [tournamentsPage, setTournamentsPage] = useState(1);
    const [matchesPage, setMatchesPage] = useState(1);
    const [stadiumsPage, setStadiumsPage] = useState(1);
    const [requestsPage, setRequestsPage] = useState(1);

    const tournamentsPageSize = 5;
    const matchesPageSize = 5;
    const stadiumsPageSize = 6;
    const requestsPageSize = 5;

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const results = await Promise.allSettled([api.get(`api/tournaments`), api.get(`api/matches`), api.get(`api/stadiums`), api.get(`api/join-requests`), api.get(`api/teams`), // ✅ if you don't have this endpoint, remove this line + usage below
                ]);

                const getData = (res) => res?.value?.data?.data ?? res?.value?.data ?? [];

                if (results[0].status === "fulfilled") setTournaments(getData(results[0])); else console.log("tournaments fetch error:", results[0].reason);

                if (results[1].status === "fulfilled") setMatches(getData(results[1])); else console.log("matches fetch error:", results[1].reason);

                if (results[2].status === "fulfilled") setStadiums(getData(results[2])); else console.log("stadiums fetch error:", results[2].reason);

                if (results[3].status === "fulfilled") setJoinRequests(getData(results[3])); else console.log("join-requests fetch error:", results[3].reason);

                if (results[4].status === "fulfilled") setTeams(getData(results[4])); else console.log("teams fetch error:", results[4].reason);
            } catch (err) {
                console.log("Dashboard fetch error:", err);
            }
        };

        fetchAll();
    }, []);

    useEffect(() => {
        const checkStates = ()=>{
            if (activeTab === "tournaments") setTournamentsPage(1);
            if (activeTab === "matches") setMatchesPage(1);
            if (activeTab === "stadiums") setStadiumsPage(1);
            if (activeTab === "requests") setRequestsPage(1);
        }
        checkStates();
    }, [activeTab]);

    const stats = useMemo(() => {
        const totalParticipants = tournaments.reduce((sum, t) => {
            const count = Number(t.participants || 0) || (Array.isArray(t.participantsTeams) ? t.participantsTeams.length : 0) || (Array.isArray(t.participantsUsers) ? t.participantsUsers.length : 0) || 0;
            return sum + count;
        }, 0);

        return {
            tournaments: tournaments.length,
            matches: matches.length,
            stadiums: stadiums.length,
            pending: joinRequests.filter((r) => (r.status || "") === "Pending").length,
            participants: totalParticipants,
        };
    }, [tournaments, matches, stadiums, joinRequests]);

    const handleDeleteTournament = async (id) => {
        try {
            await api.delete(`api/tournaments/${id}`);
            setTournaments((prev) => prev.filter((t) => (t._id || t.id) !== id));
        } catch (err) {
            console.log("Delete tournament error:", err);
        }
    };

    const handleApproveRequest = async (id) => {
        try {
            await api.patch(`api/join-requests/${id}/approve`);
            setJoinRequests((prev) => prev.map((r) => ((r._id || r.id) === id ? {...r, status: "approved"} : r)));
        } catch (err) {
            console.log("Approve error:", err?.response?.data || err);
            alert(err?.response?.data?.message || "Approve failed");
        }
    };

    const handleRejectRequest = async (id) => {
        try {
            await api.patch(`api/join-requests/${id}/reject`);
            setJoinRequests((prev) => prev.map((r) => ((r._id || r.id) === id ? {...r, status: "rejected"} : r)));
        } catch (err) {
            console.log("Reject error:", err?.response?.data || err);
            alert(err?.response?.data?.message || "Reject failed");
        }
    };

    const tournamentsTotalPages = Math.max(Math.ceil(tournaments.length / tournamentsPageSize), 1);
    const matchesTotalPages = Math.max(Math.ceil(matches.length / matchesPageSize), 1);
    const stadiumsTotalPages = Math.max(Math.ceil(stadiums.length / stadiumsPageSize), 1);
    const requestsTotalPages = Math.max(Math.ceil(joinRequests.length / requestsPageSize), 1);

    const paginatedTournaments = useMemo(() => {
        const start = (tournamentsPage - 1) * tournamentsPageSize;
        return tournaments.slice(start, start + tournamentsPageSize);
    }, [tournaments, tournamentsPage]);

    const paginatedMatches = useMemo(() => {
        const start = (matchesPage - 1) * matchesPageSize;
        return matches.slice(start, start + matchesPageSize);
    }, [matches, matchesPage]);

    const paginatedStadiums = useMemo(() => {
        const start = (stadiumsPage - 1) * stadiumsPageSize;
        return stadiums.slice(start, start + stadiumsPageSize);
    }, [stadiums, stadiumsPage]);

    const paginatedRequests = useMemo(() => {
        const start = (requestsPage - 1) * requestsPageSize;
        return joinRequests.slice(start, start + requestsPageSize);
    }, [joinRequests, requestsPage]);

    const handleViewTournament = (id) => {
        navigate(`/tournaments/${id}`);
    };

    const tournamentTitleById = useMemo(() => {
        const map = new Map();
        tournaments.forEach((t) => map.set(String(t._id || t.id), t.title || "Untitled"));
        return map;
    }, [tournaments]);

    const teamNameById = useMemo(() => {
        const map = new Map();
        teams.forEach((tm) => map.set(String(tm._id || tm.id), tm.name || "Team"));
        return map;
    }, [teams]);

    const getTournamentTitle = (m) => {
        const tid = (typeof m.tournamentId === "string" ? m.tournamentId : m.tournamentId?._id) || m.tournamentId;
        if (!tid) return "Unknown Tournament";
        return tournamentTitleById.get(String(tid)) || m.tournamentId?.title || "Unknown Tournament";
    };

    const getTeamName = (m, which) => {
        const direct = which === "A" ? m.teamAId : m.teamBId;
        const directId = typeof direct === "string" ? direct : direct?._id;
        const directName = typeof direct === "object" ? direct?.name : null;

        if (directName) return directName;
        if (directId && teamNameById.has(String(directId))) return teamNameById.get(String(directId));

        const side = which === "A" ? m.sideA : m.sideB;
        const ref = side?.refId;
        const refId = typeof ref === "string" ? ref : ref?._id;
        const refName = typeof ref === "object" ? ref?.name : null;

        if (refName) return refName;
        if (refId && teamNameById.has(String(refId))) return teamNameById.get(String(refId));

        return which === "A" ? "Team A" : "Team B";
    };

    const fmtDateTime = (d) => {
        if (!d) return "—";
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return String(d);
        return dt.toISOString().slice(0, 16).replace("T", " ");
    };

    const deleteStadum = async(id) =>{
        try{
            await api.delete(`api/stadiums/${id}`);
            setStadiums((prev) => prev.filter((t) => (t._id || t.id) !== id));
        }catch(err){
            console.log(err);
        }
    }

    return (<div className="min-h-screen bg-gray-50">
            <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-5xl font-extrabold text-black uppercase tracking-wide">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">
                            Manage tournaments, matches, stadiums, and requests
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                    <StatCard value={stats.tournaments} label="Tournaments" icon={FaTrophy}/>
                    <StatCard value={stats.matches} label="Matches" icon={FaRegCalendarAlt}/>
                    <StatCard value={stats.stadiums} label="Stadiums" icon={FaMapMarkerAlt}/>
                    <StatCard value={stats.pending} label="Pending Requests" icon={FaClock}/>
                    <StatCard value={stats.participants} label="Total Participants" icon={FaUsers}/>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    <div className="flex flex-wrap">
                        <TabButton active={activeTab === "tournaments"} onClick={() => setActiveTab("tournaments")}>
                            Tournaments
                        </TabButton>
                        <TabButton active={activeTab === "matches"} onClick={() => setActiveTab("matches")}>
                            Matches
                        </TabButton>
                        <TabButton active={activeTab === "stadiums"} onClick={() => setActiveTab("stadiums")}>
                            Stadiums
                        </TabButton>
                        <TabButton active={activeTab === "requests"} onClick={() => setActiveTab("requests")}>
                            Join Requests
                        </TabButton>
                    </div>
                </div>

                {activeTab === "tournaments" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black">
                                Manage Tournaments
                            </h2>

                            <button
                                onClick={() => {
                                    navigate("/admin/tournaments/new");
                                    setActiveTab("tournaments");
                                }}
                                type="button"
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm w-fit"
                            >
                                <FaPlus/>
                                Add Tournament
                            </button>
                        </div>

                        <div className="space-y-4">
                            {paginatedTournaments.map((t) => (<div
                                    key={t._id || t.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                                >
                                    <div className="flex items-center gap-5">
                                        <div
                                            className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400 font-extrabold text-lg">T</span>
                                        </div>

                                        <div className="min-w-0">
                                            <div
                                                className="text-xl font-extrabold text-gray-900 truncate">{t.title}</div>
                                            <div
                                                className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500 font-semibold">
                        <span className="flex items-center gap-2">
                          <FaRegCalendarAlt className="text-gray-400"/>
                            {t.startDate} - {t.endDate}
                        </span>
                                                <span className="flex items-center gap-2">
                          <FaUsers className="text-gray-400"/>
                                                    {t.participants} Participants
                        </span>
                                                <Pill text={t.status}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 justify-end">
                                        <ActionIconBtn title="Edit"
                                                       onClick={() => navigate("/tournaments/" + t._id + "/edit")}>
                                            <FaEdit/>
                                        </ActionIconBtn>

                                        <ActionPrimaryBtn onClick={() => handleViewTournament(t._id)}>
                                            <FaEye/>
                                            View
                                        </ActionPrimaryBtn>

                                        <ActionIconBtn title="Delete" danger
                                                       onClick={() => handleDeleteTournament(t._id)}>
                                            <FaTrash/>
                                        </ActionIconBtn>
                                    </div>
                                </div>))}
                        </div>

                        <Pagination
                            currentPage={tournamentsPage}
                            totalPages={tournamentsTotalPages}
                            onPrev={() => setTournamentsPage((p) => Math.max(p - 1, 1))}
                            onNext={() => setTournamentsPage((p) => Math.min(p + 1, tournamentsTotalPages))}
                        />
                    </div>)}

                {activeTab === "matches" && (<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black">
                                Manage Matches
                            </h2>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/matches/new")}
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm"
                            >
                                <FaPlus/>
                                Add Match
                            </button>
                        </div>

                        <div className="space-y-4">
                            {paginatedMatches.map((m) => {
                                const teamA = getTeamName(m, "A");
                                const teamB = getTeamName(m, "B");
                                const tournamentTitle = getTournamentTitle(m);

                                return (<div
                                        key={m._id || m.id}
                                        className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0">
                                            <div className="text-lg font-extrabold text-gray-900 truncate">
                                                {teamA} <span className="text-gray-400 mx-2">VS</span> {teamB}
                                            </div>

                                            <div
                                                className="mt-1 text-sm text-gray-500 font-semibold flex flex-wrap gap-4">
                        <span className="flex items-center gap-2">
                          <FaTrophy className="text-gray-400"/>
                            {tournamentTitle}
                        </span>

                                                <span className="flex items-center gap-2">
                          <FaRegCalendarAlt className="text-gray-400"/>
                                                    {fmtDateTime(m.startTime)}
                                                </span>

                                                <span className="flex items-center gap-2">
                          <FaClock className="text-gray-400"/>
                                                    {String(m.status || "scheduled")}
                        </span>
                                            </div>
                                        </div>
                                    </div>);
                            })}
                        </div>

                        <Pagination
                            currentPage={matchesPage}
                            totalPages={matchesTotalPages}
                            onPrev={() => setMatchesPage((p) => Math.max(p - 1, 1))}
                            onNext={() => setMatchesPage((p) => Math.min(p + 1, matchesTotalPages))}
                        />
                    </div>)}

                {activeTab === "stadiums" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black">
                                Manage Stadiums
                            </h2>
                            <button
                                type="button"
                                onClick={() => navigate("/stadiums/new")}
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm"
                            >
                                <FaPlus/>
                                Add Stadium
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {paginatedStadiums.map((s) => (<div
                                    key={s._id || s.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 flex items-start justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <div className="text-lg font-extrabold text-gray-900 truncate">{s.name}</div>
                                        <div
                                            className="mt-2 flex items-center gap-2 text-sm text-gray-500 font-semibold">
                                            <FaMapMarkerAlt className="text-gray-400"/>
                                            {s.location}
                                        </div>
                                        <div className="mt-3">
                                            <Pill text={s.status}/>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <ActionIconBtn title="Edit"
                                                       onClick={() => navigate(`/admin/stadiums/${s._id || s.id}/edit`)}>
                                            <FaEdit/>
                                        </ActionIconBtn>
                                        <ActionIconBtn title="Delete" danger
                                                       onClick={() => deleteStadum(s._id || s.id)}>
                                            <FaTrash/>
                                        </ActionIconBtn>
                                    </div>
                                </div>))}
                        </div>

                        <Pagination
                            currentPage={stadiumsPage}
                            totalPages={stadiumsTotalPages}
                            onPrev={() => setStadiumsPage((p) => Math.max(p - 1, 1))}
                            onNext={() => setStadiumsPage((p) => Math.min(p + 1, stadiumsTotalPages))}
                        />
                    </div>)}

                {activeTab === "requests" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black">
                                Join Requests
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {paginatedRequests.map((r) => {
                                const userName = r.userId ? `${r.userId.firstName || ""} ${r.userId.lastName || ""}`.trim() : "Unknown User";

                                const tournamentTitle = r.tournamentId?.title || "Unknown Tournament";

                                const isPending = (r.status || "").toLowerCase() === "pending";
                                const isTeam = (r.requestType || "").toLowerCase() === "team";
                                const teamName = r.teamId?.name;

                                return (<div
                                        key={r._id || r.id}
                                        className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0">
                                            <div className="text-lg font-extrabold text-gray-900 truncate">
                                                {userName}
                                                {r.userId?.email ? (<span
                                                        className="ml-2 text-xs font-bold text-gray-400">({r.userId.email})</span>) : null}
                                            </div>

                                            <div className="mt-1 text-sm text-gray-500 font-semibold">
                                                Requested to join:{" "}
                                                <span className="text-gray-800 font-extrabold">{tournamentTitle}</span>
                                            </div>

                                            <div className="mt-1 text-xs text-gray-400 font-bold uppercase">
                                                Type: {r.requestType || "—"}
                                                {isTeam && teamName ? (
                                                    <span className="ml-2 normal-case text-gray-500 font-semibold">
                            • Team: <span className="text-gray-800 font-bold">{teamName}</span>
                          </span>) : null}
                                            </div>

                                            <div className="mt-3">
                                                <Pill text={r.status}/>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => handleApproveRequest(r._id || r.id)}
                                                disabled={!isPending}
                                                className="h-11 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm tracking-wide uppercase flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <FaCheckCircle/>
                                                Approve
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleRejectRequest(r._id || r.id)}
                                                disabled={!isPending}
                                                className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm tracking-wide uppercase flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <FaTrash/>
                                                Reject
                                            </button>
                                        </div>
                                    </div>);
                            })}
                        </div>

                        <Pagination
                            currentPage={requestsPage}
                            totalPages={requestsTotalPages}
                            onPrev={() => setRequestsPage((p) => Math.max(p - 1, 1))}
                            onNext={() => setRequestsPage((p) => Math.min(p + 1, requestsTotalPages))}
                        />
                    </div>)}
            </div>
        </div>);
}
