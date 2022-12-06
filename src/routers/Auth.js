import React, { useState } from "react";
import { authService } from "../fbase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { async } from "@firebase/util";

const Auth = () => {
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
            console.log(data);
        } catch (error) {
            setError(error.message.replace("Firebase: ", ""));
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);
    
    const onSocialClick = async (event) => {
        const {target : {name}} = event;
        let provider;

        if(name === 'google') {
            provider = new GoogleAuthProvider();
        }else if(name === 'github') {
            provider = new GithubAuthProvider();
        }

        await signInWithPopup(authService, provider);
    
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required value={form.email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" required value={form.password} onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account" : "Sing In"}/>
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sing In" : "Create Account"}</span>
            <div>
                <button name="google" onClick={onSocialClick}>Continue with Google</button>
                <button name="github" onClick={onSocialClick}>Continue with Github</button>
            </div>
        </div>
    )};

export default Auth;