
import './App.css'
import Add from './components/Add'
import Header from './components/Header'
import {Routes,Route, Navigate} from 'react-router-dom'
import Mainpage from './components/Mainpage'
import { AuthContext } from './store/authContext'
import { useContext,useEffect } from 'react'
import Profile from'./components/Profile'
import Cred from './components/Cred'
import CropImage from './components/CropImage'
import ProfilePic from './components/avatar/ProfilePic'
import DoughnutChart from './components/utils/DoughnutChart'
function App() {

const {user}=useContext(AuthContext)

useEffect(() => {
console.log(user)
}, [user]);

  return (
    <div >
       {user && <Header/> }
      
      <Routes>
      <Route path="/profile" element={user?<Profile/>:<Navigate to="/user/login"/>}></Route>
      <Route path="/user/:id" element={!user?<Cred/>:<Navigate to="/"/>}></Route>
      <Route path="/avatar" element={<ProfilePic/>}></Route>
        <Route path="/:id" element={user?<Add/>:<Navigate to="/user/login"/>}></Route>
        <Route path='/' element={user?<Mainpage/>:<Navigate to="/user/login"/>}></Route>
      <Route path="/chart" element={<DoughnutChart/>}></Route>
      </Routes> 
     
    </div>
  )
}

export default App
