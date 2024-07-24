import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStorage, ref, getDownloadURL, getMetadata } from 'firebase/storage';
import axios from 'axios';
import { Button, Container, Form, FormControl, Image, Row, Col } from 'react-bootstrap';
import yourImage from "./register.jpg";

const GoogleAuthenticator = () => {
    const { recognizedName } = useParams();
    const [secret, setSecret] = useState('');
    const [totp, setTotp] = useState('');
    const [verificationResult, setVerificationResult] = useState('');

    // Fetch the secret key from the registration details text file in Firebase Storage
    useEffect(() => {
        const fetchRegistrationDetails = async () => {
            try {
                const storage = getStorage();
                const storageRef = ref(storage, `${recognizedName}_registration_details.txt`);
                const metadata = await getMetadata(storageRef);
                const downloadURL = await getDownloadURL(storageRef);
                const currentDetailsResponse = await fetch(downloadURL);
                const currentDetailsText = await currentDetailsResponse.text();

                // Extract the secret key (TOTP) from the file content
                const secretKey = currentDetailsText.match(/TOTP: (.*)/)[1];
                setSecret(secretKey);
            } catch (error) {
                console.error('Error fetching registration details:', error);
            }
        };

        fetchRegistrationDetails();
    }, [recognizedName]);

    // Verify the entered TOTP code
    const verifyTotp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/verify-totp', { secret, totp });
            setVerificationResult(response.data.message);
        } catch (error) {
            console.error('Error verifying TOTP:', error);
            setVerificationResult('Failed to verify TOTP');
        }
    };

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center position-relative">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: `url(${yourImage})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)', zIndex: '-1' }}></div>
            <Container className="position-relative">
                <Row className="justify-content-center">
                    <Col xs={12} sm={8} md={6}>
                        <div className="p-4 border rounded shadow bg-text">
                            <Form className="my-3">
                                <FormControl
                                    type="text"
                                    value={totp}
                                    onChange={(e) => setTotp(e.target.value)}
                                    placeholder="Enter TOTP"
                                    className="my-3"
                                />
                                <Button variant="success" onClick={verifyTotp}>Verify TOTP</Button>
                                {verificationResult && <p className="my-3" style={{ color: 'white' }}>{verificationResult}</p>}
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default GoogleAuthenticator;
