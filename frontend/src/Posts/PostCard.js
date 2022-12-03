import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";

import { red } from "@mui/material/colors";

import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { makeStyles } from "@mui/styles";

import AllPostLikes from "../Likes/AllPostLikes";
import { useEffect, useState, useRef } from "react";
import axiosInstance, { baseURL } from "../utils/axiosInstance"; 
import Comment from "../Comment/Comment";
import isValidUrl from "../utils/urlValidator";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
    container: {
      borderRadius: 100,
      width: "100%",
      //for reference remove it later
      // backgroundColor: "#303245",
    },
    cardContainer: {
      margin: "0 auto",
  
      borderRadius: 10,
    },
    cardHeader: {},
    commentContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "space-evenly",
    },
    commentTextField: {
      height: 40,
      width: "90%",
    },
    commentButton: {
      width: "10%",
      height: 40,
      borderRadius: 10,
    },
    postCommentCard: {
      display: "flex",
      //alignItems:"center",
      mx: "auto",
      width: 1000,
      //m: '1rem'
    },
});

export default function SinglePost({ data }){

    const styleClasses = useStyles();
    const [likeOpen, setLikeOpen] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    const [currComment, setCurrComment] = useState("");
    const [redHeart, setRedHeart] = useState(false);

    const onClickCreateCommentHandler = () => {
        // console.log(commentRef.current);
        // doubt why does the useRef gives an empty value and why the ... warning
        if (data.author.host[data.author.host.length - 1] !== "/") {
          data.author.host += "/";
        }
        if (data.author.host === baseURL) {
          console.log("hello:", data.author.host)
          axiosInstance
            .post(
              `authors/${localStorage.getItem("id")}/posts/${
                data.id.split("posts/")[1]
              }/comments/`,
              {
                comment: currComment,
              }
            )
            .then((response) => {
              return response.data;
            })
            .then((response) => {
              // console.log(response.post.id.split("authors/")[1].split("/posts/")[0]);
              axiosInstance.post(
                `authors/${
                  response.post.id.split("authors/")[1].split("/posts/")[0]
                }/inbox/`,
                response
              );
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          //temporary setup
          var userInfo;
          axiosInstance.get(`authors/${localStorage.getItem("id")}/nodes/`)
          .then((response) => {
            for(let i = 0; i < response.data.length; i++) {
              if(response.data[i].host == data.author.host){
                userInfo = response.data[i];
                break;
              }
            }
            
            axiosInstance
            .post(
              `${data.author.host}authors/${data.author.id.split("authors/")[1]}/posts/${
                data.id.split("posts/")[1]
              }/comments/`,
              {
                comment : currComment
              },
              {
                auth : {
                  username : userInfo.node.username,
                  password : userInfo.node.password
                }
              }
            )
            .then((response) => {
              return response.data;
            })
            .catch((error) => {
              console.log(error);
            });
          }).catch((error) => {
            console.log(error);
          })
          
           
        }
    
        setCurrComment("");
        
    };

    const onClickLikeHandler = () => {
      if (redHeart) return;
      const payloaddata = {
        type: "like",
        data: data,
      }; 
      if(data.author.host[data.author.host.length - 1] !== '/'){
        data.author.host += '/'
      }
      if (data.author.host == baseURL){
        axiosInstance
        .post(
          `authors/${localStorage.getItem("id")}/inbox/`,
          payloaddata
        )
        .then((response) => {
          console.log(response.data);
          setRedHeart(true);
        })
        .catch((error) => {
          console.log(error);
        });
      }
      else{
        axiosInstance
        .post(
          `${data.author.host}authors/${data.author.id.split("authors/")[1]}/inbox/`,
          payloaddata,
          {
            auth: {
              username: "team1and2",
              password: "team1and2"
            }
          }
        )
        .then((response) => {
          console.log(response.data);
          setRedHeart(true);

        })
        .catch((error) => {
          console.log(error);
        });
      }
    };

    return (
        <Typography paragraph className={styleClasses.container}>
        <Card sx={{ maxWidth: 1000 }} className={styleClasses.cardContainer}>
          <CardHeader
            className={styleClasses.cardHeader}
            avatar={
              <Avatar
                // alt={data.author.username + ": Post User's Profile Picture"}
                src={
                  isValidUrl(data.author.profileImage)
                    ? data.author.profileImage
                    : "https://c404t3v1.herokuapp.com" + data.author.profileImage
                }
              />
            }
            title={data.author.username}
            subheader={<ReactMarkdown rehypePlugins={[rehypeRaw]}>{data.title}</ReactMarkdown>}
          />
          {/* HardedCoded host need to change later ==============http://localhost:8000=========================*/}
          {data.image || data.image_url ? (
            <CardMedia
              component="img"
              image={
                isValidUrl(data.image_url)
                  ? data.image_url
                  : "https://c404t3v1.herokuapp.com" + data.image
              }
              alt="Post Image"
            />
          ) : data.contentType === "image/png;base64" ? (
            <CardMedia component="img" image={data.content} alt="Post Image" />
          ) : (
            ""
          )}

          <CardContent>
          {<ReactMarkdown rehypePlugins={[rehypeRaw]}>{data.content}</ReactMarkdown>}
          </CardContent>
          <CardActions disableSpacing sx={{ backgroundColor: "#333" }}>
            <IconButton
              aria-label="likedby"
              onClick={() => {
                setLikeOpen(true);
              }}
            >
              <Diversity1Icon sx={{ color: "#fff" }} />
            </IconButton>
            <IconButton
              aria-label="comment"
              onClick={() => {
                setCommentOpen(true);
              }}
            >
              <CommentIcon sx={{ color: "#fff" }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ marginLeft: "auto", color: "#fff" }}
            >
              {data.published}
            </Typography>
          </CardActions>
          
          <Collapse
            in={commentOpen}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <Box className={styleClasses.commentContainer}>
                <TextField
                  value={currComment}
                  size="small"
                  label="comment"
                  onChange={(e) => setCurrComment(e.target.value)}
                  className={styleClasses.commentTextField}
                />
                <Button
                  onClick={onClickCreateCommentHandler}
                  className={styleClasses.commentButton}
                >
                  Post
                </Button>
              </Box>
         
              <Comment postData={data} reRenderHelper={currComment==""}/>
    
            </CardContent>
          </Collapse>

          <Dialog
            fullScreen
            open={likeOpen}
            onClose={() => setLikeOpen(false)}
            TransitionComponent={Transition}
            unmountOnExit
            timeout="auto"
            aria-label="liked by dialog"
          >
            <AppBar sx={{ position: "relative", backgroundColor: "#23395d" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setLikeOpen(false)}
                  aria-label="close liked by"
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  Liked By:
                </Typography>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={() => onClickLikeHandler()}
                  aria-label="like"
                >
                  <FavoriteIcon style={{ color: redHeart ? "red" : "grey" }} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <CardContent>
              <AllPostLikes
                postData={data} reRenderLikeHelper={redHeart} alreadyLikedSetter={setRedHeart}
              />
            </CardContent>
          </Dialog>

          {/* <Dialog
            open={openShare && indexOfCollapse === index}
            onClose={handleCloseShare}
            TransitionComponent={Transition}
            unmountOnExit
            timeout="auto"
            aria-label="share dialog"
          >
            <DialogTitle>Share with:</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
                inputRef={userToSharePostWithRef}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseShare}>Cancel</Button>
              <Button onClick={() => handleShare(index)}>Share</Button>
            </DialogActions>
          </Dialog> */}
        </Card>
      </Typography>
    )
}