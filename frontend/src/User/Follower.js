import { CardContent, Typography, Card, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import isValidUrl from "../utils/urlValidator"
import DeleteIcon from '@mui/icons-material/Delete';


export default function Follower() {

    const [followerList, setFollowList] = useState([]);

    useEffect( () => {
        axiosInstance.get(`authors/${localStorage.getItem("id")}/followers/`)
        .then((response) => {
            setFollowList(response.data.items);
        }).catch((error) => {
            console.log(error);
        });

    }, [followerList]);

    const handleDeleteFollower = (index) => {
        axiosInstance
        .delete(`authors/${localStorage.getItem("id")}/followers/${followerList[index].id.split("authors/")[1]}`)
        .then( (response) => {
            console.log(response);
        }).catch((error) => {
           console.log(error); 
        });
    };
    


    const allFollowers = followerList.map((follower, index) => {

        return (

            <>
            <ListItem
                secondaryAction={
                    <IconButton aria-label="delete">
                        <DeleteIcon onClick={() => handleDeleteFollower(index)}/>
                    </IconButton>
                }
            >
                
                <ListItemAvatar>
                    <Avatar src={isValidUrl(follower.profileImage) ? follower.profileImage : `${follower.host}`+follower.profileImage}/>
                </ListItemAvatar>
                <ListItemText primary={follower.displayName} secondary={follower.username}/>
            </ListItem>
            <Divider/>
            </>
                                           
        );
    });

    return (
        <Box>
            <List>
                {allFollowers}
            </List>
            
        </Box>

    );

};