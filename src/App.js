import './App.css';
import '../src/frontend_components/main.css';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Navbar from './frontend_components/Navbar';
import Register from './frontend_components/Register';
import Image_capture from './frontend_components/Image_capture';
import Analayze from './frontend_components/Analayze';
import Home from './frontend_components/Home';
// import Usecase from './frontend_components/Usecase';
import OTPAuthentication from './frontend_components/Otp';

function App() {
  return (
    <div className="App" style={{ overflow: 'hidden' }}>
      <Router>
      <Routes>
        <Route exact path ='/' element ={<><Navbar></Navbar><Home></Home></>}></Route>
        <Route exact path ='/register' element ={<><Navbar></Navbar><Register></Register></>}></Route>
        <Route exact path ='/image_capture/:name' element ={<><Navbar></Navbar><Image_capture></Image_capture></>}></Route>
        <Route exact path ='/analyze_video' element ={<><Navbar></Navbar><Analayze></Analayze></>}></Route>
        {/* <Route exact path ='/Usecase' element ={<><Navbar></Navbar><Usecase></Usecase></>}></Route> */}
        <Route exact path ='/MFA/:recognizedName' element ={<><Navbar></Navbar><OTPAuthentication></OTPAuthentication></>}></Route>
      </Routes>
      </Router>
      
    </div>
  );
}

export default App;
