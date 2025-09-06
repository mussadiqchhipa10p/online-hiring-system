import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { setUser } from '../store/slices/authSlice';
import { LoadingSpinner } from '@online-hiring-system/ui';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=oauth_failed');
      return;
    }

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Decode token to get user info (basic implementation)
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const user = {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
          name: payload.name || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        dispatch(setUser(user));
        navigate('/dashboard');
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login?error=token_invalid');
      }
    } else {
      navigate('/login?error=missing_tokens');
    }
  }, [navigate, dispatch, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};
