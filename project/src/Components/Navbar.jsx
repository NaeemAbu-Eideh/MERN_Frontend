import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTrophy, FaThLarge, FaMapMarkerAlt, FaRegUser, FaCog } from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation(); // لمعرفة المسار الحالي

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      
      {/* --- الشعار والاسم (يسار) --- */}
      <Link to="/home" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
           <FaTrophy className="text-lg" />
        </div>
        <span className="text-xl font-extrabold text-blue-700 tracking-tight">
            TOURNAMENT ORGANIZER
        </span>
      </Link>

      {/* --- روابط التنقل (يمين) --- */}
      <div className="flex items-center gap-2 md:gap-6">
        
        <NavItem to="/home" icon={<FaThLarge />} text="HOME" />
        
        {/* رابط البطولات (مميز كما في الصورة) */}
        {/* قمت بتعيين active={true} يدوياً ليظهر كما في الصورة، يمكنك إزالته ليعمل تلقائياً مع الراوتر */}
        <NavItem to="/tournaments" icon={<FaTrophy />} text="TOURNAMENTS" active={true} />
        
        <NavItem to="/stadiums" icon={<FaMapMarkerAlt />} text="STADIUMS" />
        <NavItem to="/dashboard" icon={<FaRegUser />} text="MY DASHBOARD" />
        <NavItem to="/admin" icon={<FaCog />} text="ADMIN" />
        
      </div>
    </nav>
  );
}

// مكون فرعي للأزرار لتقليل التكرار
const NavItem = ({ to, icon, text, active }) => {
    // إذا كان الزر نشطاً (active prop) أو إذا طابق مسار الصفحة الحالي
    // const isActive = active || location.pathname === to; 
    
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-bold text-sm tracking-wide ${
           active
            ? 'bg-blue-50 text-blue-600'  // ستايل العنصر النشط
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50' // ستايل العناصر العادية
        }`}
      >
        <span className="text-lg mb-0.5">{icon}</span>
        <span>{text}</span>
      </Link>
    );
};