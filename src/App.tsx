import React from 'react';
import AppRouter from './components/AppRouter';

interface AppProps {
  RouterComponent?: React.ComponentType;
}

const App: React.FC<AppProps> = ({ RouterComponent }) => {
  const Router = RouterComponent || AppRouter;
  return <Router />;
};

export default App;
