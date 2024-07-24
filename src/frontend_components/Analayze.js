import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { initializeApp } from 'firebase/app';
import { Link } from 'react-router-dom';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { Modal, Spinner, ProgressBar, Button } from 'react-bootstrap';

const Analyze = () => {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureVideo, setCaptureVideo] = useState(false);
    const [recognizedName, setRecognizedName] = useState(null);
    const [recognitionActive, setRecognitionActive] = useState(false);
    const [cameraOn, setCameraOn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(35);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showNotAuthenticatedModal, setShowNotAuthenticatedModal] = useState(false);
    const [showNotDetectedModal, setShowNotDetectedModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showGuidelines, setShowGuidelines] = useState(true);

    const videoRef = useRef();
    const canvasRef = useRef();
    const recognitionTimeout = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models'),
                faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
            ]);
            setModelsLoaded(true);
        };
        loadModels();
    }, []);

    useEffect(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyCX9RkRgsItwXHCaSHDPVu9GERS9HvQx8c",
  authDomain: "face-recognition-system-4ef22.firebaseapp.com",
  projectId: "face-recognition-system-4ef22",
  storageBucket: "face-recognition-system-4ef22.appspot.com",
  messagingSenderId: "1049829103446",
  appId: "1:1049829103446:web:b37f0ef8ceaa5c5e2b28f7",
  measurementId: "G-8MH61KEDZX"
        };
        initializeApp(firebaseConfig);
    }, []);

    useEffect(() => {
        if (recognizedName) {
            const redirectTimer = setInterval(() => {
                setTimeLeft(prevTimeLeft => {
                    if (prevTimeLeft === 0) {
                        clearInterval(redirectTimer);
                    }
                    return prevTimeLeft - 1;
                });
            }, 1000);
            return () => clearInterval(redirectTimer); // Cleanup function
        }
    }, [recognizedName]);

    useEffect(() => {
        if (timeLeft === 0) {
            window.location.href = `/MFA/${recognizedName}`;
        }
    }, [timeLeft]);

    const startVideo = () => {
        setShowGuidelines(false);
        setCaptureVideo(true);
        setRecognitionActive(true);
        setCameraOn(true);
        setShowLoadingModal(true);
        recognitionTimeout.current = setTimeout(() => {
            setShowNotDetectedModal(true);
            stopRecognition();
        }, 20000);
    };

    const stopRecognition = () => {
        clearTimeout(recognitionTimeout.current);
        setCaptureVideo(false);
        setRecognitionActive(false);
        setCameraOn(false);
        setShowLoadingModal(false);
    };

    const handleVideoOnPlay = async () => {
        if (modelsLoaded && recognitionActive) {
            try {
                const video = videoRef.current.video;
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                if (detections.length > 0) {
                    setLoading(false);
                    clearTimeout(recognitionTimeout.current);
                    const recognizedName = await recognizeFace(detections);
                    if (recognizedName) {
                        setProgress(100);
                        const displayName = recognizedName.split('_')[0];
                        setRecognizedName(displayName);
                    } else {
                        setShowNotAuthenticatedModal(true);
                    }
                } else {
                    // No face detected
                    setLoading(false);
                    setShowNotDetectedModal(true);
                }
            } catch (error) {
                console.error("Error in face detection:", error);
            }
        }
    };
    

    useEffect(() => {
        handleVideoOnPlay();
    }, [modelsLoaded, recognitionActive]);

    const recognizeFace = async (detections) => {
        const storage = getStorage();
        const rootRef = ref(storage, '/');
        const imagesList = await listAll(rootRef);
        const totalImages = imagesList.items.length;
        const cachedImages = {};
        let processedImagesCount = 0;
        setProgress(35);
        
        for (const imageRef of imagesList.items) {
            if (imageRef.name && /\.(jpg|jpeg|png|gif)$/i.test(imageRef.name)) {
                if (!cachedImages[imageRef.name]) {
                    const url = await getDownloadURL(imageRef);
                    const img = await faceapi.fetchImage(url);
                    cachedImages[imageRef.name] = img;
                    processedImagesCount++;
                    const progressPercentage = ((processedImagesCount / totalImages) * 65) + 35; // Adjusted to start from 35
                setProgress(Math.min(Math.max(progressPercentage, 35), 100)); // Ensure progress starts from 35 and stays within 35 to 100
                }
                const img = cachedImages[imageRef.name];
                const faceDetection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                if (faceDetection) {
                    const distanceThreshold = 0.5;
                    const detectionsWithDescriptors = detections.filter(det => det.descriptor);
                    for (const det of detectionsWithDescriptors) {
                        const distance = faceapi.euclideanDistance(det.descriptor, faceDetection.descriptor);
                        if (distance < distanceThreshold) {
                            return imageRef.name;
                        }
                    }
                }
            } else {
                console.log("Image is not a valid image file.");
            }
        }
        return null;
    };
    
    const handleModalClose = () => {
        setShowNotDetectedModal(false);
        startVideo();
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
             {showGuidelines && ( <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', maxWidth: '800px', width: '100%', boxSizing: 'border-box' }}>
            <h1 style={{ marginBottom: '20px', color: '#007bff' }}>Face Recognition Guidelines</h1>
            <ul>
                        <li>Ensure Adequate Lighting</li>
                        <li>Position Your Face in the Middle</li>
                        <li>Maintain a Neutral Expression</li>
                        <li>Remove Accessories That Obscure Facial Features</li>
                        <li>Stay Still</li>
                        <li>Avoid Obstructions</li>
                        <li>Keep a Clean Face</li>
                        <li>Allow Sufficient Time for Recognition</li>
                        <li>Be Patient</li>
                        <li>Privacy and Security</li>
                    </ul>
                    </div>)}
            <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', maxWidth: '800px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
    {!captureVideo && (
        <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '20px', border: 'none', borderRadius: '10px' }}>
            Open Webcam
        </button>
    )}
