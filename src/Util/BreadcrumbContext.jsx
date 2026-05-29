import { createContext, useContext, useState, useEffect } from 'react';

export const PathContext = createContext();

export const usePath = () => {
  return useContext(PathContext);
};

export default function BreadcrumbProvider({ children }) {
  const [breadcrumb, setBreadcrumb] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const paths = location.pathname.split('/').filter((path) => path);
    setPath(auth);
  }, [path]);

  return (
    <PathContext.Provider value={{ path }}>{children}</PathContext.Provider>
  );
}
