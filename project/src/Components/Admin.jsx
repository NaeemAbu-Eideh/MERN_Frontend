import React, { useMemo, useState } from "react";
import {
    FaPlus,
    FaTrophy,
    FaRegCalendarAlt,
    FaMapMarkerAlt,
    FaUsers,
    FaClock,
    FaEdit,
    FaTrash,
    FaEye,
    FaCheckCircle,
} from "react-icons/fa";

const tournamentsSeed = [
    {
        id: 1,
        title: "Summer Championship 2024",
        startDate: "Jun 15, 2024",
        endDate: "Jul 20, 2024",
        participants: 24,
        status: "Active",
    },
    {
        id: 2,
        title: "Winter Cup 2024",
        startDate: "Dec 01, 2024",
        endDate: "Dec 28, 2024",
        participants: 132,
        status: "Draft",
    },
];

const matchesSeed = [
    { id: 1, name: "Match #01", tournament: "Summer Championship 2024", time: "18:00", status: "Scheduled" },
    { id: 2, name: "Match #02", tournament: "Winter Cup 2024", time: "20:30", status: "Scheduled" },
];

const stadiumsSeed = [
    { id: 1, name: "Central Stadium - Field A", location: "Downtown District", status: "Available" },
    { id: 2, name: "North Arena Complex", location: "North Quarter", status: "Available" },
];

const joinRequestsSeed = [
    { id: 1, user: "Ahmad Ali", tournament: "Winter Cup 2024", status: "Pending" },
    { id: 2, user: "Lina Naser", tournament: "Summer Championship 2024", status: "Pending" },
];

const StatCard = ({ value, label, icon: Icon }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
        <div>
            <div className="text-4xl font-extrabold text-black leading-none">{value}</div>
            <div className="mt-2 text-xs font-bold tracking-widest text-gray-400 uppercase">{label}</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
            <Icon className="text-xl" />
        </div>
    </div>
);

const TabButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-4 text-sm font-extrabold tracking-wide uppercase border-b-2 transition-colors ${
            active ? "text-blue-600 border-blue-600" : "text-gray-400 border-transparent hover:text-gray-600"
        }`}
        type="button"
    >
        {children}
    </button>
);

const Pill = ({ text }) => {
    const isActive = text.toLowerCase() === "active";
    const isPending = text.toLowerCase() === "pending";
    const isDraft = text.toLowerCase() === "draft";

    const cls = isActive
        ? "bg-green-50 text-green-600 border-green-200"
        : isPending
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : isDraft
                ? "bg-gray-50 text-gray-600 border-gray-200"
                : "bg-blue-50 text-blue-600 border-blue-200";

    return <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cls}`}>{text}</span>;
};

const ActionIconBtn = ({ onClick, title, children, danger }) => (
    <button
        onClick={onClick}
        title={title}
        type="button"
        className={`w-11 h-11 rounded-xl border transition-all flex items-center justify-center ${
            danger
                ? "border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600"
                : "border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-800"
        }`}
    >
        {children}
    </button>
);

