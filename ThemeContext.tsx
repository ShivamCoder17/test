
import { createContext, useState, useMemo, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

type ColorModeContextType = {
  toggleColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) throw new Error('useColorMode must be used within a ColorModeProvider');
  return context;
};

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode as 'light' | 'dark');
    }
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => createTheme(mode === 'light' ? lightTheme : darkTheme), [mode]);

  useEffect(() => {
    document.documentElement.style.backgroundColor = theme.palette.background.default;
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [theme]);

  return (
    <ColorModeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};



