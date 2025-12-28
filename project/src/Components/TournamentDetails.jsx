import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTrophy, 
  FaClock, FaInfoCircle, FaArrowLeft, FaShieldAlt, FaUserFriends 
} from 'react-icons/fa';

export default function TournamentDetails() {
  const { id } = useParams();

  // --- محاكاة البيانات بناءً على الـ Schema المرسلة ---
  // في الواقع ستأتي هذه البيانات من الـ Backend
  const tournamentData = {
    _id: "6678a1b2c3d4e5f6g7h8",
    title: "Summer Championship 2025",
    sportType: "Football",
    mode: "team", // "solo", "team", "both"
    startDate: "2025-06-15T09:00:00.000Z",
    endDate: "2025-07-20T18:00:00.000Z",
    status: "open", // "draft", "open", "ongoing", "finished"
    rules: "1. All teams must arrive 30 minutes before kick-off.\n2. Standard FIFA rules apply.\n3. Respect the referee at all times.\n4. Each team consists of 11 players + 5 substitutes.",
    maxParticipants: null, // null لأن المود هو team
    maxTeams: 16,
    participantsTeams: [1, 2, 3, 4, 5, 6, 7, 8], // محاكاة لـ Array of ObjectIds (8 فرق مسجلة)
    participantsUsers: [],
    createdByAdminId: { name: "Admin John" }, // محاكاة للـ Populate
    createdAt: "2025-01-01T10:00:00.000Z"
  };

  // --- دوال مساعدة للتنسيق ---

  // 1. حساب نسبة الاكتمال
  const currentCount = tournamentData.mode === 'team' 
    ? tournamentData.participantsTeams.length 
    : tournamentData.participantsUsers.length;
  
  const maxCount = tournamentData.mode === 'team' 
    ? tournamentData.maxTeams 
    : tournamentData.maxParticipants;

  const progressPercentage = Math.round((currentCount / maxCount) * 100);

  // 2. تنسيق التاريخ
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // 3. تحديد لون الحالة
  const getStatusStyle = (status) => {
    switch(status) {
      case 'open': return 'bg-green-100 text-green-700 border-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'finished': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pb-12">
      
      {/* --- Header / Breadcrumb --- */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/tournaments" className="inline-flex items-center text-gray-500 hover:text-blue-600 text-sm font-bold mb-4 transition-colors">
            <FaArrowLeft className="mr-2" /> BACK TO TOURNAMENTS
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyle(tournamentData.status)}`}>
                  {tournamentData.status}
                </span>
                <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                   {tournamentData.sportType} • {tournamentData.mode} MODE
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                {tournamentData.title}
              </h1>
            </div>

            {/* Admin Actions (If needed) */}
             {tournamentData.status === 'draft' && (
                <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition">
                    Edit Tournament
                </button>
             )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Main Info --- */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Banner Image */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-64 rounded-2xl flex items-center justify-center shadow-sm">
                <FaTrophy className="text-white opacity-20 text-9xl" />
            </div>

            {/* Description & Rules */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FaInfoCircle className="mr-2 text-blue-600" /> Tournament Rules
                </h2>
                <div className="prose text-gray-600 leading-relaxed whitespace-pre-line">
                    {tournamentData.rules || "No specific rules provided for this tournament."}
                </div>
            </div>

             {/* Schedule Mockup */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaClock className="mr-2 text-blue-600" /> Event Schedule
                </h2>
                <div className="border-l-2 border-blue-100 pl-6 space-y-6">
                    <div className="relative">
                        <span className="absolute -left-[31px] bg-blue-600 h-4 w-4 rounded-full border-4 border-white"></span>
                        <h4 className="font-bold text-gray-800">Start Date</h4>
                        <p className="text-gray-500 text-sm">{formatDate(tournamentData.startDate)}</p>
                    </div>
                    <div className="relative">
                        <span className="absolute -left-[31px] bg-green-500 h-4 w-4 rounded-full border-4 border-white"></span>
                        <h4 className="font-bold text-gray-800">End Date</h4>
                        <p className="text-gray-500 text-sm">{formatDate(tournamentData.endDate)}</p>
                    </div>
                </div>
            </div>

        </div>

        {/* --- Right Column: Sidebar Stats --- */}
        <div className="space-y-6">
            
            {/* Action Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="mb-6">
                    <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                        <span>
                            {tournamentData.mode === 'team' ? 'TEAMS REGISTERED' : 'PLAYERS REGISTERED'}
                        </span>
                        <span className="text-blue-600">{currentCount} / {maxCount}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {tournamentData.status === 'open' ? (
                     <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-blue-200 shadow-lg">
                        JOIN TOURNAMENT
                    </button>
                ) : (
                    <button disabled className="w-full bg-gray-200 text-gray-500 font-bold py-3.5 rounded-xl cursor-not-allowed">
                        REGISTRATION CLOSED
                    </button>
                )}

                <p className="text-center text-xs text-gray-400 mt-4">
                    By joining, you agree to the rules and terms.
                </p>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-md shadow-sm text-blue-600 mr-3">
                        <FaShieldAlt />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Game</p>
                        <p className="font-bold text-gray-800">{tournamentData.sportType}</p>
                    </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-md shadow-sm text-purple-600 mr-3">
                        <FaUserFriends />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Mode</p>
                        <p className="font-bold text-gray-800 capitalize">{tournamentData.mode}</p>
                    </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-md shadow-sm text-green-600 mr-3">
                        <FaCalendarAlt />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Duration</p>
                        <p className="font-bold text-gray-800">
                             {Math.ceil((new Date(tournamentData.endDate) - new Date(tournamentData.startDate)) / (1000 * 60 * 60 * 24))} Days
                        </p>
                    </div>
                </div>
            </div>

            {/* Organizer Info (Populated from createdByAdminId) */}
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                        A
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold">ORGANIZED BY</p>
                        <p className="text-sm font-bold text-gray-800">{tournamentData.createdByAdminId.name}</p>
                    </div>
                 </div>
            </div>

        </div>

      </div>
    </div>
  );
}
