import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { Modal, Button, ModalDialog } from 'react-bootstrap'; // Import Modal and Button components
import yourImage from "./register.jpg";

// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX9RkRgsItwXHCaSHDPVu9GERS9HvQx8c",
  authDomain: "face-recognition-system-4ef22.firebaseapp.com",
  projectId: "face-recognition-system-4ef22",
  storageBucket: "face-recognition-system-4ef22.appspot.com",
  messagingSenderId: "1049829103446",
  appId: "1:1049829103446:web:b37f0ef8ceaa5c5e2b28f7",
  measurementId: "G-8MH61KEDZX"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [valid, setValid] = useState(false);
  const [mod, setMod] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner
  
    // Validate form inputs
    if (!validatePassword()) {
      setLoading(false); // Hide loading spinner
      setValid(false);
      setMod(false);
      return;
    }
  
    try {
      // Check if the email and mobile number are new
      const isNewUser = await checkIfNewUser(email, mobileNo);
      
      if (isNewUser) {
        // Create registration details string
        const registrationDetails = `Name: ${name}\nEmail: ${email}\nMobile No.: ${mobileNo}\nPassword: ${password}`;
    
        // Upload registration details as a text file to Firebase Storage
        await uploadRegistrationDetails(registrationDetails);
    
        // Update the 'valid' state to true
        setValid(true);
      } else {
        // Update the 'valid' state to false
        setValid(false);
        setError('User with this email or mobile number already exists');
        setMod(false);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
  
  
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirm_password') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const uploadRegistrationDetails = async (details) => {
    // Create a unique filename for registration details text file
    const filename = `${name}_registration_details.txt`;

    // Upload the registration details text file to Firebase Storage
    const textBlob = new Blob([details], { type: 'text/plain' });
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, textBlob);
  };

  const getRegistrationDetails = async (user) => {
    console.log('User object:', user);
    try {

      // Get the download URL for the file
      const downloadURL = await getDownloadURL(user);
      
      // Fetch the content of the file using the download URL
      const response = await fetch(downloadURL);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error getting registration details:', error);
      return ''; // Return an empty string if there's an error
    }
  };
  
  const checkIfNewUser = async (email, mobileNo) => {
    try {
      // Get a list of all files in Firebase Storage
      const allFiles = await listAll(ref(storage));
  
      // Iterate through all files
      for (const fileRef of allFiles.items) {
        // Check if the file is a text file
        if (!fileRef.name.endsWith('_registration_details.txt')) {
          continue; // Skip files that are not registration details text files
        }
  
        // Download the file
        const userDetails = await getRegistrationDetails(fileRef);
        console.log(userDetails);
        // Check if userDetails is empty or undefined
        if (!userDetails) {
          continue; // Skip this file if userDetails is empty or undefined
        }
  
        // Parse the content of the file
        const userDetailsArray = userDetails.split('\n');
        const userExistingEmail = userDetailsArray.find(detail => detail.includes('Email'));
        const userExistingMobileNo = userDetailsArray.find(detail => detail.includes('Mobile No.'));
  
        // Extract the email and mobile number
        const existingEmail = userExistingEmail.split(': ')[1];
        const existingMobileNo = userExistingMobileNo.split(': ')[1];
  
        // Check if the email or mobile number matches
        if (existingEmail === email || existingMobileNo === mobileNo) {
          return false; // User with this email or mobile number already exists
        }
      }
  
      return true; // New user
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };
  
  return (
    <div style={{ backgroundImage: `url(${yourImage})`, backgroundSize: 'cover', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="container bg-dark border border-info p-4" >
        <h2 className="text-info text-center mb-4">Registration Details</h2>
        <form>
          <div className="row mb-3">
            <label htmlFor="name" className="form-label col-md-2 text-info">Name:</label>
            <div className="col-md-10">
              <input type="text" className="form-control" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="email" className="form-label col-md-2 text-info">Email:</label>
            <div className="col-md-10">
              <input type="email" className="form-control" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="mobileNo" className="form-label col-md-2 text-info">Mobile No.:</label>
            <div className="col-md-10">
              <input type="tel" className="form-control" id="mobileNo" name="mobileNo" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="password" className="form-label col-md-2 text-info">Password:</label>
            <div className="col-md-10">
              <input type={showPassword ? "text" : "password"} className="form-control" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="checkbox" onClick={() => togglePasswordVisibility('password')} className="mt-2" /> <span className="text-info">Show content</span>
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="confirm_password" className="form-label col-md-2 text-info">Confirm Password:</label>
            <div className="col-md-10">
              <input type={showConfirmPassword ? "text" : "password"} className="form-control" id="confirm_password" name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <input type="checkbox" onClick={() => togglePasswordVisibility('confirm_password')} className="mt-2" /><span className="text-info"> Show content</span>
            </div>
          </div>

          <div className="row justify-content-center">
            {!valid && <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                'Check'
              )}
            </button>}
            {valid && <Link type="button" className="btn btn-primary" to={`/image_capture/${name}`}>Register</Link>}
          </div>
        </form>
        <Modal show={!valid && !mod} onHide={() => setMod(true)} centered>
          <Modal.Header closeButton>
            <Modal.Title>ALERT</Modal.Title>
          </Modal.Header>
          <Modal.Body>{error}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMod(true)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Register;
