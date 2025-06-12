// src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import FeedPage from './pages/FeedPage'
import PostDetail from './pages/PostDetail'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/login')
    else navigate('/feed')
  }, [token])

  const handleLogin = (jwt) => {
    localStorage.setItem('token', jwt)
    setToken(jwt)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/feed" element={<FeedPage token={token} onLogout={handleLogout} />} />
      <Route path="/post/:id" element={<PostDetail token={token} />} />
    </Routes>
  )
}
