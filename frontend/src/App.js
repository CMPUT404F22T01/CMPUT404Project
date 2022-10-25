import logo from './logo.svg';
import './App.css';
import FormCreate from './FormCreate';
import FormLogin from './FormLogin';
import UserProfile from './UserProfile';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
     <>
        <BrowserRouter>
         <Routes>
            <Route element={<FormLogin/>} path="/login" />
            <Route element={<FormCreate/>} path="/register" /> 
            <Route element={<UserProfile/>} path="/" />
         </Routes>
        </BrowserRouter>
     </>

  );
}

export default App;
