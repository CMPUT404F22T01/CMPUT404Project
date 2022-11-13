import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Avatar,
  CardActions,
  Typography,
  TextField,
} from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";

import CardMedia from "@mui/material/CardMedia";

import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
 

import axiosInstance from "./axiosInstance";

import "./UserProfile.css";

import Collapse from "@mui/material/Collapse";
/**
 * The edit part appears on the very top of the page need to deal with it too
 * Deal with images
 * 
 * Problem in reRenderHelper for last post deletion
 */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const UserProfile = ({userData}) => {
  
  // we use UseNagivation to show search user peoples profile
  // so when the user clicked on one of the search user's profile we send that data along with the 
  // navigation
  const {state} = useLocation(); 
  /**
   * this are the default user ids comes from the local storage or later we implement an user class
   */
  let authorID =  localStorage.getItem("id");
  let authorUsername = localStorage.getItem("username")
  let authorDisplayName;
  let authorGithubURL;
  
  const [data, setData] = useState([]);
  const [reRenderHelper, setReRenderHelper] = React.useState(false);

  // when the show other user's profile
  if(state !== null){
    authorID = state.authorData.id.split("authors/")[1];
    authorUsername = state.authorData.username;
    authorDisplayName = state.authorData.displayName;
    authorGithubURL = state.authorData.github_url; 

  }

  // we allow delete only for current user profile
  const onClickDeletePost = (index) => { 
    axiosInstance
      .delete(`authors/${localStorage.getItem("id")}/posts/${data[index].id.split("posts/")[1]}/`)
      .then((response) => {
        console.log(response.status)
      })
      .catch((error) => {
        console.log(error);
      });
      setReRenderHelper((prevState)=>!prevState); 
  };
  // const url = 'http://127.0.0.1:8000/mainDB/user/data/'
  // const config = {
  //     headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  // };

  useEffect(() => {
    axiosInstance
      .get(`authors/${authorID}/posts/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("error in post get ", error);
      });
  }, [reRenderHelper]); 

  const allpost = data.map((item, index) => {
    // return a uri therefore need to split it 
   
      return (
        <Typography paragraph className="card-container">
          <Card sx={{ maxWidth: 1000 }} className="card-view">
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  R
                </Avatar>
              }
              action={
                // this if statement helps to avoid other user deleting current user post when they visit other user profiles
               item.author.id.split('authors/')[1] === localStorage.getItem("id") ?
                <IconButton aria-label="delete">
                  {/* to allow author to edit its own post */} 
                  <DeleteIcon onClick={() => onClickDeletePost(index)} />
                  
                </IconButton>
               : ""
              }
              title={item.title}
              subheader={item.published}
            />

            {/* <CardMedia
                    component="img"
                    height="394"
                    image="https://mui.com/static/images/cards/paella.jpg"
                    alt="Paella dish"
                  /> */}
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {item.content}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <CommentIcon />
              </IconButton>
              
            </CardActions>
             
          </Card>
        </Typography>
      );
    }
  );

  return (
    <>
      <Card className="user-profile-card" sx={{backgroundColor: '#333'}}>
        <CardContent>
          <Avatar
            src="https://media.tacdn.com/media/attractions-splice-spp-674x446/09/c3/33/97.jpg"
            className="profile-img"
            sx={{ width: 100, height: 100 }}
          />
          <Typography
            variant="h5"
            component="h2"
            className="user-name"
          >{authorUsername}</Typography>
          <Typography
            variant="h6"
            component="h2"
            className="user-name"
          ></Typography>
          <Typography
            variant="h6"
            component="h2"
            className="user-name"
          ></Typography>
          <div className="fcontainer">
            <Box className="fbox">Follwers</Box>

            <Box className="fbox">Following</Box>

            <Box className="fbox">Bff</Box>
          </div>
        </CardContent>
      </Card>
      <div className="post">{allpost}</div>
    </>
  );
};

export default UserProfile;
