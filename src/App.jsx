import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import AdminRoute from './routes/AdminRoute';
import AddVehicle from './components/AddVehicle';
import EditVehicle from './components/EditVehicle';
import AudiPage from './components/AudiPage';
import SeatPage from './components/SeatPage';
import SkodaPage from './components/SkodaPage';
import VehiclesPage from './components/VehiclesPage';
import VehicleDetails from './components/VehicleDetails';
import PurchaseRequest from './components/PurchaseRequest';
import AdminPurchaseRequests from './components/AdminPurchaseRequests';
import ServiceRequest from './components/ServiceRequest';
import MyServiceRequests from './components/MyServiceRequests';
import AdminServiceRequests from './components/AdminServiceRequests';
import About from './components/About';
import FavoritesPage from './components/FavoritesPage';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="App">
                    <Header />
                    <div className="main-content">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* ADMIN SAMO */}
                            <Route
                                path="/admin/add-vehicle"
                                element={
                                    <AdminRoute>
                                        <AddVehicle />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/vozila/edit/:id"
                                element={
                                    <AdminRoute>
                                        <EditVehicle />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/purchase-requests"
                                element={
                                    <AdminRoute>
                                        <AdminPurchaseRequests />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/service-requests"
                                element={
                                    <AdminRoute>
                                        <AdminServiceRequests />
                                    </AdminRoute>
                                }
                            />

                            {/* SVI OSTALI */}
                            <Route path="/" element={<Home />} />
                            <Route path="/brands/audi" element={<AudiPage />} />
                            <Route path="/brands/seat" element={<SeatPage />} />
                            <Route path="/brands/škoda" element={<SkodaPage />} />
                            <Route path="/vozila" element={<VehiclesPage />} />
                            <Route path="/vozila/:id" element={<VehicleDetails />} />
                            <Route path="/kupnja/:id" element={<PurchaseRequest />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/favorites" element={<FavoritesPage />} />

                            {/* SERVIS RUTE */}
                            <Route path="/servis/novi" element={<ServiceRequest />} />
                            <Route path="/servis/moji" element={<MyServiceRequests />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
