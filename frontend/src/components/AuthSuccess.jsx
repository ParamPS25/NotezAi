import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/spinner';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  
  useEffect(() => {
    // If already authenticated or still loading, do nothing yet
    if (loading) return;
    
    if (user) {
      // If we already have user data, just navigate home
      navigate('/');
    } else {
      // Only fetch user if we don't already have the data
      const handleAuth = async () => {
        const success = await fetchUser();
        if (success) {
          navigate('/');
        }
      };
      
      handleAuth();
    }
  }, [user, loading, fetchUser, navigate]);

  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Successful</h2>
        <p>Redirecting you...</p>
        <LoadingSpinner />
      </div>
    </div>
  );
};

export default AuthSuccess;
