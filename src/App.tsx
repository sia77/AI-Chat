import { useEffect } from 'react';
import './App.css'
import { ChatWindow } from './components/ChatWindow'
import { initGA, logPageView } from './utils/google/analytics';


function App() { 

  useEffect(()=>{
    initGA();
  },[]);

  useEffect(()=>{
    const path = window.location.pathname + window.location.search;
    logPageView(path )
  },[location]);

  return (
    <>      
      <ChatWindow />
    </>
  )
}

export default App
