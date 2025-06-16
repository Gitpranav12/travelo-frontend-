// components/Footer.js
import React from "react";

function Footer() {
  return (
  <>
    <section className="footer">
      <div className="box-container">
        <div className="box">
          <h3>about us</h3>
          <p>
           At Travelo Booking, we make travel easy, fast, and fun! From finding your dream destination to booking your tickets in seconds, we're your smart travel partner — anytime, anywhere. Let's make every journey unforgettable!
          </p>
        </div>
        <div className="box">
          <h3>branch locations</h3>
          <a href="/">India</a>
          <a href="/">USA</a>
          <a href="/">Japan</a>
          <a href="/">london</a>
        </div>
        <div className="box">
          <h3>quick links</h3>
          <a href="/">home</a>
          <a href="#book">book</a>
          <a href="#packages">packages</a>
          <a href="#services">services</a>
          <a href="#gallery">gallery</a>
          <a href="#contact">contact</a>
        </div>

        <div className="box">
          <h3>follow us</h3>
          <a href="https://www.instagram.com/tablakar_music007/">instagram</a>
          <a href="https://www.facebook.com/share/1BjCNEBtmx/">facebook</a>
          <a href="/">twitter</a>
        </div>
      </div>
       <div className="copywrite">
        
      Travelo Booking. Designed & Developed <br />❤️|| by <a href="https://designerpranav.netlify.app/" id="copywrite-link">PSJ</a> || 
      
       </div>
    </section>
  </>
  );
}

export default Footer;