import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaSave, FaTrash } from "react-icons/fa";

const API_BASE = "http://localhost:8008/api";

export default function AddStadium() {
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [mapLink, setMapLink] = useState("");
    const [capacity, setCapacity] = useState("");
    const [status, setStatus] = useState("available");

    const [facilityInput, setFacilityInput] = useState("");
    const [facilities, setFacilities] = useState([]);

    const addFacility = () => {
        const val = facilityInput.trim();
        if (!val) return;
        if (facilities.map((f) => f.toLowerCase()).includes(val.toLowerCase())) {
            setFacilityInput("");
            return;
        }
        setFacilities((prev) => [...prev, val]);
        setFacilityInput("");
    };

    const removeFacility = (idx) => {
        setFacilities((prev) => prev.filter((_, i) => i !== idx));
    };

    const validate = () => {
        if (!name.trim()) return "Stadium name is required.";
        if (capacity !== "" && Number(capacity) < 0) return "Capacity must be >= 0.";
        if (status !== "available" && status !== "unavailable") return "Invalid status.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        setSaving(true);
        setError("");

        try {
            const payload = {
                name: name.trim(),
                city: city.trim(),
                address: address.trim(),
                capacity: capacity === "" ? undefined : Number(capacity),
                facilities,
                status,
            };

            await axios.post(`${API_BASE}/createStadium`, payload);

            navigate("/admin");
        } catch (err) {
            console.log("Create stadium error:", err);
            console.log("Server details:", err?.response?.data);

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                (err?.response?.data?.errors ? "Validation error. Check fields." : "") ||
                "Failed to create stadium."
            );
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setName("");
        setCity("");
        setAddress("");
        setMapLink("");
        setCapacity("");
        setStatus("available");
        setFacilities([]);
        setFacilityInput("");
        setError("");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-8 max-w-3xl mx-auto font-sans text-gray-800">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-wide">
                            Add Stadium
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">Create a new stadium</p>
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
                                Name *
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                placeholder="e.g. Faisal Al-Husseini Stadium"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                    City
                                </label>
                                <input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                    placeholder="e.g. Al-Ram"
                                />
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
                                    <option value="available">available</option>
                                    <option value="unavailable">unavailable</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                Address
                            </label>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                placeholder="Street / Area"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                Capacity
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                placeholder="e.g. 12000"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold tracking-widest text-gray-500 uppercase mb-2">
                                Facilities
                            </label>

                            <div className="flex gap-3">
                                <input
                                    value={facilityInput}
                                    onChange={(e) => setFacilityInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addFacility();
                                        }
                                    }}
                                    className="flex-1 h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold"
                                    placeholder="e.g. Parking, VIP Seats..."
                                />
                                <button
                                    type="button"
                                    onClick={addFacility}
                                    className="h-12 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wide uppercase flex items-center gap-2 shadow-sm"
                                >
                                    <FaPlus />
                                    Add
                                </button>
                            </div>

                            {facilities.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {facilities.map((f, idx) => (
                                        <span
                                            key={`${f}-${idx}`}
                                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700"
                                        >
                      {f}
                                            <button
                                                type="button"
                                                onClick={() => removeFacility(idx)}
                                                className="text-gray-500 hover:text-red-600"
                                                title="Remove"
                                            >
                        <FaTrash className="text-xs" />
                      </button>
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between pt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="h-12 px-6 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 font-extrabold text-sm text-gray-700 tracking-wide uppercase flex items-center gap-2 justify-center"
                            >
                                Reset
                            </button>

                            <button
                                disabled={saving}
                                type="submit"
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold tracking-wide uppercase flex items-center gap-3 shadow-sm justify-center"
                            >
                                <FaSave />
                                {saving ? "Saving..." : "Create Stadium"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
