import React, {useEffect, useState} from "react";
import { FaUser } from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Register = () => {

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstNameErr, setFirstNameErr] = useState("");
    const [lastNameErr, setLastNameErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [confirmPasswordErr, setConfirmPasswordErr] = useState("");

    const clearErrors = () => {
        setFirstNameErr("");
        setLastNameErr("");
        setEmailErr("");
        setPasswordErr("");
        setConfirmPasswordErr("");
    };

    const applyBackendErrors = (errors = {}) => {
        clearErrors();

        if (errors.firstName?.msg) setFirstNameErr(errors.firstName.msg);
        if (errors.lastName?.msg) setLastNameErr(errors.lastName.msg);
        if (errors.email?.msg) setEmailErr(errors.email.msg);
        if (errors.password?.msg) setPasswordErr(errors.password.msg);
        if (errors.confirmPassword?.msg) setConfirmPasswordErr(errors.confirmPassword.msg);
    };

    const validate = () => {
        let ok = true;

        clearErrors();

        const f = firstName.trim();
        const l = lastName.trim();
        const e = email.trim();

        if (!f) {
            setFirstNameErr("First name is required.");
            ok = false;
        } else if (f.length < 3) {
            setFirstNameErr("First name must be at least 3 characters.");
            ok = false;
        }

        if (!l) {
            setLastNameErr("Last name is required.");
            ok = false;
        } else if (l.length < 3) {
            setLastNameErr("Last name must be at least 3 characters.");
            ok = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!e) {
            setEmailErr("Email is required.");
            ok = false;
        } else if (!emailRegex.test(e)) {
            setEmailErr("Please enter a valid email.");
            ok = false;
        }

        if (!password) {
            setPasswordErr("Password is required.");
            ok = false;
        } else if (password.length < 8) {
            setPasswordErr("Password must be at least 8 characters.");
            ok = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordErr("Confirm password is required.");
            ok = false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordErr("Passwords do not match.");
            ok = false;
        }

        return ok;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const ok = validate();
        if (!ok) return;

        const user = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
            confirmPassword,
            role: "user", // ✅ always user
        };

        try {
            await axios.post("http://localhost:8008/api/createUser", user);

            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            navigate("/login")
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 422) {
                    applyBackendErrors(err.response.data?.errors);
                    return;
                }
            }
            console.log(err);
        }
    };

    const inputBase =
        "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
    const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500";
    const errText = "mt-2 text-xs font-bold text-red-500";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full min-h-[600px]">
                <div className="w-full md:w-1/2 bg-[#F0F6FF] p-10 flex flex-col justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <FaUser className="text-white text-3xl" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2 leading-tight">
                        TOURNAMENT
                        <br />
                        ORGANIZER
                    </h1>
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed mt-4">
                        Manage tournaments, track participants, and coordinate events with
                        real-time updates and AI-powered insights.
                    </p>
                </div>

                <div className="w-full md:w-1/2 bg-white p-10 md:p-12 flex flex-col justify-center">
                    <div className="flex mb-6">
                        <Link
                            to="/login"
                            className="w-1/2 pb-3 text-center text-gray-400 font-semibold border-b border-gray-200 hover:text-gray-600"
                        >
                            LOGIN
                        </Link>
                        <button
                            type="button"
                            className="w-1/2 pb-3 text-center text-blue-600 font-bold border-b-2 border-blue-600"
                        >
                            REGISTER
                        </button>
                    </div>

                    <form onSubmit={onSubmit}>

                        <div className="flex gap-4 mb-4">
                            <div className="w-1/2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                                    First Name
                                </label>
                                <input
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        if (firstNameErr) setFirstNameErr("");
                                    }}
                                    type="text"
                                    placeholder="FName"
                                    className={`${inputBase} ${firstNameErr ? inputError : ""}`}
                                />
                                {firstNameErr && <p className={errText}>{firstNameErr}</p>}
                            </div>

                            <div className="w-1/2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                                    Last Name
                                </label>
                                <input
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        if (lastNameErr) setLastNameErr("");
                                    }}
                                    type="text"
                                    placeholder="LName"
                                    className={`${inputBase} ${lastNameErr ? inputError : ""}`}
                                />
                                {lastNameErr && <p className={errText}>{lastNameErr}</p>}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailErr) setEmailErr("");
                                }}
                                type="email"
                                placeholder="your@email.com"
                                className={`${inputBase} ${emailErr ? inputError : ""}`}
                            />
                            {emailErr && <p className={errText}>{emailErr}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                                Password
                            </label>
                            <input
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (passwordErr) setPasswordErr("");
                                    if (confirmPasswordErr && confirmPassword === e.target.value)
                                        setConfirmPasswordErr("");
                                }}
                                type="password"
                                placeholder="••••••••"
                                className={`${inputBase} ${passwordErr ? inputError : ""}`}
                            />
                            {passwordErr && <p className={errText}>{passwordErr}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                                Confirm Password
                            </label>
                            <input
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (confirmPasswordErr) setConfirmPasswordErr("");
                                }}
                                type="password"
                                placeholder="••••••••"
                                className={`${inputBase} ${confirmPasswordErr ? inputError : ""}`}
                            />
                            {confirmPasswordErr && <p className={errText}>{confirmPasswordErr}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1A5CFF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300"
                        >
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
