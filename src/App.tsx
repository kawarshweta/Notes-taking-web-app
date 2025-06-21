import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';

const AppContent: React.FC = () => {
  useKeyboardNavigation();
  return <Layout />;
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;