// import React, { createContext, useContext, useEffect, useState } from "react";
//
// const AuthContext = createContext(null);
//
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//
//     // restore on refresh
//     useEffect(() => {
//         const stored = localStorage.getItem("auth_user");
//         if (stored) {
//             const parsed = JSON.parse(stored);
//             setUser(parsed);
//             setIsLoggedIn(true);
//         }
//     }, []);
//
//     const login = (userObj) => {
//         localStorage.setItem("auth_user", JSON.stringify(userObj));
//         setUser(userObj);
//         setIsLoggedIn(true);
//     };
//
//     const logout = () => {
//         localStorage.removeItem("auth_user");
//         setUser(null);
//         setIsLoggedIn(false);
//     };
//
//     return (
//         <AuthContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => useContext(AuthContext);
