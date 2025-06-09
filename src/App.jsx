import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
            <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
