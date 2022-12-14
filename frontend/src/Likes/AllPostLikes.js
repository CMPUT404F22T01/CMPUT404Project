import * as React from "react";
import axiosInstance from "../utils/axiosInstance";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

const AllPostLikes = ({postData, reRenderLikeHelper, alreadyLikedSetter}) => {

    const navigate = useNavigate();
    const [likeData, setLikeData] = React.useState([])
    
    React.useEffect(() => {
        axiosInstance.get(`authors/${localStorage.getItem("id")}/posts/${postData.id.split("posts/")[1]}/likes/`)
        .then((response) => {
            setLikeData(response.data)
            let localUserName = localStorage.getItem("username");
            for (let likeObj of response.data){
                if (likeObj.author.username == localUserName){
                    if (alreadyLikedSetter) alreadyLikedSetter(true);
                }
            }
        }).catch((error) => {
            console.error(error)
        })
    }, [reRenderLikeHelper]) 

    const allLikes = likeData.map((value) =>{
        const authorData = value.author
        return (
            <>
                 <ListItem button onClick={()=>navigate('/profile', {state:{authorData}})}>
                    <ListItemText primary={authorData.username}></ListItemText>
                 </ListItem>
            </>
        )
    })
    return (
        <>
        <List>
            {allLikes}
        </List>
            
        </>
    )
};

export default AllPostLikes;