import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { useSocket } from '../context/SocketContext';
import LoginForm from '../components/Chat/Auth/Login';
import RegisterForm from '../components/Chat/Auth/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { connectSocket } = useSocket();

  const handleSubmit = async (formData) => {
    try {
      let response;
      if (isLogin) {
        response = await AuthService.login(formData.username, formData.password);
      } else {
        response = await AuthService.register(formData.username, formData.password);
      }

      localStorage.setItem('token', response.token);
      connectSocket(response.token);
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        {error && <div className="error-message">{error}</div>}
        
        {isLogin ? (
          <LoginForm onSubmit={handleSubmit} />
        ) : (
          <RegisterForm onSubmit={handleSubmit} />
        )}
        
        <button 
          className="toggle-auth"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;