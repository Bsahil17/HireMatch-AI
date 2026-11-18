import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, id, fullName, role } = res.data;
    const userData = { id, email, fullName, role };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, id, fullName, role, email } = res.data;
    const userData = { id, email, fullName, role };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const demoLogin = async (roleType) => {
    let email = 'sarah.recruiter@hirematch.ai';
    if (roleType === 'CANDIDATE') email = 'alex.rivera@example.com';
    else if (roleType === 'ADMIN') email = 'admin@hirematch.ai';
    else if (roleType === 'RECRUITER_2') email = 'david.chen@hirematch.ai';
    else if (roleType === 'CANDIDATE_AI') email = 'samantha.wu@example.com';

    return await login(email, 'Password@123');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin, isRecruiter: user?.role === 'RECRUITER', isCandidate: user?.role === 'CANDIDATE', isAdmin: user?.role === 'ADMIN' }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