const ActionPrimaryBtn = ({ onClick, children }) => (
    <button
        onClick={onClick}
        type="button"
        className="h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-extrabold text-sm text-gray-700 tracking-wide uppercase transition-all flex items-center gap-2"
    >
        {children}
    </button>
);

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("tournaments");

    const [tournaments, setTournaments] = useState(tournamentsSeed);
    const [matches] = useState(matchesSeed);
    const [stadiums] = useState(stadiumsSeed);
    const [joinRequests, setJoinRequests] = useState(joinRequestsSeed);

    const stats = useMemo(() => {
        const totalParticipants = tournaments.reduce((sum, t) => sum + (t.participants || 0), 0);
        return {
            tournaments: tournaments.length,
            matches: matches.length,
            stadiums: stadiums.length,
            pending: joinRequests.filter((r) => r.status === "Pending").length,
            participants: totalParticipants,
        };
    }, [tournaments, matches, stadiums, joinRequests]);

    const handleCreateNew = () => {
        alert("Create New (hook it to your modal/route)");
    };

    const handleAddTournament = () => {
        const nextId = Math.max(...tournaments.map((t) => t.id)) + 1;
        setTournaments((prev) => [
            ...prev,
            {
                id: nextId,
                title: `New Tournament #${nextId}`,
                startDate: "TBD",
                endDate: "TBD",
                participants: 0,
                status: "Draft",
            },
        ]);
        setActiveTab("tournaments");
    };

    const handleDeleteTournament = (id) => {
        setTournaments((prev) => prev.filter((t) => t.id !== id));
    };

    const handleApproveRequest = (id) => {
        setJoinRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* المحتوى (الـNavbar عندك برا) */}
            <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-5xl font-extrabold text-black uppercase tracking-wide">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-2">
                            Manage tournaments, matches, stadiums, and requests
                        </p>
                    </div>

                    <button
                        onClick={handleCreateNew}
                        type="button"
                        className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm"
                    >
                        <FaPlus />
                        Create New
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                    <StatCard value={stats.tournaments} label="Tournaments" icon={FaTrophy} />
                    <StatCard value={stats.matches} label="Matches" icon={FaRegCalendarAlt} />
                    <StatCard value={stats.stadiums} label="Stadiums" icon={FaMapMarkerAlt} />
                    <StatCard value={stats.pending} label="Pending Requests" icon={FaClock} />
                    <StatCard value={stats.participants} label="Total Participants" icon={FaUsers} />
                </div>

                {/* Tabs */}
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

                {/* Content */}
                {activeTab === "tournaments" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black">
                                Manage Tournaments
                            </h2>

                            <button
                                onClick={handleAddTournament}
                                type="button"
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm w-fit"
                            >
                                <FaPlus />
                                Add Tournament
                            </button>
                        </div>

                        <div className="space-y-4">
                            {tournaments.map((t) => (
                                <div
                                    key={t.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Placeholder icon */}
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400 font-extrabold text-lg">T</span>
                                        </div>

                                        <div>
                                            <div className="text-xl font-extrabold text-gray-900">{t.title}</div>
                                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500 font-semibold">
                        <span className="flex items-center gap-2">
                          <FaRegCalendarAlt className="text-gray-400" />
                            {t.startDate} - {t.endDate}
                        </span>
                                                <span className="flex items-center gap-2">
                          <FaUsers className="text-gray-400" />
                                                    {t.participants} Participants
                        </span>
                                                <Pill text={t.status} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 justify-end">
                                        <ActionIconBtn title="Edit" onClick={() => alert(`Edit tournament #${t.id}`)}>
                                            <FaEdit />
                                        </ActionIconBtn>

                                        <ActionPrimaryBtn onClick={() => alert(`View tournament #${t.id}`)}>
                                            <FaEye />
                                            View
                                        </ActionPrimaryBtn>

                                        <ActionIconBtn
                                            title="Delete"
                                            danger
                                            onClick={() => handleDeleteTournament(t.id)}
                                        >
                                            <FaTrash />
                                        </ActionIconBtn>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "matches" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black">Manage Matches</h2>
                            <button
                                type="button"
                                onClick={() => alert("Add Match")}
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm"
                            >
                                <FaPlus />
                                Add Match
                            </button>
                        </div>

                        <div className="space-y-4">
                            {matches.map((m) => (
                                <div
                                    key={m.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="text-lg font-extrabold text-gray-900">{m.name}</div>
                                        <div className="mt-1 text-sm text-gray-500 font-semibold">
                                            {m.tournament} • {m.time} • <span className="text-gray-700">{m.status}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 justify-end">
                                        <ActionIconBtn title="Edit" onClick={() => alert(`Edit match #${m.id}`)}>
                                            <FaEdit />
                                        </ActionIconBtn>
                                        <ActionPrimaryBtn onClick={() => alert(`View match #${m.id}`)}>
                                            <FaEye />
                                            View
                                        </ActionPrimaryBtn>
                                        <ActionIconBtn title="Delete" danger onClick={() => alert(`Delete match #${m.id}`)}>
                                            <FaTrash />
                                        </ActionIconBtn>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "stadiums" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black">Manage Stadiums</h2>
                            <button
                                type="button"
                                onClick={() => alert("Add Stadium")}
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm"
                            >
                                <FaPlus />
                                Add Stadium
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {stadiums.map((s) => (
                                <div
                                    key={s.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 flex items-start justify-between gap-4"
                                >
                                    <div>
                                        <div className="text-lg font-extrabold text-gray-900">{s.name}</div>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 font-semibold">
                                            <FaMapMarkerAlt className="text-gray-400" />
                                            {s.location}
                                        </div>
                                        <div className="mt-3">
                                            <Pill text={s.status} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <ActionIconBtn title="Edit" onClick={() => alert(`Edit stadium #${s.id}`)}>
                                            <FaEdit />
                                        </ActionIconBtn>
                                        <ActionIconBtn title="Delete" danger onClick={() => alert(`Delete stadium #${s.id}`)}>
                                            <FaTrash />
                                        </ActionIconBtn>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "requests" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black">
                                Join Requests
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {joinRequests.map((r) => (
                                <div
                                    key={r.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="text-lg font-extrabold text-gray-900">{r.user}</div>
                                        <div className="mt-1 text-sm text-gray-500 font-semibold">
                                            Requested to join: <span className="text-gray-800">{r.tournament}</span>
                                        </div>
                                        <div className="mt-3">
                                            <Pill text={r.status} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleApproveRequest(r.id)}
                                            className="h-11 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm tracking-wide uppercase flex items-center gap-2"
                                            disabled={r.status !== "Pending"}
                                        >
                                            <FaCheckCircle />
                                            Approve
                                        </button>

                                        <ActionIconBtn
                                            title="Delete"
                                            danger
                                            onClick={() => alert(`Reject/Delete request #${r.id}`)}
                                        >
                                            <FaTrash />
                                        </ActionIconBtn>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
