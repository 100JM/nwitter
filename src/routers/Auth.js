import React, { useState } from "react";

const Auth = () => {
    const [form, setForm] = useState({email:"", password:""});

    const onChange = ({target:{name, value}}) => {
        setForm({ ...form, [name]: value });
    };
    
    const onSubmit = (event) => {
        event.preventDefault();
        console.log(form);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required value={form.email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" required value={form.password} onChange={onChange}/>
                <input type="submit" value="Log In"/>
            </form>
            <div>
                <button>Continue with Google</button>
                <button>Continue with Github</button>
            </div>
        </div>
    )};

export default Auth;