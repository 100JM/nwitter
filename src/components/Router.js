import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routers/Auth";
import Home from "../routers/Home";
import Profile from "../routers/Profile";
import Navigation from "./Navigation";

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {
    
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Routes>
                {isLoggedIn ?
                    <>
                        <Route path="/" element={<Home userObj={userObj}/>}/>
                        <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser}/>}/>
                    </>
                    :
                    <Route path="/" element={<Auth/>}/>
                }
            </Routes>
        </Router>
    )
}

export default AppRouter;