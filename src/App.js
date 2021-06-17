import './App.css';

import Phrases from './components/Phrases';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='container p-4'>
      <div className='row'>
        <Phrases />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
