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
import axiosInstance, {baseURL} from "../utils/axiosInstance";
import PostEdit from "./PostEdit";
import Comment from "../Comment/Comment";
import isValidUrl from "../utils/urlValidator";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import {v4 as uuidv4} from 'uuid';
 
/**
 * The edit part appears on the very top of the page need to deal with it too
 * Deal with images
 */

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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
    width: "88%",
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

export default function Post({ postReRenderHelper, getAll, userID }) {

  const styleClasses = useStyles();
  const [post, setPost] = useState([]);
  const userToSharePostWithRef = useRef(null);
  const [node, setNode] = useState([]);

  const [comment, setComment] = useState(null);
  const [indexOfCollapse, setIndexOfCollapse] = useState(null);
  const [openLikedBy, setOpenLikedBy] = React.useState(false);
  const [openShare, setOpenShare] = React.useState(false);
  const [openComment, setOpenComment] = React.useState(false);
  // const [expanded, setExpanded] = React.useState(false);

  const [redHeart, setRedHeart] = React.useState(false);

  //this reRenderHelper is used to re render the comment component (expensive maybe!!)
  const [reRenderHelper, setReRenderHelper] = useState(false);
  const [reRenderLikeHelper, setReRenderLikeHelper] = useState(false);
  //this two are for the editPost and PostEdit prop
  //indexToEdit is used to get the index clicked happened and pass post at that index as prop to the PostEdit
  const [postEdit, setPostEdit] = useState(false);
  const [indexToEdit, setIndexToEdit] = useState(false);

  const onChangeCommentHandler = (e) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    axiosInstance
      .get(`authors/${localStorage.getItem("id")}/posts/distinct/`)
      .then((response) => {
        setPost((oldData) => [...oldData, ...response.data.items]);
      })
      .catch((error) => {
        console.error("error in post get ", error);
      });
  }, [postReRenderHelper]);

  // getting external node user to get the posts later
  useEffect(() => {
    axiosInstance
      .get(`authors/${localStorage.getItem("id")}/nodes/`)
      .then((response) => {
        setNode(response.data);
      })
      .catch((error) => {
        console.error("error in node get ", error);
      });
  }, []);

  //getting all forgein server posts
  useEffect(() => {
    node.map((item, index) => { 
      axiosInstance
        .get(`${item.node.host}authors/${item.id.split("authors/")[1]}/posts/`, 
        {
          auth : {
            username : item.node.username,
            password : item.node.password
          }
        })
        .then((response) => {
          setPost((oldData) => [...oldData, ...response.data.items]);
        })
        .catch((error) => {
          console.error("error in node get ", error);
        });
    });
  }, [node]);

  const onClickCreateCommentHandler = (data) => {
    console.log(data.id);
     
    if (data.author.host[data.author.host.length - 1] !== "/") {
      data.author.host += "/";
    }
    if (data.author.host === baseURL) { 
      axiosInstance
        .post(
          `authors/${localStorage.getItem("id")}/posts/${
            data.id.split("posts/")[1]
          }/comments/`,
          {
            comment: comment,
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
          `${userInfo.node.host}authors/${data.author.id.split("authors/")[1]}/posts/${
            data.id.split("posts/")[1]
          }/comments/`,
          {
            comment : comment,
            author: axiosInstance.get(`authors/${localStorage.getItem("id")}/`).then((response) => {return response.data}),
            id: data.id+'/comments/'+uuidv4().toString(),
            object: data.id,
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

    setComment("");
    setReRenderHelper((prevState) => !prevState);
  };

  const onClickLikeHandler = (index) => {
    const data = {
      type: "like",
      data: post[index],
    }; 
    if(post[index].author.host[post[index].author.host.length - 1] !== '/'){
      post[index].author.host += '/'
    }
    if (post[index].author.host == "https://c404t3v1.herokuapp.com/"){
      axiosInstance
      .post(
        `authors/${localStorage.getItem("id")}/inbox/`,
        data
      )
      .then((response) => {
        setReRenderLikeHelper((prevState) => !prevState);
      })
      .catch((error) => {
        console.log(error);
      });
      
    }
    else{
      axiosInstance
      .post(
        `${post[index].author.host}authors/${post[index].author.id.split("authors/")[1]}/inbox/`,
        data,
        {
          auth: {
            username: "team1and2",
            password: "team1and2"
          }
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    } 
     
  };

  // How to handle a share: find the user and use the found user's id to send post request to the inbox.
  const handleShare = (index) => {
    axiosInstance
      .get(`author/search/`, {
        params: {
          username: userToSharePostWithRef.current.value,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        // [0] becoz the view returns many = true
        post[index].type = "share";
        axiosInstance.post(
          `authors/${response[0].id.split("authors/")[1]}/inbox/`,
          post[index],
          {
            params: {
              username: localStorage.getItem("username"),
            },
          }
        );
      })
      .catch((error) => {
        console.error(error);
      });
    setOpenShare(false);
  };

  //handler for the edit button click
  const onClickPostEditHandler = (index_to_edit = -1) => {
    if (index_to_edit !== -1) {
      setIndexToEdit(index_to_edit);
    }
    setPostEdit((prevState) => !prevState);
  };

  const handleClickOpenLikedBy = (index) => {
    setIndexOfCollapse(index);
    setOpenLikedBy(true);
  };

  const handleCloseLikedBy = () => {
    setIndexOfCollapse(null);
    setOpenLikedBy(false);
  };
  const handleExpandClick = (index) => {
    if (indexOfCollapse === index) {
      setIndexOfCollapse(null);
      setOpenComment(false);
    } else {
      setIndexOfCollapse(index);
      setOpenComment(true);
    }
  };
  const handleClickOpenShare = (index) => {
    setIndexOfCollapse(index);
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setIndexOfCollapse(null);
    setOpenShare(false);
  };
 
const allPost = post.map((data, index) => {
    return (
      <Typography paragraph className={styleClasses.container}>
        {(data.author.id.split("authors/")[1] ===
        userID || getAll) ? (<Card sx={{ maxWidth: 1000 }} className={styleClasses.cardContainer}>
          <CardHeader
            className={styleClasses.cardHeader}
            avatar={  
              data.author.profileImage ? 
              <Avatar
                alt={data.author.username + ": Post User's Profile Picture"}
                src={
                  isValidUrl(data.author.profileImage)
                    ? data.author.profileImage
                    : `${data.author.host}`+ data.author.profileImage.substring(1)
                }
              />
              :  <Avatar
              alt={data.author.username + ": Post User's Profile Picture"}
              src={
                 data.author.displayName
              }
            />
 
            }
            action={
              <IconButton aria-label="settings">
                {/* to allow author to edit its own post */}
                {data.author.id.split("authors/")[1] ===
                localStorage.getItem("id") ? (
                  <MoreVertIcon onClick={() => onClickPostEditHandler(index)} />
                ) : (
                  ""
                )}
              </IconButton>
            }
            title={data.author.username}
            subheader={<ReactMarkdown rehypePlugins={[rehypeRaw]}>{data.title}</ReactMarkdown>}
          />
           
          {data.image || data.image_url ? (
            <CardMedia
              component="img"
              image={
                isValidUrl(data.image_url)
                  ? data.image_url
                  : 
                  data.author.host === "https://c404t3v1.herokuapp.com/" 
                  ? `${data.author.host}` + data.image.substring(1) 
                  : data.image
              }
              alt="Post Image"
            />
          ) : data.contentType === "image/png;base64" ? (
            <CardMedia component="img" image={data.content} alt="Post Image" />
          ) : (
            ""
          )}

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {<ReactMarkdown rehypePlugins={[rehypeRaw]}>{data.content}</ReactMarkdown>}
            </Typography>
          </CardContent>
          <CardActions disableSpacing sx={{ backgroundColor: "#333" }}>
            <IconButton
              aria-label="likedby"
              onClick={() => handleClickOpenLikedBy(index)}
            >
              <Diversity1Icon sx={{ color: "#fff" }} />
            </IconButton>
            <IconButton
              aria-label="comment"
              onClick={() => {
                handleExpandClick(index);
              }}
            >
              <CommentIcon sx={{ color: "#fff" }} />
            </IconButton>
            {!(data.visibility === "UNLISTED") ? (
              <IconButton
                aria-label="share"
                onClick={() => {
                  handleClickOpenShare(index);
                }}
              >
                <SendIcon sx={{ color: "#fff" }} />
              </IconButton>
            ) : null}
            <Typography
              variant="body2"
              sx={{ marginLeft: "auto", color: "#fff" }}
            >
              {data.published}
            </Typography>
          </CardActions>
          <Collapse
            in={indexOfCollapse === index && openComment}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <Box className={styleClasses.commentContainer}>
                {/* commentRef does not work */}
                <TextField
                  value={comment}
                  size="small"
                  label="Comment"
                  onChange={onChangeCommentHandler}
                  className={styleClasses.commentTextField}
                />
                <Button
                  onClick={() => {
                    onClickCreateCommentHandler(data);
                  }}
                  className={styleClasses.commentButton}
                  variant="contained"
                  sx={{color: "#fff", backgroundColor: "#23395d", '&:hover': { backgroundColor: '#2f4c7d'}}}
                >
                  Post
                </Button>
              </Box>
         
                <Comment postData={data} reRenderHelper={reRenderHelper} />
    
            </CardContent>
          </Collapse>

          <Dialog
            fullScreen
            open={openLikedBy && indexOfCollapse === index}
            onClose={handleCloseLikedBy}
            TransitionComponent={Transition}
            unmountOnExit
            timeout="auto"
            aria-label="liked by dialog"
          >
            <AppBar sx={{ position: "relative", backgroundColor: "#23395d"}}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseLikedBy}
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
                  onClick={() => onClickLikeHandler(index)}
                  aria-label="like"
                >
                  {/* If the user has liked the item : style={{ color: "red" }} */}
                  <FavoriteIcon style={{ color: redHeart ? "red" : "white" }} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <CardContent>
              {/* Should list all of the people who have liked the item */}
              <AllPostLikes
                postData={post[indexOfCollapse]}
                reRenderLikeHelper={reRenderLikeHelper}
              />
            </CardContent>
          </Dialog>

          <Dialog
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
              <Button sx = {{color: "#15172b", '&:hover': { backgroundColor: '#e6ebf5'}}} onClick={handleCloseShare}>Cancel</Button>
              <Button sx = {{color: "#fff", backgroundColor: "#23395d", '&:hover': { backgroundColor: '#2f4c7d'}}} variant="contained" onClick={() => handleShare(index)}>Share</Button>
            </DialogActions>
          </Dialog>
        </Card> ) : (
                  ""
                )}

      </Typography>
    );
  });

  return (
    <Box
      component="main"
      //p padding pt padding top ...pb
      sx={{ flexGrow: 1, p: 3 }}
    >
      <DrawerHeader />
      {allPost}
      <Dialog open={postEdit}>
        <PostEdit
          onClickPostEditHandler={onClickPostEditHandler}
          data={post[indexToEdit]}
        />
      </Dialog>
       
    </Box>
  );
}
