import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment"; 
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert"; 
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import PostEdit from "./PostEdit";
import Comment from "./Comment";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Dialog from '@mui/material/Dialog';
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
    margin: '0 auto',
     
    borderRadius: 10,
  },
  cardHeader: {
     
  },
  commentContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
  }, 
  commentTextField: {
    height: 40,
    width: "50%",
  }, 
  commentButton: {
     width: "20%",
     height: 40,
     borderRadius: 10,
   
     '&:hover':{
      backgroundImage:     "linear-gradient( to right,  #E7484F, #E7484F 16.65%,  #F68B1D 16.65%,     #F68B1D 33.3%,     #FCED00 33.3%,      #FCED00 49.95%,      #009E4F 49.95%,       #009E4F 66.6%,       #00AAC3 66.6%,   #00AAC3 83.25%,   #732982 83.25%,  #732982 100%,  #E7484F 100% )",
      animation:'slidebg 2s linear infinite'
     }
  }
});

export default function Post() {

  const styleClasses = useStyles()

  const [expanded, setExpanded] = React.useState(false);
  const [post, setPost] = useState([]);
   
  const [comment, setComment] = useState(null);
  const [indexOfCollapse, setIndexOfCollapse] = useState(null);
  //this reRenderHelper is used to re render the comment component (expensive maybe!!)
  const [reRenderHelper, setReRenderHelper] = useState(false);
   

  //this two are for the editPost and PostEdit prop
  //indexToEdit is used to get the index clicked happened and pass post at that index as prop to the PostEdit
  const [postEdit, setPostEdit] = useState(false);
  const [indexToEdit, setIndexToEdit] = useState(false);

  const onChangeCommentHandler = (e) => {
    setComment(e.target.value);
  }

  const onClickCreateCommentHandler = (data) => {
    // console.log(commentRef.current);
    // doubt why does the useRef gives an empty value and why the ... warning 
    axiosInstance
      .post(`authors/${localStorage.getItem("id")}/posts/${data.id.split('posts/')[1]}/comments`, {
        'comment': comment, 
      })
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error);
      });
      setComment("");  
      setReRenderHelper((prevState)=> !prevState);
  };

  //handler for the edit button click
  const onClickPostEditHandler = (index_to_edit=-1) => {
    if(index_to_edit !== -1){
      setIndexToEdit(index_to_edit);
    } 
    setPostEdit((prevState) => !prevState);
  };

  //how to handle a like??
  const onClickLikeHandler = (index) => {
    // axiosInstance.post(``)
  };

  const handleExpandClick = (index) => {
    if(indexOfCollapse === index){
      setIndexOfCollapse(null);
    }else{
      setIndexOfCollapse(index);
    }
    setExpanded(!expanded);
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
  }, []);

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
                {data.author.id.split('authors/')[1] === localStorage.getItem("id") ? (
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
            <IconButton aria-label="add to favorites">
              <FavoriteIcon onClick={() => onClickLikeHandler(index)} />
            </IconButton>
            <IconButton aria-label="share"> 
                <CommentIcon onClick={() => {handleExpandClick(index)}}/> 
            </IconButton>
          </CardActions>
         
          <Collapse in={indexOfCollapse === index} timeout="auto" unmountOnExit>
            <CardContent>
              <Box className={styleClasses.commentContainer}>
                {/* commentRef does not work */}
                <TextField value={comment} size="small" label="comment" onChange={onChangeCommentHandler} className={styleClasses.commentTextField}
                />  
                <Button onClick={() => {
                  onClickCreateCommentHandler(data);
                }} className={styleClasses.commentButton}>Post</Button>
              </Box>
              <Comment postData={data} reRenderHelper={reRenderHelper} />
            </CardContent>
          </Collapse>
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
      <Dialog open={postEdit} >
        <PostEdit
          onClickPostEditHandler={onClickPostEditHandler}
          data={post[indexToEdit]}
        />
        </Dialog>
    </Box>
  );
}
