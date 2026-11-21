
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Register from './auth-page/Register'
import Landing from './Landing'
import MainPage from './MainPage'
import Login from './auth-page/Login'
import ForgotPassword from './auth-page/ForgotPassword'
import ResetPassword from './auth-page/ResetPassword'
import CWorkspace from './workspace/CWorkspace'
import { useState } from 'react'
import Workspaces from './workspace/Workspaces'
import Dashboard from './workspace/Dashboard'

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')))

  return (
    <>
      <Routes>

        <Route element={<MainPage isAuthenticated={isAuthenticated} />} >
          <Route path='/' element={<Landing />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/workspace' element={<CWorkspace />} />
        </Route>
        <Route path='/workspaces' element={<Workspaces />} />
        <Route path='/workspace/:id' element={<Dashboard />} />
      </Routes>

    </>
  )
}

export default App