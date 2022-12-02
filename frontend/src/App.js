import './App.css';
import FormCreate from './Auth/FormCreate';
import FormLogin from './Auth/FormLogin';
import UserProfile from './User/UserProfile';
import Main from './Main';
import ProtectedRoute from './utils/ProtectedRoute';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
 

function App() {
  return (
     <>
        <BrowserRouter>
         <Routes>
            <Route element={
               <ProtectedRoute>
                  <Main/>
               </ProtectedRoute>
            } path="/" />
            <Route element={<FormLogin/>} path="/login" />
            <Route element={<FormCreate/>} path="/register" /> 
            <Route element={
               <ProtectedRoute>
                  <UserProfile/>
               </ProtectedRoute>
            } path="/profile" />
         </Routes>
        </BrowserRouter>
     </>

  );
}

export default App;
