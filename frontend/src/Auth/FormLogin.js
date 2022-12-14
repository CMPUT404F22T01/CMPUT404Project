import { useRef, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
 
import axiosInstance from '../utils/axiosInstance'

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField'; 
// import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const FormLogin = () => {
    const navigate = useNavigate();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
 

    const [loginFail, setLoginFail] = useState(false);

    // triggers warning for 5 secs.. on incorrect password or username
    useEffect(() => {
      const t = setTimeout(() => {
         setLoginFail(false);
      }, 5000)

      return () => {
        clearTimeout(t)
      }
    }, [loginFail])

 
    const onSubmitHandler = (e) => {

        e.preventDefault();
        
        axiosInstance.post('login/', {
            'username': usernameRef.current.value,
            'password': passwordRef.current.value

        }).then((response) => {
            //temp need to save user id
           
            localStorage.setItem('id', response.data.id);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            navigate("/", {state:{response: response.data}})

        }).catch((err) => {
            setLoginFail(true);
             // console.error(err)
        })
    } 
    function Copyright(props) {
        return (
          <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright ?? '}
            <Link color="inherit" href="https://mui.com/">
              Social Disco
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        );
      }

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: 'url(https://picsum.photos/1920/1080/)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, backgroundColor: "#23395d" }}>
                  <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={onSubmitHandler} sx={{ mt: 1 }}>
                  {loginFail ? <Alert severity='error'>Incorrect Password or Username.</Alert> : ""} 
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="email"
                    autoComplete="username"
                    autoFocus 
                    inputRef={usernameRef}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password" 
                    inputRef={passwordRef}
                  />
                
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor: "#23395d", '&:hover': { backgroundColor: '#2f4c7d'}}}
                     
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    {/* <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid> */}
                    <Grid item>
                      <Link href="" variant="body2" onClick={() => navigate("../register/")}>
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      );
    }

export default FormLogin