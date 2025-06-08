import React, { useState } from 'react';
import Header from './Header'
import Book from './Book'
import Packages from './Packages'
import Services from './Services'
import Gallery from './Gallery'
import Contact from './Contact'
import Footer from './Footer'

const HomeSection = () => {
  const [videoSrc, setVideoSrc] = useState('/image/video1.mp4');

  const videoList = [
    'video1.mp4',
    'video2.mp4',
    'video3.mp4',
  ];

  const handleVideoChange = (video) => {
    setVideoSrc(`/image/${video}`);
  };

  return (
    <>
    <Header/>
    <section className="home" id="Home">
      <div className="video-container">
        <video
          key={videoSrc}
          src={videoSrc}
          id="video-slide"
          loop
          autoPlay
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div className="content">
        <h3>Adventure is Worthwhile</h3>
        <p>discover new places with us. adventure awaits</p>
        <a
          href="/"
          className="btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          discover more
        </a>
      </div>

      <div className="controls">
        {videoList.map((video, index) => (
          <span
            key={index}
            className={`vid-btn ${videoSrc === `/image/${video}` ? 'active' : ''}`}
            onClick={() => handleVideoChange(video)}
          ></span>
        ))}
      </div>
    </section>
   <Book/>
   <Packages/>
   <Services/>
   <Gallery/>
   <Contact/>
   <Footer/>
    </>
  );
};

export default HomeSection;
