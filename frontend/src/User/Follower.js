import { CardContent, Typography, Card, Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";


export default function Follower() {

    const [followerList, setFollowList] = useState([]);

    useEffect( () => {
        axiosInstance.get(`authors/${localStorage.getItem("id")}/followers`)
        .then((response) => {
            setFollowList(response.data.items);
        }).catch((error) => {
            console.log(error);
        });

    }, [followerList]);


    const allFollowers = followerList.map((follower, index) => {
        return (
            <Card>
                <CardContent>
                    <Typography>{follower.displayName}</Typography>
                </CardContent>
            </Card>
        );
    });

    return (
        <Box>
            {allFollowers}
        </Box>

    );

};