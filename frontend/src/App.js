 import './App.css';
import FormCreate from './FormCreate';
import FormLogin from './FormLogin';
import UserProfile from './UserProfile';
import SideBar from './SideBar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
     <>
        <BrowserRouter>
         <Routes>
            <Route element={<SideBar/>} path="/" />
            <Route element={<FormLogin/>} path="/login" />
            <Route element={<FormCreate/>} path="/register" /> 
            <Route element={<UserProfile/>} path="/" />
         </Routes>
        </BrowserRouter>
     </>

  );
}

export default App;
