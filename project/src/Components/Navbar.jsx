import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaTrophy,
    FaThLarge,
    FaMapMarkerAlt,
    FaCog,
    FaSignOutAlt,
    FaComments,
} from "react-icons/fa";

export default function Navbar({ isLoggedIn, setIsLoggedIn, setUser, user }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        if (stored) {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setUser?.(null);
        setIsLoggedIn?.(false);
        navigate("/login");
    };

    const isAdmin = isLoggedIn && user?.role === "admin";

    const isUserChatActive = location.pathname === "/chat";
    const isAdminInboxActive = location.pathname === "/admin/chats";

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <Link
                to="/home"
                className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
                <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                    <FaTrophy className="text-lg" />
                </div>
                <span className="text-xl font-extrabold text-blue-700 tracking-tight">
          La3eeb
        </span>
            </Link>

            <div className="flex items-center gap-2 md:gap-6">
                <NavItem
                    to="/home"
                    icon={<FaThLarge />}
                    text="HOME"
                    active={location.pathname === "/home"}
                />

                {isLoggedIn && (
                    <>
                        <NavItem
                            to="/tournaments"
                            icon={<FaTrophy />}
                            text="TOURNAMENTS"
                            active={location.pathname === "/tournaments"}
                        />
                        <NavItem
                            to="/stadiums"
                            icon={<FaMapMarkerAlt />}
                            text="STADIUMS"
                            active={location.pathname === "/stadiums"}
                        />

                        {!isAdmin && (
                            <NavItem
                                to="/chat"
                                icon={<FaComments />}
                                text="CHAT"
                                active={isUserChatActive}
                            />
                        )}

                        {isAdmin && (
                            <NavItem
                                to="/admin/chats"
                                icon={<FaComments />}
                                text="INBOX"
                                active={isAdminInboxActive}
                            />
                        )}

                        {isAdmin && (
                            <NavItem
                                to="/admin"
                                icon={<FaCog />}
                                text="ADMIN"
                                active={location.pathname === "/admin"}
                            />
                        )}
                    </>
                )}

                {!isLoggedIn ? (
                    <NavItem
                        to="/login"
                        icon={<FaSignOutAlt />}
                        text="LOGIN"
                        active={location.pathname === "/login"}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-bold text-sm tracking-wide text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
            <span className="text-lg mb-0.5">
              <FaSignOutAlt />
            </span>
                        <span>LOGOUT</span>
                    </button>
                )}
            </div>
        </nav>
    );
}

const NavItem = ({ to, icon, text, active }) => {
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-bold text-sm tracking-wide ${
                active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
        >
            <span className="text-lg mb-0.5">{icon}</span>
            <span>{text}</span>
        </Link>
    );
};
