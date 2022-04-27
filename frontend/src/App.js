import './App.css';
import UBI from './components/UBI';
import UBIContextProvider from './components/UBIContextProvider';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <UBIContextProvider>
      <Toaster/>
      <UBI/>
    </UBIContextProvider>
  );
}

export default App;
