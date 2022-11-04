import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Fab, Select, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import "./postcreate.css";
import axiosInstance from "../axiosInstance";

import { useRef } from "react";



/**
 * Issues
 * Need to deal with image parts 
 * The blur in UI is out of range
 * The edit part appears on the very top of the page need to deal with it too
 */
const useStyles = makeStyles({
  submit_btn: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
    width: 100,
  },

  textfields: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,
    
    marginTop: 0,
    fontWeight: 500,
    backgroundColor: "#303245",
    color: "white",
    borderRadius: 10,
  },

  input: {
    color: "white",
  },

  textarea: {
    backgroundColor: "#303245",
  },
  paper: {
    background: "red",
    color: "white"
  },
 
});

const PostEdit = ({onClickPostEditHandler, data}) => {
  //material ui styles
  const styleClasses = useStyles();

  console.log(data)

  //react
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const contentTypeRef = useRef(null);
  const unlistedRef = useRef(null);
  const visibilityRef = useRef(null);
  const imageRef = useRef(null);
  const sourceRef = useRef(null);
  const originRef = useRef(null);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    //authors/6661ee88-5209-45e9-a9ae-eec1434161d0/posts/291c3e11-592b-4a20-b433-e79c6ddc219f/
    axiosInstance
      .post(`authors/${localStorage.getItem("id")}/posts/${data.id}/`, {
        title: titleRef.current.value,
        content: contentRef.current.value,
        contentType: contentTypeRef.current.value,
        visibility: visibilityRef.current.value,
        unlisted: unlistedRef.current.value,
        source: sourceRef.current.value,
        origin: originRef.current.value,
      })
      .then((response) => {
        //temp need to save user id
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });

    onClickPostEditHandler();
  };

  return (
    <>
      <Box id="modal" component="form" onSubmit={onSubmitHandler}>
        <CloseIcon
          sx={{ size: "large" }}
          className="close-tab"
          onClick={() => onClickPostEditHandler()}
        />

        <Card className="card-view" style={{ backgroundColor: "#15172b" }}>
          <FormControl fullWidth className={styleClasses.textfields}>
            <InputLabel
              variant="standard"
              htmlFor="contentType"
              className={styleClasses.input}
            >
              Content-Type
            </InputLabel>
            <Select
             sx={{color: "#fff",
             "& .MuiSvgIcon-root": {
                 color: "white",
                 
             }}}
              defaultValue={data.contentType}
              inputRef={contentTypeRef}
              inputProps={{
                name: "Content-Type",
                id: "uncontrolled-native",
              }}
              hidden
            >
              <MenuItem value={"text/markdown"}>text/markdown</MenuItem>
              <MenuItem value={"text/plain"}>text/plain</MenuItem>
              <MenuItem value={"application/base64"}>application/base64</MenuItem>
              <MenuItem value={"image/jpeg;base64"}>image/jpeg;base64</MenuItem>
              <MenuItem value={"image/png;base64"}>image/png;base64</MenuItem>
            </Select>
          </FormControl>
          <br />
          <TextField
            defaultValue={data.title}
            id="outlined-basic"
            label="Title"
            variant="outlined"
            className={styleClasses.textfields}
            InputProps={{
              className: styleClasses.input,
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            inputRef={titleRef}
          />
          <br />
          <TextareaAutosize
            defaultValue={data.content}
            aria-label="Content"
            minRows={10}
            style={{ width: "100%" }}
            placeholder="content"
            ref={contentRef}
            className={styleClasses.textfields}
            
          />
          <br />
          <FormControl fullWidth className={styleClasses.textfields}>
            <InputLabel
              variant="standard"
              htmlFor="visibility"
              className={styleClasses.input}
            >
              Visibility
            </InputLabel>
            <Select 
             sx={{color: "#fff",
             "& .MuiSvgIcon-root": {
                 color: "white",
             }}}
              defaultValue={data.visibility}
              inputProps={{
                name: "visibility",
                id: "uncontrolled-native",
              }}
              inputRef={visibilityRef}
            >
              <MenuItem value={"PUBLIC"}>public</MenuItem>
              <MenuItem value={"FRIENDS"}>friends</MenuItem>
            </Select>
          </FormControl>
          <br />
          <FormControl fullWidth className={styleClasses.textfields}>
            <InputLabel
              variant="standard"
              htmlFor="Unlisted"
              className={styleClasses.input}
            >
              Unlisted
            </InputLabel>
            <Select 
              defaultValue={data.unlisted}
              inputProps={{
                name: "unlisted",
                id: "uncontrolled-native",
                 
              }}
              sx={{color: "#fff",
              "& .MuiSvgIcon-root": {
                  color: "white",
              }}}
              inputRef={unlistedRef}
            >
              <MenuItem value={"false"}>false</MenuItem>
              <MenuItem value={"true"}>true</MenuItem>
            </Select>
          </FormControl>
          <br />
          <label htmlFor="upload-image" >
            <input
              style={{ display: "none" }}
              id="upload-image"
              name="upload-image"
              type="file"
              ref={imageRef}
            />
            <Fab
              color="primary"
              size="large"
              sx={{width: "100%"}}
              component="span"
              aria-label="add"
              variant="extended"
            >
              <AddIcon />
              upload image
            </Fab>
          </label>
          <br />
          <TextField
            defaultValue={data.source}
            id="outlined-basic"
            label="Source"
            variant="outlined"
            className={styleClasses.textfields}
            InputProps={{
              className: styleClasses.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            inputRef={sourceRef}
          />
          <br />
          <TextField
            defaultValue={data.origin}
            id="outlined-basic"
            label="Origin"
            variant="outlined"
            className={styleClasses.textfields}
            InputProps={{
              className: styleClasses.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            inputRef={originRef}
          />
          <br />
        </Card>
        <br />

        <Button type="submit" className={styleClasses.submit_btn}>
          Post
        </Button>
      </Box>
      <div className="blur"></div>
    </>
  );
};

export default PostEdit;
