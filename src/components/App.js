import React , { useEffect, useState } from "react";
import AppRouter from "./Router";
import {authService} from "../fbase";
import {onAuthStateChanged, updateProfile} from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect (() => {
    onAuthStateChanged(authService, (user) => {

      if(user) {
        setUserObj({
          displayName : ((user.displayName === null) ? user.email : user.displayName),
          uid : user.uid,
          updateProfile : (agrs) => updateProfile(user, {displayName: ((user.displayName === null) ? user.email : user.displayName)}),
        });
      }else{
        setUserObj(null);
      }

      setInit(true);
     
    });
  },[])
  
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName : user.displayName,
      uid : user.uid,
      updateProfile : (agrs) => updateProfile(user, {displayName: user.displayName}),
    });
  }
  
  return (
    <>
      {init ? <AppRouter isLoggedIn = {Boolean(userObj)} userObj = {userObj} refreshUser={refreshUser}/> : "Initializing..."}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;
