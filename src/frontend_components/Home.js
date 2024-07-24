import React from 'react'
import chirag from './team_pics/chirag.png'
import ria from './team_pics/ria.png'

function Home() {
  return (
    <div>
      <section id="about" className="py-5">
        <div className="container">
            <h2>
                What are we? What we offer?
            </h2>
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#007aaa', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Facial Recognition: Redefining Access Control</p>
                  </div>
                </div>
                <div className="col-lg-3 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#007bff', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Unlock Security with Facial Recognition</p>
                  </div>
                </div>
                <div className="col-lg-4 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#28a745', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Secure. Seamless. Facial Recognition.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#ffc107', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Access Made Easy with Facial Recognition</p>
                  </div>
                </div>
                <div className="col-lg-4 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#dc3545', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Empowering Security, One Face at a Time</p>
                  </div>
                </div>
                <div className="col-lg-3 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#17a2b8', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Next-Gen Access Control: Facial Recognition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-3 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#6610f2', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Facial Recognition: Your Key to Secure Access</p>
                  </div>
                </div>
                <div className="col-lg-4 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#28a745', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Say Goodbye to Keys, Hello to Facial Recognition</p>
                  </div>
                </div>
                <div className="col-lg-4 text-center" style={{ margin: '5px' }}>
                  <div className="about-text" style={{ backgroundColor: '#007bff', padding: '20px', borderRadius: '10px', textAlign: 'center', height: '100%' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Facial Recognition: The Future of Access Control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="img-fluid" style={{ backgroundImage: `url(${yourImage})`, backgroundSize: 'cover', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}></div>
            </div>
            <div className="col-lg-6">
              <h2>About us</h2>
              <br></br>
              <p style={{fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: 'black'}}>Welcome to FaceMail, where we're reshaping access control through cutting-edge facial recognition technology. With a diverse team dedicated to security and innovation, we're driven to redefine authentication solutions for enhanced safety and convenience.
                Our commitment to excellence is evident in our comprehensive approach, from research and development to implementation and support. By leveraging advanced algorithms and intuitive interfaces, we've created a secure system that elevates user experience.
                At FaceMail, transparency, communication, and accountability are paramount. We're not just technology providers; we're trusted partners committed to your security and success.
                Join us as we pioneer a safer, smarter future in access control. Together, we'll empower innovation and secure access for all.FaceMail - Securing Access, Empowering Innovation.</p>
                <br></br>
                <br></br>
                <h2>Our Team</h2>
                <br></br>
                <div className='container-fluid text-center'>
                <div className="row">
                    <div className="col-lg-2" style={{backgroundImage: `url(${chirag})`, backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', height:"100px", margin:"2px", width:"100px"}}></div>
                    <div className="col-lg-2" style={{backgroundImage: `url(${ria})`, backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', height:"100px", margin:"2px", width:"100px"}}></div>
                    <div className='col-lg-2' style={{fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: 'black'}}>Chirag Vats</div>
                    <div className='col-lg-2' style={{fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', color: 'black'}}>Ria Chandra</div>
                </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-light py-4">
        <div className="container text-center">
          <p>&copy; 2024 FaceMail. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default Home