</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {captureVideo ?
                        modelsLoaded ?
                            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                <Webcam
                                    ref={videoRef}
                                    width={800}
                                    height={600}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: 'user' }}
                                    onUserMedia={() => setCameraOn(true)}
                                    onPlay={handleVideoOnPlay}
                                />
                                <canvas ref={canvasRef} width={800} height={600} style={{ position: 'absolute', borderRadius: '10px' }} />
                            </div> :
                            <div style={{ textAlign: 'center', color: '#007bff' }}>Loading models...</div> :
                        null
                    }
                </div>
                <Modal show={showLoadingModal && loading} onHide={() => {}} backdrop="static" keyboard={false} centered>
                    <Modal.Body>
                        <div style={{ textAlign: 'center' }}>
                            <Spinner animation="border" variant="primary" />
                            <p>Loading...</p>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={showNotAuthenticatedModal} onHide={() => setShowNotAuthenticatedModal(false)} centered>
                    <Modal.Body>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'red', fontSize: '20px' }}>Not Authenticated</p>
                            <Link type="button" className="btn btn-primary" to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '16px', padding: '8px 20px', backgroundColor: '#007bff', borderRadius: '5px' }}>Okay</Link>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={showNotDetectedModal} onHide={handleModalClose} centered>
                    <Modal.Body>
                        <div style={{ textAlign: 'center' }}>
                            <p>No face detected. Please try again.</p>
                            <Button variant="primary" onClick={handleModalClose}>Okay</Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={recognizedName !== null} onHide={handleModalClose} centered>
                    <Modal.Body>
                        <div style={{ textAlign: 'center' }}>
                            <h2>{recognizedName}</h2>
                            <p style={{ color: '#28a745' }}>Recognition Successful</p>
                            <Link type="button" className="btn btn-primary" to={`/MFA/${recognizedName}`} style={{ textDecoration: 'none', color: 'white', fontSize: '16px', padding: '8px 20px', backgroundColor: '#007bff', borderRadius: '5px' }}>Proceed</Link>
                            <span style={{ marginLeft: '10px', fontSize: '16px' }}>Time Left: {timeLeft} seconds</span>
                        </div>
                    </Modal.Body>
                </Modal>
                {captureVideo && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                        <ProgressBar animated now={progress} label={`${progress}%`} style={{ width: '80%' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analyze;
