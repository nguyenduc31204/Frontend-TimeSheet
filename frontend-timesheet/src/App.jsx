import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LayoutProvider } from './contexts/LayoutContext';
import './App.css'


function App() {
  return <AppRoutes />;
}

export default App;