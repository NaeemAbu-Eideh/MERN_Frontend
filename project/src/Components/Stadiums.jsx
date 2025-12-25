import React from 'react';
import {FaMapMarkerAlt, FaUsers, FaRegCalendarAlt} from 'react-icons/fa';

const stadiumsData = [
    {
        id: 1,
        name: "Central Stadium - Field A",
        location: "Downtown District",
        capacity: "5000 seats",
        bookings: "12 Active Bookings",
        status: "Available",
        facilities: "Locker Rooms, Medical, VIP, Press Box"
    },
    {
        id: 2,
        name: "North Arena Complex",
        location: "North Quarter",
        capacity: "8000 seats",
        bookings: "8 Active Bookings",
        status: "Available",
        facilities: "Full Amenities, Restaurant, Medical"
    }
];

export default function Stadiums() {
    return (
        <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-black mb-1 uppercase">Stadiums & Venues</h1>
                    <p className="text-gray-500 text-sm">Manage and book tournament venues</p>
                </div>
                <div className="flex gap-6 text-sm font-bold">
                    <button className="text-blue-600 border-b-2 border-blue-600 pb-1">LIST VIEW</button>
                    <button className="text-gray-400 hover:text-gray-600 pb-1">DETAILS VIEW</button>
                </div>
            </div>
            <div
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <select
                    className="w-full py-2.5 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white">
                    <option>LOCATION</option>
                    <option>Downtown</option>
                    <option>North Quarter</option>
                </select>
                <select
                    className="w-full py-2.5 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white">
                    <option>STATUS</option>
                    <option>Available</option>
                    <option>Booked</option>
                </select>
                <select
                    className="w-full py-2.5 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white">
                    <option>CAPACITY</option>
                    <option>5000+</option>
                    <option>10000+</option>
                </select>
                <select
                    className="w-full py-2.5 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white">
                    <option>FACILITIES</option>
                    <option>VIP</option>
                    <option>Medical</option>
                </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stadiumsData.map((stadium) => (
                    <div key={stadium.id}
                         className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">

                        <div className="h-48 bg-gray-100 flex items-center justify-center m-4 rounded-xl mb-0">
                            <span className="text-gray-300 font-bold text-sm tracking-widest">STADIUM</span>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-900">{stadium.name}</h3>
                                <span
                                    className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                        {stadium.status}
                    </span>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600 text-sm font-medium">
                                    <FaMapMarkerAlt className="mr-3 text-gray-400 text-lg"/>
                                    {stadium.location}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm font-medium">
                                    <FaUsers className="mr-3 text-gray-400 text-lg"/>
                                    {stadium.capacity}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm font-medium">
                                    <FaRegCalendarAlt className="mr-3 text-gray-400 text-lg"/>
                                    {stadium.bookings}
                                </div>
                            </div>
                            <hr className="border-gray-100 mb-4"/>
                            <div>
                                <span className="block text-xs text-gray-400 font-semibold mb-1">Facilities:</span>
                                <p className="text-sm text-gray-800 font-medium">{stadium.facilities}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}