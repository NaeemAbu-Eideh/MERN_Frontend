import React from 'react';

function Admin() {
    return (
        <>
            <div className={"flex justify-between mx-auto w-400 items-center mb-10"}>
                <div className="mt-10">
                    <h1 className={"text-3xl mb-3 font-bold"}>ADMIN DASHBOARD</h1>
                    <p className={"text[1.3em]"}>Manage tournaments, matches, stadiums, and requests</p>
                </div>
                <button onClick={""} className={"text-[1.4em] rounded-2xl w-50 border text-white bg-blue-600"}>+ Create New</button>
            </div>
            <div className="flex mx-auto w-400 mb-10">
                <div className={"w-90 h-40 mr-10 bg-white rounded-2xl shadow-md"}>
                    <div className={"flex justify-center"}>
                        <div className={"mt-10"}>
                            <p className={"text-center text-[1.5em]"}>2</p>
                            <p className={"text-center text-[1.2em]"}>TOURNAMENTS</p>
                        </div>
                    </div>
                </div>
                <div className={"w-90 h-40 mr-10 bg-white rounded-2xl shadow-md"}>
                    <div className={"flex justify-center"}>
                        <div className={"mt-10"}>
                            <p className={"text-center text-[1.5em]"}>2</p>
                            <p className={"text-center text-[1.2em]"}>MATCHES</p>
                        </div>
                    </div>
                </div>
                <div className={"w-90 h-40 mr-10 bg-white rounded-2xl shadow-md"}>
                    <div className={"flex justify-center"}>
                        <div className={"mt-10"}>
                            <p className={"text-center text-[1.5em]"}>2</p>
                            <p className={"text-center text-[1.2em]"}>STADIUMS</p>
                        </div>
                    </div>
                </div>
                <div className={"w-90 h-40 mr-10 bg-white rounded-2xl shadow-md"}>
                    <div className={"flex justify-center"}>
                        <div className={"mt-10"}>
                            <p className={"text-center text-[1.5em]"}>2</p>
                            <p className={"text-center text-[1.2em]"}>PENDING REQUESTS</p>
                        </div>
                    </div>
                </div>
                <div className={"w-90 h-40 mr-10 bg-white rounded-2xl shadow-md"}>
                    <div className={"flex justify-center"}>
                        <div className={"mt-10"}>
                            <p className={"text-center text-[1.5em]"}>156</p>
                            <p className={"text-center text-[1.2em]"}>TOTAL PARTICIPANTS</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                b
            </div>
        </>
    );
}

export default Admin;