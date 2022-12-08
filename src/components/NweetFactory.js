import React, { useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();

    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }

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

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input" type="text" value={nweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
                <input className="factoryInput__arrow" type="submit" value="&rarr;" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input style={{opacity: 0,}} id="attach-file" type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>
            {attachment && 
                <div className="factoryForm__attachment">
                    <img
                    src={attachment}
                    style={{
                        backgroundImage: attachment,
                    }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttactment}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            }
        </form>
    )
}

export default NweetFactory;