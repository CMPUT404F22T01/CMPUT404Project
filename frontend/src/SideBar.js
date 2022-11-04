import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import "./sidebar.css";

import Post from './PostCompnents/Post'
import PostCreate from './PostCompnents/PostCreate';
 

const drawerWidth = 240;

const iconData = [
  <PersonSearchIcon className="icon-color" />,
  <AccountCircleIcon className="icon-color" />,
  <InboxIcon className="icon-color" />,
];

 

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
    <Box sx={{ display: "flex" }} >
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar  className="toolbar-color">
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
          <Avatar
            alt="Remy Sharp"
            src="https://miro.medium.com/max/775/0*rZecOAy_WVr16810"
            sx={{ 
              width: open ? 90 : 40, 
              height: open ? 90 : 40,
            }}
          />
          <h4>{open ? "username" : ""}</h4>
        </Box>
        <List className="listArea-color">
          {["Search", "Profile", "Inbox"].map((text, index) => (
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
                    <LogoutIcon className="icon-color" />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
       {createPost ? <PostCreate onClickCreatePostHandler={onClickCreatePostHandler}/> : ""}
       <Post></Post>
       </Box>
  );
}

export default SideBar;
