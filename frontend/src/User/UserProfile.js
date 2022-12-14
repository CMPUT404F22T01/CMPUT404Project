import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";

import CardMedia from "@mui/material/CardMedia";

import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/axiosInstance";

import "./UserProfile.css";
import "./ProfileEdit.js"

import Collapse from "@mui/material/Collapse";
import { width } from "@mui/system";
import ProfileEdit from "./ProfileEdit.js";
import GitHubPage from "./GitHubPage";
import Follower from "./Follower";
import isValidUrl from "../utils/urlValidator"
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import Post from '../Posts/Post'

/**
 * The edit part appears on the very top of the page need to deal with it too
 * Deal with images
 * 
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
  const navigate = useNavigate();
  /**
   * this are the default user ids comes from the local storage or later we implement an user class
   */
  let authorID =  localStorage.getItem("id");
  let authorUsername = localStorage.getItem("username")
  let authorDisplayName;
  let authorGithubURL;
  var isMyProfile = true;
  
  const [data, setData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [following, setFollowing] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [tabValue, setTabValue] = React.useState(1);
  const [reRenderFollowHelper, setReRenderFollowHelper] = React.useState(false);
  const [followerData, setFollowerData] = React.useState([]);


  // when the show other user's profile
  if(state !== null){
    authorID = state.authorData.id.split("authors/")[1];
    authorUsername = state.authorData.username;
    authorDisplayName = state.authorData.displayName;
    authorGithubURL = state.authorData.github_url; 
    isMyProfile = false;

  }
  
  const handleOpenEditDialog = () => {
    setOpenDialog(true)
  };

  const handleCloseEditDialog = () => {
    setOpenDialog(false);
  };


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOnHomeClick = () => {
    navigate('/');
  }

  const onClickSendFollowRequestHandler = () => {
    if(following === false){
      const data = {
        "type": "follow",
        "id": localStorage.getItem('id'),
        "username": localStorage.getItem('username'),
      }
      axiosInstance.post(
        `authors/${authorData.id.split("authors/")[1]}/inbox/`,
        data
        ).then((response) => {
          console.log(response.data)
          setFollowing(true);
        }).catch((error)=>{
          console.log(error)
          setFollowing(false);
        })
    }else{
      axiosInstance
      .delete(`authors/${authorID}/followers/${localStorage.getItem("id")}`)
      .then((response) => {
        console.log(response.status)
         if(response.status === 200){
          setFollowing(true);
         }
      })
      .catch((error) => {
        setFollowing(false);
      });
    }

    reRenderFollowHelper((prevState)=>!prevState)
  }

  useEffect(() => {
    axiosInstance
      .get(`authors/${authorID}/`)
      .then((response) => {
        setAuthorData(response.data);
      })
      .catch((error) => {
        console.error("error in post get ", error);
      });
  }, [openDialog])

  useEffect(() => {
    axiosInstance
      .get(`authors/${authorID}/followers/${localStorage.getItem("id")}`)
      .then((response) => {
         if(response.status === 200){
          setFollowing(true);
         }
      })
      .catch((error) => {
        setFollowing(false);
      });
  }, [reRenderFollowHelper])

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
              onClick={handleOnHomeClick}>
            <HomeIcon/>
          </IconButton>
        </Toolbar>

      </AppBar>
      <Card className="user-profile-card" sx={{backgroundColor: '#23395d'}}>
        <CardContent>
    
          <Grid container direction="row" alignItems="center" spacing={8} >

            <Grid item>
              { authorData.profileImage ? 
                <Avatar
                src={isValidUrl(authorData.profileImage) ? authorData.profileImage : `${authorData.host}`+authorData.profileImage.substring(1)}
                className="profile-img"
                sx={{ width: 150, height: 150, marginBottom: 2 }}
              /> 
              :     <Avatar
              src={authorData.displayName}
              className="profile-img"
              sx={{ width: 150, height: 150, marginBottom: 2 }}
            /> 
              }
               
              </Grid>

              {isMyProfile ?
              <Grid item>
                <Button 
                    variant="contained" 
                    size="small"
                    sx = {{borderRadius: 2}}
                    startIcon={<EditIcon/>}
                    onClick={handleOpenEditDialog}> 
                    Edit Profile
                  </Button>
              </Grid>
              :
              <Grid item>
                <Button 
                    variant="contained" 
                    size="small"
                    sx = {{borderRadius: 10}}
                    onClick={onClickSendFollowRequestHandler}> 
                    {following ? 'Unfollow' : 'Follow'}
                  </Button>
              </Grid>
            }
          </Grid>
         
            <Typography
              variant="h5"
              component="h2"
              className="user-name"
            >{authorData.displayName}</Typography>
                     
          <Grid container direction="row" alignItems="center" className="github">
            <Grid item>
              <GitHubIcon></GitHubIcon>
            </Grid>
            <Grid item paddingLeft={1}>
            {authorData.github}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Tabs
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        value={tabValue}
        onChange={handleTabChange}
        >
          <Tab value={1} label="posts"/>
          <Tab value={2} label="Followers"/>
          <Tab value={3} label="Github"/>
      </Tabs>
      { tabValue===1 && <div className="post">{<Post userID={authorID} getAll={false}></Post>}</div>}
      { tabValue===2 && <Follower></Follower>}
      { tabValue===3 && <GitHubPage url={authorData.github}></GitHubPage> }
      <ProfileEdit 
        openDialog={openDialog} 
        setOpenDialog={setOpenDialog}
        displayName = {authorData.displayName}
        githubURL={authorData.github}>
       </ProfileEdit>
    </Box>
  );
};

export default UserProfile;
