import React, { useState } from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { authService } from "../fbase";

const AuthForm = () => {
    const [form, setForm] = useState({email:"", password:""});
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = ({target:{name, value}}) => {
        setForm({ ...form, [name]: value });
    };
    
    const onSubmit = async(event) => {
        event.preventDefault();
        
        try {
            let data;
            if(newAccount) {
                data = await createUserWithEmailAndPassword(authService, form.email, form.password);
            }else {
                data = await signInWithEmailAndPassword(authService, form.email, form.password);
            }
        } catch (error) {
            setError(error.message.replace("Firebase: ", ""));
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input className="authInput" name="email" type="text" placeholder="Email" required value={form.email} onChange={onChange}/>
                <input className="authInput" name="password" type="password" placeholder="Password" required value={form.password} onChange={onChange}/>
                <input className="authInput authSubmit" type="submit" value={newAccount ? "Create Account" : "Sing In"}/>
                {error && <span className="authError">{error}</span>}
            </form>
            <span className="authSwitch" onClick={toggleAccount}>{newAccount ? "Sing In" : "Create Account"}</span>
        </>
    )
}

export default AuthForm;