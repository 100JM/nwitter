import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routers/Auth";
import Home from "../routers/Home";

const AppRouter = ({isLoggedIn}) => {
    
    return (
        <Router>
            <Routes>
                {isLoggedIn ?
                    <Route path="/" element={<Home/>}/>
                    :
                    <Route path="/" element={<Auth/>}/>
                }
            </Routes>
        </Router>
    )
}

export default AppRouter;