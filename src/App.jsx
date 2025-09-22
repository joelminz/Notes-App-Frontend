import Head from "./components/Head";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AddForm from "./pages/AddForm";
import NoteDetails from "./pages/NoteDetails";
import EditForm from "./pages/EditForm";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Head />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/add" element={
                        <ProtectedRoute>
                            <AddForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/details/:id" element={
                        <ProtectedRoute>
                            <NoteDetails />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit/:id" element={
                        <ProtectedRoute>
                            <EditForm />
                        </ProtectedRoute>
                    } />
                    
                    {/* Catch all route - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
