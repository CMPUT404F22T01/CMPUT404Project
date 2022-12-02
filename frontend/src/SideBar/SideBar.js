import * as React from "react";

import { styled, useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputBase from '@mui/material/InputBase';
import Dialog from '@mui/material/Dialog'; 
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Slide from '@mui/material/Slide';

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; 
import SearchIcon from '@mui/icons-material/Search';
 
import Post from '../Posts/Post'
import PostCreates from '../Posts/PostCreates';
import Search from '../User/Search';
import Inbox from '../Inbox/Inbox';
import "../SideBar/sidebar.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import axiosInstance from "../utils/axiosInstance";

 

const drawerWidth = 240; 

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const SearchM = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));




const SideBar = () => {
  const [authorData, setAuthorData] = useState([]);
  let authorID =  localStorage.getItem("id");

  useEffect(() => {
    axiosInstance
      .get(`authors/${authorID}/`)
      .then((response) => {
        setAuthorData(response.data);
      })
      .catch((error) => {
        console.error("error in post get ", error);
      });
  }, [])


  let navigate = useNavigate();

  const [searchUser, setSearchUser] = useState(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const handleLogout = () => {
    // How to handle a logout?
    localStorage.clear();
    navigate('/login');
  };

  const handleCloseLogout = () => {
    setLogoutOpen(false);
  };
  const handleOpenLogout = () => {
    setLogoutOpen(true);
  };

  const onChangeSearchHandler = (e) => {
    setSearchUser(e.target.value);
  }
  const onClickInboxHandler = () => {
    setInboxOpen((prevState)=>!prevState)
  }

  const iconData = [
    <AccountCircleIcon className="icon-color" />,
    <InboxIcon className="icon-color"/>,
  ];
  
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [createPost, setCreatePost] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onClickCreatePostHandler = () => {
    setCreatePost((prevState)=>{
      return !prevState;
    }); 
  };
 
  return (
    <Box sx={{ display: "flex"}} >
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar  className="toolbar-color" sx={{ display: "flex", justifyContent: "space-between"}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <SearchM>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={onChangeSearchHandler}
            />
          </SearchM>
          
        </Toolbar>
      </AppBar>
       
      <Drawer variant="permanent" open={open}>
        {/* //the headning of the inside drawer */}
        <DrawerHeader className="listArea-color">
        <Typography variant="h6" noWrap component="div" className="app-name">
            Social Disco
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon className="icon-color" />
            ) : (
              <ChevronLeftIcon className="icon-color" />
            )}
          </IconButton>
          
        </DrawerHeader>
        <Divider />
        <Box
          className="userProfile-Box"
          sx={{
            height: open ? 400 : 200,
            backgroundColor: "#23395d",
             
            // '&:hover': {
            //   backgroundColor: '#23395d',
            //   opacity: [0.9, 0.8, 0.7],
            // },
          }}
        >
          { authorData.profileImage ? 
            <Avatar
            alt={authorData.username+": User's Profile Picture"}
            src={`${authorData.host}`+authorData.profileImage.substring(1)}
            sx={{ 
              width: open ? 90 : 40, 
              height: open ? 90 : 40,
            }}
          />
           : <Avatar
           alt={authorData.username+": User's Profile Picture"}
           src={`${authorData.host}`+authorData.profileImage}
           sx={{ 
             width: open ? 90 : 40, 
             height: open ? 90 : 40,
           }}
         />}
           
          <h4>{open ?  localStorage.getItem("username") : ""}</h4>
        </Box>
        <List className="listArea-color">
          {["Profile", "Inbox"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block", '&:hover':{
              backgroundColor: 'red',
              opacity: [0.3, 0.8, 0.7],
            }}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={index === 0 ? () =>  navigate("/profile") : onClickInboxHandler}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {iconData[index]}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <List className="listArea listArea-color">
          {["Create Post", "Logout"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block",
            '&:hover':{
              backgroundColor: 'red',
              opacity: [0.3, 0.8, 0.7],
            } }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index % 2 === 0 ? (
                    <AddCircleOutlineIcon className="icon-color" onClick={onClickCreatePostHandler}/>
                  ) : (
                    <LogoutIcon className="icon-color" onClick={handleOpenLogout}/>
                  )}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
       
      <Dialog open={createPost}>
          <PostCreates onClickCreatePostHandler={onClickCreatePostHandler}/>
      </Dialog>
      {searchUser ? <Search searchValue={searchUser}></Search> : ""}
      <Dialog
        fullScreen
        open={inboxOpen}
        TransitionComponent={Transition}
      >
        <Inbox onClickInboxHandler={onClickInboxHandler}/>
      </Dialog>
      <Dialog
            open={logoutOpen}
            onClose={handleCloseLogout}
            TransitionComponent={Transition}
            unmountOnExit
            timeout="auto"
            aria-label="logout dialog"
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle sx = {{textAlign: "center"}}>Logout</DialogTitle>
            <DialogContent>

            <DialogActions>
              <Button sx = {{width: "50%", color: "#15172b", '&:hover': { backgroundColor: '#e6ebf5'}}}  onClick={handleCloseLogout}>Cancel</Button>
              <Button sx = {{width: "50%", color: "#fff", backgroundColor: "#23395d", '&:hover': { backgroundColor: '#2f4c7d'}}} variant="contained" onClick={() => handleLogout()}>Confirm</Button>
            </DialogActions>
            </DialogContent>
          </Dialog>
      <Post postReRenderHelper={createPost}></Post>
    </Box>
  );
}

export default SideBar;
