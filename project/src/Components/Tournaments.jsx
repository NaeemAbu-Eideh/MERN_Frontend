import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Tournaments() {


    const [tournamentsData, setTournamentsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    useEffect(() => {
        const getAllTournaments = async () => {
            const res = await axios.get("http://localhost:8008/api/tournaments");
            setTournamentsData(res.data);
            setCurrentPage(1);
        };
        getAllTournaments();
    }, []);

    const filteredTournaments = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return tournamentsData;

        return tournamentsData.filter((t) =>
            (t.title || "").toLowerCase().includes(q)
        );
    }, [tournamentsData, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ✅ derived pagination values from FILTERED list
    const totalPages = Math.max(Math.ceil(filteredTournaments.length / pageSize), 1);

    const paginatedTournaments = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTournaments.slice(start, start + pageSize);
    }, [filteredTournaments, currentPage]);

    const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

    const formatRange = (start, end) => {
        const opts = { year: "numeric", month: "short", day: "numeric" };
        const s = start ? new Date(start).toLocaleDateString("en-US", opts) : "";
        const e = end ? new Date(end).toLocaleDateString("en-US", opts) : "";
        return `${s} - ${e}`;
    };

    const getParticipantsText = (t) => {
        if (t.mode === "team") return `${(t.participantsTeams?.length || 0)} Teams`;
        return `${(t.participantsUsers?.length || 0)} Players`;
    };

    const statusClass = (status) => {
        switch (status) {
            case "open":
                return "text-green-700 bg-green-50 border-green-200";
            case "ongoing":
                return "text-blue-700 bg-blue-50 border-blue-200";
            case "finished":
                return "text-gray-600 bg-gray-50 border-gray-200";
            case "draft":
                return "text-yellow-700 bg-yellow-50 border-yellow-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-black mb-1">TOURNAMENTS</h1>
                <p className="text-gray-500 text-sm">Browse and join active tournaments</p>
            </div>

            {/* ✅ Search bar ONLY */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-6 items-center">
                <div className="relative flex-grow w-full">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="SEARCH BY NAME"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-400"
                    />
                </div>
            </div>

            {/* info */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-gray-500 text-sm">
                    Showing{" "}
                    <span className="font-bold text-gray-800">{paginatedTournaments.length}</span>{" "}
                    tournaments (Page{" "}
                    <span className="font-bold text-gray-800">{currentPage}</span> /{" "}
                    <span className="font-bold text-gray-800">{totalPages}</span>)
                </div>
            </div>

            {/* grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTournaments.map((tournament) => (
                    <div
                        key={tournament._id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                    >
                        <div className="h-48 bg-gray-100 flex items-center justify-center m-4 rounded-xl">
                            <span className="text-gray-400 font-bold text-sm tracking-wider">TOURNAMENT</span>
                        </div>

                        <div className="px-5 pb-5 flex-grow flex flex-col">
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                {tournament.sportType}
              </span>

                            <h3 className="text-lg font-bold text-gray-900 mb-4">{tournament.title}</h3>

                            <div className="space-y-2 mb-6 flex-grow">
                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaCalendarAlt className="mr-3 text-gray-400" />
                                    {formatRange(tournament.startDate, tournament.endDate)}
                                </div>

                                {/*<div className="flex items-center text-gray-500 text-sm">*/}
                                {/*    <FaMapMarkerAlt className="mr-3 text-gray-400" />*/}
                                {/*    —*/}
                                {/*</div>*/}

                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaUsers className="mr-3 text-gray-400" />
                                    {getParticipantsText(tournament)}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusClass(tournament.status)}`}>
                  {tournament.status}
                </span>

                                <Link
                                    to={`/tournaments/${tournament._id}`}
                                    className="flex items-center text-gray-500 hover:text-blue-600 text-xs font-bold transition-colors"
                                >
                                    VIEW <FaArrowRight className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* pagination */}
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
