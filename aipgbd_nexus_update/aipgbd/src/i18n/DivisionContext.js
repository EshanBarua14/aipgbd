import { createContext, useContext, useState, useEffect } from 'react';

const DivisionContext = createContext(null);

export function DivisionProvider({ children }) {
  const [division, setDivision] = useState(null); // null = nexus, 'studios', 'systems'

  useEffect(() => {
    const root = document.documentElement;
    if (division) {
      root.setAttribute('data-division', division);
    } else {
      root.removeAttribute('data-division');
    }
  }, [division]);

  return (
    <DivisionContext.Provider value={{ division, setDivision }}>
      {children}
    </DivisionContext.Provider>
  );
}

export function useDivision() {
  return useContext(DivisionContext);
}
