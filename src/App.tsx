import React from 'react';
import Routes from './routes';
import GlobalStyle from './global/globalStyle';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <> 
      <GlobalStyle />
      <Routes />
    </>
  );
}

export default App;
