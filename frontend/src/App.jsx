import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import {Router, Route, Routes, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'
import {Loader} from "lucide-react"
import {React} from 'react'
import {Toaster} from 'react-hot-toast'
import { useSocketMessageHandler } from "./hooks/useSocketMessageHandler.js";


function App() {
  const {authUser,checkAuth, isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();
  useSocketMessageHandler();
  console.log({onlineUsers});
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);
  console.log({authUser});
  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path = '/' element={authUser? <HomePage/> : <Navigate to='/login'/>} />
        <Route path = '/signup' element={!authUser? <SignUpPage/>: <Navigate to = "/"/>} />
        <Route path = '/login' element={!authUser?<LoginPage/> : <Navigate to = "/"/>} />
        <Route path = '/settings' element={<SettingsPage/>} />
        <Route path = '/profile' element={authUser? <ProfilePage/> : <Navigate to='/login'/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
