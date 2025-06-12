import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import AdminRoute from './routes/AdminRoute';
import AddVehicle from './components/AddVehicle';
import AudiPage from './components/AudiPage';
import SeatPage from './components/SeatPage';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/admin/add-vehicle"
                        element={
                            <AdminRoute>
                                <AddVehicle />
                            </AdminRoute>
                        }
                    />
                    {/* Dodano: Audi brand page */}
                    <Route path="/brands/audi" element={<AudiPage />} />
                    <Route path="/brands/seat" element={<SeatPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
