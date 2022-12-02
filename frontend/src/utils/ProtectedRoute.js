import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoggedIn = () => {
        const token = localStorage.getItem('access_token');
        if (!token || token === 'undefined') {
            setIsLoggedIn(false);
            return navigate('/login');
        }

        setIsLoggedIn(true);
    }

    useEffect(() => {
        checkLoggedIn();
    }, [isLoggedIn]);


    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}

export default ProtectedRoute;