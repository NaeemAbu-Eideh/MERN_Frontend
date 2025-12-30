import React, {useEffect, useMemo, useState} from "react";
import {FaMapMarkerAlt, FaUsers, FaRegCalendarAlt, FaSearch} from "react-icons/fa";
import axios from "axios";

export default function Stadiums() {

    const [stadiumsData, setStadiumsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 2;
    useEffect(() => {
        const getAllStadiums = async () => {
            const res = await axios.get("http://localhost:8008/api/stadiums");
            setStadiumsData(res.data);
            setCurrentPage(1);
        };
        getAllStadiums();
    }, []);

    const filteredStadiums = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return stadiumsData;

        return stadiumsData.filter((s) => {
            const name = (s.name || "").toLowerCase();
            const city = (s.city || "").toLowerCase();
            return name.includes(q) || city.includes(q);
        });
    }, [stadiumsData, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.max(Math.ceil(filteredStadiums.length / pageSize), 1);

    const paginatedStadiums = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredStadiums.slice(start, start + pageSize);
    }, [filteredStadiums, currentPage]);

    const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

    const statusClass = (status) => {
        if (status === "available") return "bg-green-100 text-green-600 border-green-200";
        return "bg-gray-100 text-gray-600 border-gray-200";
    };

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-black mb-1 uppercase">Stadiums & Venues</h1>
                    <p className="text-gray-500 text-sm">Manage and book tournament venues</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 mb-8">
                <FaSearch className="text-gray-400"/>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="SEARCH BY STADIUM NAME OR CITY"
                    className="w-full py-2.5 px-2 focus:outline-none text-sm placeholder-gray-400"
                />
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="text-gray-500 text-sm">
                    Showing{" "}
                    <span className="font-bold text-gray-800">{paginatedStadiums.length}</span>{" "}
                    stadiums (Page{" "}
                    <span className="font-bold text-gray-800">{currentPage}</span> /{" "}
                    <span className="font-bold text-gray-800">{totalPages}</span>)
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paginatedStadiums.map((stadium) => (
                    <div
                        key={stadium._id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                        <div className="h-48 bg-gray-100 flex items-center justify-center m-4 rounded-xl mb-0">
                            <span className="text-gray-300 font-bold text-sm tracking-widest">STADIUM</span>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-900">{stadium.name}</h3>
                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full border ${statusClass(stadium.status)}`}>
                  {stadium.status}
                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600 text-sm font-medium">
                                    <FaMapMarkerAlt className="mr-3 text-gray-400 text-lg"/>
                                    {stadium.city || "—"}
                                </div>

                                <div className="flex items-center text-gray-600 text-sm font-medium">
                                    <FaUsers className="mr-3 text-gray-400 text-lg"/>
                                    {stadium.capacity ? `${stadium.capacity} seats` : "—"}
                                </div>

                                <div className="flex items-center text-gray-600 text-sm font-medium">
                                    <FaRegCalendarAlt className="mr-3 text-gray-400 text-lg"/>
                                    {/* ما عندك bookings بالـ schema، خليها placeholder */}
                                    0 Active Bookings
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-4"/>

                            <div>
                                <span className="block text-xs text-gray-400 font-semibold mb-1">Facilities:</span>
                                <p className="text-sm text-gray-800 font-medium">
                                    {stadium.facilities?.length ? stadium.facilities.join(", ") : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center gap-3 mt-8">
                <button
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-40"
                    disabled={currentPage === 1}
                    onClick={goPrev}
                >
                    Prev
                </button>

                <span className="text-sm text-gray-600 font-bold">
          {currentPage} / {totalPages}
        </span>

                <button
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-40"
                    disabled={currentPage === totalPages}
                    onClick={goNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
