import * as React from "react";
import { useRef } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { Fab, Select, MenuItem } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { makeStyles } from "@mui/styles";
import axiosInstance from "../utils/axiosInstance";

const useStyles = makeStyles({
  submit_btn: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "#fff",
    height: 45,
    padding: "0 30px",
    width: "100%",
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
 
    color: "#fff",
  },
  closeTab: {
    background: "transparent",
    fontSize: "40px",
    position: "relative",
    left: "90%",
    cursor: "pointer",
    fontWeight: "bold",
  },
});

export default function PostCreates({ onClickCreatePostHandler }) {
  const styleClasses = useStyles();
  //react
  const customPostIdRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const contentTypeRef = useRef(null);
  const categoriesRef = useRef(null);
  const unlistedRef = useRef(null);
  const visibilityRef = useRef(null);
  const imageRef = useRef(null);
  const sourceRef = useRef(null);
  const originRef = useRef(null);

  const onSubmitHandler = async (e) => {
    //https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
    // Regular expression to check if string is a valid UUID
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    let url = `authors/${localStorage.getItem("id")}/posts/`;
    let method = "POST";
    // need to uncomment this for forceUpdate to work
    e.preventDefault();

    let formData = new FormData();
    if (regexExp.test(customPostIdRef.current.value)) {
      method = "PUT";
      url += customPostIdRef.current.value;
      url += "/";
    }
    formData.append("title", titleRef.current.value);
    formData.append("content", contentRef.current.value);
    formData.append("contentType", contentTypeRef.current.value);
    formData.append("categories", categoriesRef.current.value);
    formData.append("visibility", visibilityRef.current.value);
    //https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
    formData.append(
      "image",
      imageRef.current.files[0] ? imageRef.current.files[0] : ""
    );
    formData.append("unlisted", unlistedRef.current.value);
    formData.append("source", sourceRef.current.value);
    formData.append("origin", originRef.current.value);

    try {
      const postCreateResponse = await axiosInstance({
        method: method,
        url: url,
        data: formData,
      });

      const followerData = await axiosInstance.get(
        `authors/${localStorage.getItem("id")}/followers`
      );

      await followerData.data.items.forEach((follower) => {
        axiosInstance.post(
          `authors/${follower.id.split("authors/")[1]}/inbox`,
          postCreateResponse.data
        );
      });
    } catch (error) {
      console.error(error);
    }
    
    // axiosInstance({ method: method, url: url, data: formData })
    //   .then((response) => {
    //     //temp need to save user id
    //     // uses the return repsonse to send a success message (Do same in PostEdit.js)
    //     return response.data
    //   }).then((postresponse) => {
    //     axiosInstance.get(`authors/${localStorage.getItem("id")}/followers`)
    //     .then((response) => {
    //       for (let  follower of response.data.items){
    //           axiosInstance.post(
    //             `authors/${follower.id.split("authors/")[1]}/inbox`,
    //              postresponse
    //           )
    //           .then((response) => {
    //             console.log(response.data)
    //           }).catch((error) => {
    //             console.error(error)
    //           })
    //       }
    //     })
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

    onClickCreatePostHandler();
  };

  return (
    <>
      <DialogTitle
        sx={{ width: "100%", backgroundColor: "#15172b", color: "#fff" }}
      >
        <CloseIcon
          sx={{ size: "large" }}
          className={styleClasses.closeTab}
          onClick={() => onClickCreatePostHandler()}
        />
        Create Post
      </DialogTitle>
      <DialogContent sx={{ width: 600, backgroundColor: "#15172b" }}>
        <Box
          className="card-view"
          component="form"
          onSubmit={onSubmitHandler}
          sx={{ backgroundColor: "#15172b" }}
        >
          <TextField
            id="outlined-basic"
            label="Custom Id(optional)"
            variant="outlined"
            className={styleClasses.textfields}
            InputProps={{
              className: styleClasses.input,
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            inputRef={customPostIdRef}
          />
          <br />
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
                  color: "#fff",
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
            placeholder="Write Content Here"
            ref={contentRef}
            className={styleClasses.textfields}
          />
          <br />
          <TextField
            id="outlined-basic"
            label="Categories"
            variant="outlined"
            className={styleClasses.textfields}
            InputProps={{
              className: styleClasses.input,
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            inputRef={categoriesRef}
          />
          <br/>
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

          <DialogActions>
            <Button type="submit" className={styleClasses.submit_btn}>
              Post
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </>
  );
}
