import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface PdfSearchContextType {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

const PdfSearchContext = createContext<PdfSearchContextType | undefined>(undefined);

export const PdfSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 0);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PdfSearchContext.Provider value={{ showSearch, setShowSearch, searchQuery, setSearchQuery, searchInputRef }}>
      {children}
    </PdfSearchContext.Provider>
  );
};

export const usePdfSearch = () => {
  const context = useContext(PdfSearchContext);
  if (context === undefined) {
    throw new Error('usePdfSearch must be used within a PdfSearchProvider');
  }
  return context;
}; 