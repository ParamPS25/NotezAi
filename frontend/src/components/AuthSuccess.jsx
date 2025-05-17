import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/spinner';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { user, loading, fetchUser } = useAuth();  

  useEffect(() => {
    const handleAuth = async () => {
      if (loading) return; 

      // If we already have the user, navigate home
      if (user) {
        navigate('/');
        return;
      }

      // Otherwise, attempt to fetch user info
      const success = await fetchUser();
      if (success) {
        navigate('/');
      }
    };

    handleAuth();
  }, [user, loading, fetchUser, navigate]);

  // Fallback for the loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

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
