import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc")
            );
        
         onSnapshot(q, (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id : doc.id,
                ...doc.data()
            }));

            setNweets(nweetArray);
         }) 

    }, [])
    
    const onSubmit = async (event) => {
        event.preventDefault();
        
        await addDoc(collection(dbService, "nweets"),{
            nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });

        setNweet("");
    }

    const onChange = (event) => {
        const {target:{value}} = event;
        setNweet(value);
    }
   
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" value={nweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Nweet"/>
            </form>
            <div>
                {nweets.map((nweet) => (
                    <div key={nweet.id}>
                        <h4>{nweet.nweet}</h4>
                    </div>
                ))}
            </div>
        </div>
    )
}; 

export default Home;