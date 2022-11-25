import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import RememberMeIcon from '@mui/icons-material/RememberMe';
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Dialog from '@mui/material/Dialog';
import MenuList from '@mui/material/MenuList';

import { useNavigate } from "react-router-dom";

import Post from './Posts/Post'
import PostCreates from './Posts/PostCreates';
import Search from './User/Search';


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


function ResponsiveAppBar() {

    let navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [createPost, setCreatePost] = React.useState(false);
  const [searchUser, setSearchUser] = React.useState(null);

  const onChangeSearchHandler = (e) => {
    setSearchUser(e.target.value);
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onClickCreatePostHandler = () => {
    setCreatePost((prevState)=>{
      return !prevState;
    });
  };


  return (
    <Box>
    <AppBar position="fixed">
        <Toolbar>
          <Box display='flex' flexGrow={1}>
          {/* LOGO HERE */}
          <RememberMeIcon sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none"
            }}
          >
            Social Distribution
          </Typography>
          </Box>
          
          <AddCircleOutlineIcon  onClick={onClickCreatePostHandler}/>
          
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

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                {/* USER PROFILE HERE */}
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() =>  navigate("/profile")}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>

            </Menu>
          </Box>
        </Toolbar>
    </AppBar>
    <Dialog open={createPost} >
      <PostCreates onClickCreatePostHandler={onClickCreatePostHandler}/>
    </Dialog>
    {searchUser ? <Search searchValue={searchUser}></Search> : ""}
    <Post></Post>
    </Box>
  );
}
export default ResponsiveAppBar;
