import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.nweet);
    const nweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");

        if(ok){
            await deleteDoc(nweetTextRef);
            
            if(nweetObj.attachmentURL !== "") {
                await deleteObject(ref(storageService, nweetObj.attachmentURL));
            }
        }
    }
    
    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();

        await updateDoc(nweetTextRef, {
            nweet : newNweet
        });

        setEditing(false);
    }

    const onChange = (event) => {
        const {
            target : {value}
        } = event;

        setNewNweet(value);
    }

    return (
        <div className="nweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input className="formInput" type="text" placeholder="Edit your nweet" value={newNweet} onChange={onChange} required/>
                        <input className="formBtn" type="submit" value="Update Nweet" />
                    </form>
                    <button className="formBtn cancelBtn" onClick={toggleEditing}>Cancle</button>
                </>
            ) : (
                <>
                    <h4>{nweetObj.nweet}</h4>
                    {nweetObj.attachmentURL && 
                        <img src={nweetObj.attachmentURL}/>
                    }
                    {isOwner &&(
                    <div className="nweet__actions">
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>)} 
                </>
            )}       
        </div>
    )
};

export default Nweet;