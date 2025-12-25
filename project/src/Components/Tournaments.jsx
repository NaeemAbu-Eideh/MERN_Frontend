import React from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight } from 'react-icons/fa';

// بيانات وهمية (Dummy Data) لمحاكاة البطاقات في الصورة
const tournamentsData = [
  {
    id: 1,
    category: "Football",
    title: "Summer Championship 2024",
    date: "Jun 15 - Jul 20, 2024",
    location: "Central Stadium",
    participants: "24 Participants",
    status: "Open",
    statusColor: "text-green-600 bg-green-50 border-green-200"
  },
  {
    id: 2,
    category: "Basketball",
    title: "Winter League Finals",
    date: "Dec 1 - Dec 15, 2024",
    location: "North Arena",
    participants: "16 Participants",
    status: "Starting Soon",
    statusColor: "text-green-600 bg-green-50 border-green-200"
  },
  {
    id: 3,
    category: "Tennis",
    title: "Spring Tournament Series",
    date: "Mar 10 - Apr 5, 2025",
    location: "East Complex",
    participants: "32 Participants",
    status: "Registration Open",
    statusColor: "text-green-600 bg-green-50 border-green-200"
  }
];

export default function Tournaments() {
  return (
    <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
      
      {/* --- Header Section --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-black mb-1">TOURNAMENTS</h1>
        <p className="text-gray-500 text-sm">Browse and join active tournaments</p>
      </div>

      {/* --- Filter Bar --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-6 items-center">
        {/* Search Input */}
        <div className="relative flex-grow w-full md:w-auto">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME" 
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-400"
          />
        </div>

        {/* Dropdowns */}
        <select className="w-full md:w-48 py-3 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white">
            <option>CATEGORY</option>
            <option>Football</option>
            <option>Basketball</option>
        </select>

        <select className="w-full md:w-48 py-3 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white">
            <option>STATUS</option>
            <option>Open</option>
            <option>Closed</option>
        </select>

        <select className="w-full md:w-48 py-3 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white">
            <option>LOCATION</option>
            <option>Cairo</option>
            <option>Giza</option>
        </select>

        {/* Filter Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-lg transition-colors">
            <FaFilter />
        </button>
      </div>

      {/* --- Sort & Count --- */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-500 text-sm">
            Showing <span className="font-bold text-gray-800">9</span> tournaments
        </div>
        <div className="w-64">
             <select className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white">
                <option>SORT BY</option>
                <option>Date</option>
                <option>Name</option>
            </select>
        </div>
      </div>

      {/* --- Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournamentsData.map((tournament) => (
          <div key={tournament.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            
            {/* Card Image Placeholder */}
            <div className="h-48 bg-gray-100 flex items-center justify-center m-4 rounded-xl">
                <span className="text-gray-400 font-bold text-sm tracking-wider">TOURNAMENT</span>
            </div>

            {/* Card Content */}
            <div className="px-5 pb-5 flex-grow flex flex-col">
                {/* Category Badge */}
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                    {tournament.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {tournament.title}
                </h3>

                {/* Details List */}
                <div className="space-y-2 mb-6 flex-grow">
                    <div className="flex items-center text-gray-500 text-sm">
                        <FaCalendarAlt className="mr-3 text-gray-400" />
                        {tournament.date}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <FaMapMarkerAlt className="mr-3 text-gray-400" />
                        {tournament.location}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <FaUsers className="mr-3 text-gray-400" />
                        {tournament.participants}
                    </div>
                </div>

                {/* Footer (Status & View) */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tournament.statusColor}`}>
                        {tournament.status}
                    </span>
                    
                    <button className="flex items-center text-gray-500 hover:text-blue-600 text-xs font-bold transition-colors">
                        VIEW <FaArrowRight className="ml-1" />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}