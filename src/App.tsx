import { useEffect } from 'react';
import './App.css'
import { ChatWindow } from './components/ChatWindow'
import { initGA, logPageView } from './utils/google/analytics';
import { useLocation } from 'react-router-dom';

function App() {

  const location = useLocation();

  useEffect(()=>{
    initGA();
  },[]);

  useEffect(()=>{
    logPageView(location.pathname + location.search )
  },[location]);

  return (
    <>      
      <ChatWindow />
    </>
  )
}

export default App
