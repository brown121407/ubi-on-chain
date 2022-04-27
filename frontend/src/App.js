import './App.css';
import UBI from './components/UBI';
import UBIContextProvider from './components/UBIContextProvider';

function App() {
  return (
    <UBIContextProvider>
      <UBI/>
    </UBIContextProvider>
  );
}

export default App;
