import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

export default function Head() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    
    const linkStyle = {
        textDecoration: 'none',
        color: '#f5400f'
    }

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of your account',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/login', { replace: true });
                Swal.fire({
                    title: 'Logged out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    };

    return (
        <nav>
            <div className="logo">
                <Link to={'/'} style={linkStyle}><h2>Note App</h2></Link>
            </div>
            <div className="action">
                {isAuthenticated ? (
                    <>
                        <span style={{ marginRight: '15px', color: '#666' }}>
                            Welcome, {user?.username}
                        </span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: '10px' }}>
                            <button>Login</button>
                        </Link>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
