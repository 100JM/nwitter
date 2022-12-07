import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";

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
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="Edit your nweet" value={newNweet} onChange={onChange} required/>
                        <input type="submit" value="Update Nweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancle</button>
                </>
            ) : (
                <>
                    <h4>{nweetObj.nweet}</h4>
                    {nweetObj.attachmentURL && 
                        <img src={nweetObj.attachmentURL} width="50px" height="50px" />
                    }
                    {isOwner && <>
                        <button onClick={onDeleteClick}>Delete Nweet</button>
                        <button onClick={toggleEditing}>Edit Nweet</button>
                    </>} 
                </>
            )}       
        </div>
    )
};

export default Nweet;