import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userToken,  setUserToken]  = useState(() => localStorage.getItem('userToken'));
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));

  const loginUser = (token) => { localStorage.setItem('userToken', token);  setUserToken(token);  };
  const loginAdmin = (token) => { localStorage.setItem('adminToken', token); setAdminToken(token); };

  const logoutUser  = () => { localStorage.removeItem('userToken');  setUserToken(null);  };
  const logoutAdmin = () => { localStorage.removeItem('adminToken'); setAdminToken(null); };

  return (
    <AuthContext.Provider value={{ userToken, adminToken, loginUser, loginAdmin, logoutUser, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
