// components/Footer.js
import React from "react";

function Footer() {
  return (
    <section className="footer">
      <div className="box-container">
        <div className="box">
          <h3>about us</h3>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas
            dolores recusandae molestiae voluptatibus quis id voluptatem
            temporibus cum vero, odio beatae fuga? Quod eligendi delectus fugit
            autem voluptatibus totam debitis!
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
          <a href="#review">reviwe</a>
          <a href="#contact">contact</a>
        </div>

        <div className="box">
          <h3>follow us</h3>
          <a href="/">instagram</a>
          <a href="/">facebook</a>
          <a href="/">twitter</a>
        </div>
      </div>
    </section>
  );
}

export default Footer;