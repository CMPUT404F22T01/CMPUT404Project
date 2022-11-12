import { useState, useEffect } from "react"

const KEY_FOR_LOCALSTORAGE_USER = "user";

function getPreviousUser(){
    const user = JSON.parse(localStorage.getItem(KEY_FOR_LOCALSTORAGE_USER));
    if (user) return user;
    return null;
}

export default function useApplicationUser() {
    const [user, setUser] = useState(()=>{
        return getPreviousUser();
    });

    useEffect(()=>{
        if (user != null)  
            localStorage.setItem(KEY_FOR_LOCALSTORAGE_USER, JSON.stringify(user));
    },[user]);

    return [user, setUser]
}