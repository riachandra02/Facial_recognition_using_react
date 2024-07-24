import React, { useRef, useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, getMetadata, updateMetadata } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import { Modal, Spinner, Image } from 'react-bootstrap'; // Import react-bootstrap components
import axios from 'axios'; // Import axios for making HTTP requests
import yourImage from "./register.jpg";
const storage = getStorage();

function ImageCapture() {
  const { name } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageCount, setImageCount] = useState(0);
  const [showGenerateQR, setShowGenerateQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [totp, setTotp] = useState('');
  const [cameraOn, setCamerOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false); // Track if QR code has been generated

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(error => console.error('Error accessing camera:', error));
    setCamerOn(true);
  };

  const captureImage = () => {
    setLoading(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    const filename = `${name}_${imageCount + 1}.png`;

    const byteCharacters = atob(imageData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const imageBlob = new Blob([byteArray], { type: 'image/png' });

    const storageRef = ref(storage, filename);
    uploadBytes(storageRef, imageBlob).then(snapshot => {
      console.log('Image uploaded successfully');
      setImageCount(prevCount => prevCount + 1);
      setLoading(false);
    }).catch(error => {
      console.error('Error uploading image:', error);
      setLoading(false);
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let requestId;

    const drawFrame = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestId = requestAnimationFrame(drawFrame);
    };

    const startDrawing = () => {
      if (video.srcObject) {
        video.play();
        drawFrame();
      }
    };

    startDrawing();

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  useEffect(() => {
    if (imageCount === 15) {
      setShowGenerateQR(true);
    }
  }, [imageCount]);

  const generateQR = async () => {
    try {
      const response = await axios.get('http://localhost:5000/generate-secret');
      setTotp(response.data.secret);
      setQrCodeUrl(response.data.qrCodeUrl);
      setQrGenerated(true); // Set QR generated to true

      // Append TOTP value to registration details file
      const storageRef = ref(storage, `${name}_registration_details.txt`);
      const metadata = await getMetadata(storageRef);
      const downloadURL = await getDownloadURL(storageRef);
      const currentDetailsResponse = await fetch(downloadURL);
      const currentDetailsText = await currentDetailsResponse.text();
      const updatedDetailsText = `${currentDetailsText}\nTOTP: ${response.data.secret}`;
      const updatedDetailsBlob = new Blob([updatedDetailsText], { type: 'text/plain' });
      await uploadBytes(storageRef, updatedDetailsBlob, { contentType: 'text/plain' });
      
      // Update metadata to reflect changes
      await updateMetadata(storageRef, { customMetadata: { ...metadata.customMetadata, totp: response.data.secret } });
    } catch (error) {
      console.error('Error generating secret:', error);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${yourImage})`, backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="container-xl text-info bg-dark border border-info" style={{ maxWidth: '800px', padding: '20px' }}>
        {showGenerateQR && (
          <div>
            {qrCodeUrl && <Image src={qrCodeUrl} alt="QR Code" className="my-3" style={{ margin: "10px" }} />}
            {qrGenerated && <p style={{ textAlign: 'center', marginBottom: '20px' }}>Scan the QR code in Google Authenticator mobile app</p>}
          </div>
        )}
        {!showGenerateQR && (
          <div>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>Click on "Start Camera" to start your camera</p>
            <div style={{ textAlign: 'center' }}>
              {cameraOn && <button className="btn bg-dark text-info border border-info" onClick={captureImage} style={{ margin: "10px auto", display: 'block' }}>Capture Image ({15 - imageCount} remaining)</button>}
              <video ref={videoRef} autoPlay muted style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
              <canvas ref={canvasRef} width={400} height={300} style={{ display: 'none' }}></canvas>
              <button className="btn bg-dark text-info border border-info" onClick={startCamera} style={{ margin: "10px auto", display: 'block' }}>Start Camera</button>
              {loading && <Modal show={loading} onHide={() => {}} backdrop="static" keyboard={false} centered>
                <Modal.Body>
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" variant="primary" />
                    <p>Uploading image</p>
                  </div>
                </Modal.Body>
              </Modal>}
            </div>
          </div>
        )}
        {showGenerateQR && (
          <button className="btn bg-dark text-info border border-info" onClick={generateQR} disabled={qrGenerated} style={{ margin: "10px auto", display: 'block' }}>Generate QR</button>
        )}
      </div>
    </div>
  );
}

export default ImageCapture;
