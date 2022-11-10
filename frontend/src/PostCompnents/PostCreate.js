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
 * need to allow custom id post creatation called put
 */

const useStyles = makeStyles({
  submit_btn: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 45,
    padding: "0 30px",
    width: '100%',
  },

  textfields: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,

    marginTop: 0,
    fontWeight: 500,
    backgroundColor: "#303245",
    color: "#fff",
    borderRadius: 10,
  },

  input: {
    color: "#fff",
  },

  textarea: {
    backgroundColor: "#303245",
  },
  paper: {
    background: "red",
    color: "white",
  },
});

const PostCreate = ({ onClickCreatePostHandler }) => {
  //material ui styles
  const styleClasses = useStyles();

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
    // need to uncomment this for forceUpdate to work
    // e.preventDefault();
    let formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("content", contentRef.current.value);
    formData.append("contentType", contentTypeRef.current.value);
    formData.append("visibility", visibilityRef.current.value);
    //https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
    formData.append("image", imageRef.current.files[0] ? imageRef.current.files[0] :  '');
    formData.append("unlisted", unlistedRef.current.value);
    formData.append("source", sourceRef.current.value);
    formData.append("origin", originRef.current.value);
    //authors/6661ee88-5209-45e9-a9ae-eec1434161d0/posts/291c3e11-592b-4a20-b433-e79c6ddc219f/
    axiosInstance
      .post(`authors/${localStorage.getItem("id")}/posts/`, formData)
      .then((response) => {
        //temp need to save user id
        // uses the return repsonse to send a success message (Do same in PostEdit.js)
        console.log(response.status);
      })
      .catch((err) => {
        console.error(err);
      });
    this.forceUpdate();
    onClickCreatePostHandler();
  };

  return (
    <>
      <Box id="modal" component="form" onSubmit={onSubmitHandler}>
        <CloseIcon
          sx={{ size: "large" }}
          className="close-tab"
          onClick={() => onClickCreatePostHandler()}
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
              sx={{
                color: "#fff",
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
              defaultValue={"text/plain"}
              inputRef={contentTypeRef}
              inputProps={{
                name: "Content-Type",
                id: "uncontrolled-native",
              }}
              hidden
            >
              <MenuItem value={"text/markdown"}>text/markdown</MenuItem>
              <MenuItem value={"text/plain"}>text/plain</MenuItem>
              <MenuItem value={"application/base64"}>
                application/base64
              </MenuItem>
              <MenuItem value={"image/jpeg;base64"}>image/jpeg;base64</MenuItem>
              <MenuItem value={"image/png;base64"}>image/png;base64</MenuItem>
            </Select>
          </FormControl>
          <br />
          <TextField
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
              sx={{
                color: "#fff",
                "& .MuiSvgIcon-root": {
                  color: "#fff",
                },
              }}
              defaultValue={"PUBLIC"}
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
              defaultValue={"false"}
              inputProps={{
                name: "unlisted",
                id: "uncontrolled-native",
              }}
              sx={{
                color: "#fff",
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
              inputRef={unlistedRef}
            >
              <MenuItem value={"false"}>false</MenuItem>
              <MenuItem value={"true"}>true</MenuItem>
            </Select>
          </FormControl>
          <br />
          <label htmlFor="image">
            <input
              style={{ display: "none" }}
              id="image"
              name="image"
              accept="image/*"
              type="file"
              ref={imageRef}
            />
            <Fab
              color="primary"
              size="large"
              sx={{ width: "100%" }}
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
            id="outlined-basic"
            label="Source"
            variant="outlined"
            className={styleClasses.textfields}
            InputProps={{
              className: styleClasses.input,
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            inputRef={sourceRef}
          />
          <br />
          <TextField
            id="outlined-basic"
            label="Origin"
            variant="outlined"
            className={styleClasses.textfields}
            InputProps={{
              className: styleClasses.input,
            }}
            InputLabelProps={{
              style: { color: "#fff" },
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

export default PostCreate;
