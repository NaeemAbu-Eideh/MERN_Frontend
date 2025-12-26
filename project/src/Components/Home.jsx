import React from 'react';
import {Link} from 'react-router-dom';
import {FaTrophy, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaArrowRight} from 'react-icons/fa';

export default function Home({isLoggedIn}) {
    const stats = [
        {id: 1, label: "ACTIVE TOURNAMENTS", value: "156", icon: <FaTrophy/>, color: "text-blue-600"},
        {id: 2, label: "PARTICIPANTS", value: "2,847", icon: <FaUsers/>, color: "text-green-600"},
        {id: 3, label: "STADIUMS", value: "45", icon: <FaMapMarkerAlt/>, color: "text-purple-600"},
        {id: 4, label: "UPCOMING EVENTS", value: "89", icon: <FaCalendarAlt/>, color: "text-orange-500"},
    ];
    const featuredTournaments = [

        {
            id: 1,
            title: "Summer Championship 2024",
            date: "Jun 15 - Jul 20, 2024",
            location: "Central Stadium",
            participants: "24 Participants",
            status: "Open",
            statusClass: "text-green-600 bg-green-50 border-green-200"
        },
        {
            id: 2,
            title: "Winter League Finals",
            date: "Dec 1 - Dec 15, 2024",
            location: "North Arena",
            participants: "16 Participants",
            status: "Starting Soon",
            statusClass: "text-green-600 bg-green-50 border-green-200"
        },
        {
            id: 3,
            title: "Spring Tournament Series",
            date: "Mar 10 - Apr 5, 2025",
            location: "East Complex",
            participants: "32 Participants",
            status: "Registration Open",
            statusClass: "text-green-600 bg-green-50 border-green-200"
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
            <div
                className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10 mb-8">
                <div className="w-full md:w-1/2 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight">
                        TOURNAMENT<br/>MANAGEMENT SYSTEM
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Organize, manage, and participate in tournaments with ease. Real-time updates, AI-powered
                        insights, and seamless coordination.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link to="/tournaments"
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-200 transition-all">
                            BROWSE TOURNAMENTS
                        </Link>
                        {!isLoggedIn ? <Link to="/login"
                                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-bold py-3 px-8 rounded-lg transition-all">
                            SIGN IN
                        </Link>: <></>}
                    </div>
                </div>
                <div
                    className="w-full md:w-1/2 h-80 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200">
                    <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkcEMvifGRXnI85AnCJ5dQRKAIfiytz9ivjQ-xHWA4&s"} className={"h-full w-full rounded-2xl"}/>
                </div>
            </div>
            <div
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-10 items-center">
                <div className="relative flex-grow w-full">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400"/>
                    <input
                        type="text"
                        placeholder="SEARCH TOURNAMENTS BY NAME, LOCATION, OR DATE"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm tracking-wide"
                    />
                </div>
                <button
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                    SEARCH
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {stats.map((stat) => (
                    <div key={stat.id}
                         className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                        <div className={`text-4xl mb-4 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <h3 className={`text-3xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</h3>
                        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-800 uppercase">Featured Tournaments</h2>
                    <Link to="/tournaments"
                          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-bold py-2 px-6 rounded-lg transition-colors">
                        VIEW ALL
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredTournaments.map((tournament) => (
                        <div key={tournament.id}
                             className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col p-5">
                            <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-5">
                                <span className="text-gray-400 font-bold text-xs tracking-wider">TOURNAMENT</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{tournament.title}</h3>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaCalendarAlt className="mr-2 text-blue-500"/> {tournament.date}
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaMapMarkerAlt className="mr-2 text-green-500"/> {tournament.location}
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaUsers className="mr-2 text-purple-500"/> {tournament.participants}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tournament.statusClass}`}>
                            {tournament.status}
                        </span>
                                <button
                                    className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-bold uppercase">
                                    View Details <span className="ml-1">-</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}