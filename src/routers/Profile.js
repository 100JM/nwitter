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
        <>
            <form onSubmit={onSubmitDisplayName}>
                <input type="text" placeholder="Display name"  value={newDisplayName} onChange={onChangeDisplayName}/>
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )        
};

export default Profile;