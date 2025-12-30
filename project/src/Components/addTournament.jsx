import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddTournament() {
    const navigate = useNavigate();

    const authUser = JSON.parse(localStorage.getItem("auth_user") || "null");

    const [form, setForm] = useState({
        title: "",
        sportType: "",
        mode: "team",
        startDate: "",
        endDate: "",
        status: "draft",
        rules: "",
        maxTeams: 16,
        maxParticipants: 32,
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            const payload = {
                title: form.title.trim(),
                sportType: form.sportType.trim(),
                mode: form.mode,
                startDate: form.startDate,
                endDate: form.endDate,
                status: form.status,
                rules: form.rules,
                createdByAdminId: authUser?._id,
                // حسب المود
                maxTeams: form.mode === "team" ? Number(form.maxTeams) : null,
                maxParticipants: form.mode === "solo" ? Number(form.maxParticipants) : null,
                participantsTeams: [],
                participantsUsers: [],
            };

            const res = await axios.post("http://localhost:8008/api/createTournament", payload);

            navigate(`/tournaments/${res.data._id}`);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data?.errors || {});
            } else {
                console.log(err);
                alert("Server error while creating tournament.");
            }
        } finally {
            setSaving(false);
        }
    };

    const input =
        "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500";
    const errText = "mt-2 text-xs font-bold text-red-500";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-8 max-w-4xl mx-auto font-sans text-gray-800">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-black uppercase">Add Tournament</h1>
                        <p className="text-gray-500 text-sm mt-2">Create a new tournament (admin only)</p>
                    </div>

                    <Link
                        to="/admin"
                        className="h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-extrabold text-sm text-gray-700 tracking-wide uppercase flex items-center"
                    >
                        Back
                    </Link>
                </div>

                <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Title</label>
                        <input name="title" value={form.title} onChange={onChange} className={input} placeholder="Tournament title" />
                        {errors.title?.msg && <p className={errText}>{errors.title.msg}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Sport Type</label>
                        <input
                            name="sportType"
                            value={form.sportType}
                            onChange={onChange}
                            className={input}
                            placeholder="Football, Basketball..."
                        />
                        {errors.sportType?.msg && <p className={errText}>{errors.sportType.msg}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Mode</label>
                            <select name="mode" value={form.mode} onChange={onChange} className={input}>
                                <option value="team">team</option>
                                <option value="solo">solo</option>
                                <option value="both">both</option>
                            </select>
                            {errors.mode?.msg && <p className={errText}>{errors.mode.msg}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Status</label>
                            <select name="status" value={form.status} onChange={onChange} className={input}>
                                <option value="draft">draft</option>
                                <option value="open">open</option>
                                <option value="ongoing">ongoing</option>
                                <option value="finished">finished</option>
                            </select>
                            {errors.status?.msg && <p className={errText}>{errors.status.msg}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Start Date</label>
                            <input type="date" name="startDate" value={form.startDate} onChange={onChange} className={input} />
                            {errors.startDate?.msg && <p className={errText}>{errors.startDate.msg}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">End Date</label>
                            <input type="date" name="endDate" value={form.endDate} onChange={onChange} className={input} />
                            {errors.endDate?.msg && <p className={errText}>{errors.endDate.msg}</p>}
                        </div>
                    </div>

                    {form.mode === "team" && (
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Max Teams</label>
                            <input type="number" name="maxTeams" value={form.maxTeams} onChange={onChange} className={input} />
                            {errors.maxTeams?.msg && <p className={errText}>{errors.maxTeams.msg}</p>}
                        </div>
                    )}

                    {form.mode === "solo" && (
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Max Participants</label>
                            <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={onChange} className={input} />
                            {errors.maxParticipants?.msg && <p className={errText}>{errors.maxParticipants.msg}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Rules</label>
                        <textarea
                            name="rules"
                            value={form.rules}
                            onChange={onChange}
                            rows={5}
                            className={input}
                            placeholder="Write tournament rules..."
                        />
                        {errors.rules?.msg && <p className={errText}>{errors.rules.msg}</p>}
                    </div>

                    <button
                        disabled={saving}
                        type="submit"
                        className={`h-12 px-7 rounded-2xl font-extrabold tracking-wide uppercase text-white ${
                            saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {saving ? "Creating..." : "Create Tournament"}
                    </button>
                </form>
            </div>
        </div>
    );
}
