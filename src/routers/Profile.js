import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { useNavigate  } from 'react-router-dom';
//import { collection, getDocs, orderBy, query, where } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

const Profile = ({userObj, refreshUser}) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };
    
    // const getMyNweet = async () => {
    //     const q = query(collection(dbService, "nweets"),where("creatorId", "==", userObj.uid),orderBy("createdAt", "desc"));

    //     const querySnapshot = await getDocs(q);

    //     querySnapshot.forEach((doc) => {
    //         console.log(doc.data());
    //     })
    // }
    
    // useEffect(() => {
    //     getMyNweet();
    // },[])
    
    const onSubmitDisplayName = async (event) => {
        event.preventDefault();

        if(userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName : newDisplayName});
            refreshUser();
        }
    };

    const onChangeDisplayName = (event) => {
        const {target : {value}} = event;

        setNewDisplayName(value);
    };

    return(
        <div className="container">
            <form onSubmit={onSubmitDisplayName} className="profileForm">
                <input type="text" placeholder="Display name" autoFocus className="formInput" value={newDisplayName} onChange={onChangeDisplayName}/>
                <input type="submit" value="Update Profile" className="formBtn" style={{marginTop: 10,}}/>
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
        </div>
    )        
};

export default Profile;