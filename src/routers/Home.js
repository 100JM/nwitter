import React, { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import { addDoc, collection, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import Nweet from "../components/Nweet";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from 'uuid';


const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();

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
        let attachmentURL = "";

        if(attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); //파일 경로 참조 생성
            const response = await uploadString(attachmentRef, attachment, "data_url"); //storage 참조 경로로 파일 업로드
            attachmentURL = await getDownloadURL(response.ref); //storage 경로에 있는 파일URL을 다운로드하여 attachmentURL 변수에 업데이트
        }

        const nweetObj = {
            nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentURL,
        }

        await addDoc(collection(dbService, "nweets"),nweetObj);

        setNweet("");
        setAttachment("");
        fileInput.current.value = null;
    }

    const onChange = (event) => {
        const {target:{value}} = event;
        setNweet(value);
    }
    
    const onFileChange = (event) => {
        const {
            target : {files}
        } = event;

        const imageFile = files[0];

        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(imageFile);
    }

    const onClearAttactment = () => {
        setAttachment("");
        fileInput.current.value = null;
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" value={nweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>
                <input type="submit" value="Nweet"/>
                {attachment && <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttactment}>Clear</button>
                </div>}
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}; 

export default Home;