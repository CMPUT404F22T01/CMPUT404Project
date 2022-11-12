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
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosInstance";
import PostEdit from "./PostEdit";
import Comment from "./Comment";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AllPostLikes from "./AllPostLikes";
/**
 * The edit part appears on the very top of the page need to deal with it too
 * Deal with images
 */
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

export default function Post({postReRenderHelper}) {
  const styleClasses = useStyles();
  const [post, setPost] = useState([]);
  const userToSharePostWithRef = useRef(null);

  const [comment, setComment] = useState(null);
  const [indexOfCollapse, setIndexOfCollapse] = useState(null); 
  const [openLikedBy, setOpenLikedBy] = React.useState(false);
  const [openShare, setOpenShare] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  //this reRenderHelper is used to re render the comment component (expensive maybe!!)
  const [reRenderHelper, setReRenderHelper] = useState(false);

  //this two are for the editPost and PostEdit prop
  //indexToEdit is used to get the index clicked happened and pass post at that index as prop to the PostEdit
  const [postEdit, setPostEdit] = useState(false);
  const [indexToEdit, setIndexToEdit] = useState(false);

  const onChangeCommentHandler = (e) => {
    setComment(e.target.value);
  };

  const onClickCreateCommentHandler = (data) => {
    // console.log(commentRef.current);
    // doubt why does the useRef gives an empty value and why the ... warning
    axiosInstance
      .post(
        `authors/${localStorage.getItem("id")}/posts/${
          data.id.split("posts/")[1]
        }/comments`,
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
          }/inbox`,
          response
        );
      })
      .catch((error) => {
        console.log(error);
      });
    setComment("");
    setReRenderHelper((prevState) => !prevState);
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
    } else {
      setIndexOfCollapse(index);
    }
    setExpanded((prevState)=> !prevState);
  };
  const handleClickOpenShare = (index) => {
    setIndexOfCollapse(index);
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setIndexOfCollapse(null);
    setOpenShare(false);
  };

  const onClickLikeHandler = (index) => { 
    console.log(post[index])
    const data = {
      'type': 'like', 
      'data': post[index] 
    }
    axiosInstance.post(
      `authors/${post[index].author.id.split("authors/")[1]}/inbox`,
       data
      ).then((response)=>{
        console.log(response.data)
      }).catch((error)=>{
        console.log(error)
      })
  }

  //how to handle a share??
  // find the user and use the found user's id to send post request to the inbox.
  const handleShare = (index) => {
  
    axiosInstance.get(`author/search/`, {
      params: {
        'username': userToSharePostWithRef.current.value
      }
    }).then(response => {
      return response.data;
    }).then(response => {
      // [0] becoz the view return many = true 
      post[index].type = 'share';
      axiosInstance.post(
        `authors/${response[0].id.split("authors/")[1]}/inbox`,
        post[index],
        {  params: {
          'username':  localStorage.getItem("username")
        } }
         
      )
    }).catch((error) => {
      console.error(error)
    })
    setOpenShare(false);
  };

  useEffect(() => {
    axiosInstance
      .get(`authors/${localStorage.getItem("id")}/posts/distinct/`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error("error in post get ", error);
      });
  }, [postReRenderHelper]);

  const allPost = post.map((data, index) => {
    return (
      <Typography paragraph className={styleClasses.container}>
        <Card sx={{ maxWidth: 1000 }} className={styleClasses.cardContainer}>
          <CardHeader
            className={styleClasses.cardHeader}
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
              </Avatar>
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
            title={data.title}
            subheader={data.published}
          />
          {/* HardedCoded host need to change later ==============http://localhost:8000=========================*/}
          {data.image ? (
            <CardMedia
              component="img"
              image={"http://localhost:8000" + data.image}
              alt="User Image"
            />
          ) : (
            ""
          )}

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {data.content}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="likedby">
              <Diversity1Icon onClick={() => handleClickOpenLikedBy(index)} />
            </IconButton>
            <IconButton aria-label="comment">
              <CommentIcon
                onClick={() => {
                  handleExpandClick(index);
                }}
              />
            </IconButton>
            <IconButton /*Only open if post === public*/ aria-label="share">
              <SendIcon
                onClick={() => {
                  handleClickOpenShare(index);
                }}
              />
            </IconButton>
          </CardActions>
          <Collapse in={indexOfCollapse === index && expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Box className={styleClasses.commentContainer}>
                {/* commentRef does not work */}
                <TextField
                  value={comment}
                  size="small"
                  label="comment"
                  onChange={onChangeCommentHandler}
                  className={styleClasses.commentTextField}
                />
                <Button
                  onClick={() => {
                    onClickCreateCommentHandler(data);
                  }}
                  className={styleClasses.commentButton}
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
            unmountOnExit
            timeout="auto"
            aria-label="liked by dialog"
          >
            <AppBar sx={{ position: "relative" }}>
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
                  <FavoriteIcon/>
                </IconButton>
              </Toolbar>
            </AppBar>
            <CardContent>
              {/* Should list all of the people who have liked the item */}
              <AllPostLikes postData={post[indexOfCollapse]}/>
            </CardContent>
          </Dialog>

          <Dialog
            open={openShare && indexOfCollapse === index}
            onClose={handleCloseShare}
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
              <Button onClick={()=>handleShare(index)}>Share</Button>
            </DialogActions>
          </Dialog>
        </Card>
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
