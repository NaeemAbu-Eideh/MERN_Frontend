import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const API_BASE = "http://localhost:8008/api";

const toDateInput = (value) => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

export default function EditTournament() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [sportType, setSportType] = useState("");
    const [mode, setMode] = useState("solo");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("draft");
    const [rules, setRules] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [maxTeams, setMaxTeams] = useState("");
    const [createdByAdminId, setCreatedByAdminId] = useState("");

    useEffect(() => {
        const fetchTournament = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(`${API_BASE}/tournaments/${id}`);
                const t = res?.data?.data ?? res?.data ?? {};

                setTitle(t.title ?? "");
                setSportType(t.sportType ?? "");
                setMode(t.mode ?? "solo");
                setStartDate(toDateInput(t.startDate));
                setEndDate(toDateInput(t.endDate));
                setStatus(t.status ?? "draft");
                setRules(t.rules ?? "");
                setMaxParticipants(t.maxParticipants != null ? String(t.maxParticipants) : "");
                setMaxTeams(t.maxTeams != null ? String(t.maxTeams) : "");
                setCreatedByAdminId(t.createdByAdminId?._id || t.createdByAdminId || "");
            } catch (err) {
                console.log("Fetch tournament error:", err);
                setError("Failed to load tournament. Check API route or ID.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTournament();
    }, [id]);

    const validate = () => {
        if (!title.trim()) return "Title is required.";
        if (!sportType.trim()) return "Sport Type is required.";
        if (!startDate) return "Start date is required.";
        if (!endDate) return "End date is required.";
        if (startDate && endDate && startDate > endDate) return "Start date must be before end date.";

        if (maxParticipants !== "" && Number(maxParticipants) < 0) return "Max participants must be >= 0.";
        if (maxTeams !== "" && Number(maxTeams) < 0) return "Max teams must be >= 0.";

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        if (!createdByAdminId) {
            setError("createdByAdminId is missing. Make sure GET /tournaments/:id returns it.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const payload = {
                title: title.trim(),
                sportType: sportType.trim(),
                mode,
                startDate,
                endDate,
                status,
                rules: rules.trim(),
                maxParticipants: maxParticipants === "" ? null : Number(maxParticipants),
                maxTeams: maxTeams === "" ? null : Number(maxTeams),

                createdByAdminId,

                participantsUsers: [],
                participantsTeams: [],
            };

            await axios.put(`${API_BASE}/tournaments/${id}`, payload);

            navigate(`/tournaments/${id}`);
        } catch (err) {
            console.log("Update tournament error:", err);
            console.log("Server details:", err?.response?.data);
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to save changes (PUT)."
            );
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <div className="text-lg font-extrabold text-gray-900">Loading...</div>
                    <div className="text-sm text-gray-500 mt-2">Fetching tournament data</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-8 max-w-3xl mx-auto font-sans text-gray-800">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-wide">
                            Edit Tournament
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">Update tournament details</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="h-12 px-5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 font-extrabold text-sm text-gray-700 tracking-wide uppercase flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        Back
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                Title
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                placeholder="Tournament title"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                Sport Type
                            </label>
                            <input
                                value={sportType}
                                onChange={(e) => setSportType(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                placeholder="e.g. Football, Basketball..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                    Mode
                                </label>
                                <select
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold bg-white"
                                >
                                    <option value="solo">solo</option>
                                    <option value="team">team</option>
                                    <option value="both">both</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold bg-white"
                                >
                                    <option value="draft">draft</option>
                                    <option value="open">open</option>
                                    <option value="ongoing">ongoing</option>
                                    <option value="finished">finished</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                    Max Participants (optional)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={maxParticipants}
                                    onChange={(e) => setMaxParticipants(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                    placeholder="e.g. 32"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                    Max Teams (optional)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={maxTeams}
                                    onChange={(e) => setMaxTeams(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                    placeholder="e.g. 16"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                Rules (optional)
                            </label>
                            <textarea
                                value={rules}
                                onChange={(e) => setRules(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                placeholder="Write tournament rules..."
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                disabled={saving}
                                type="submit"
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm"
                            >
                                <FaSave />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
