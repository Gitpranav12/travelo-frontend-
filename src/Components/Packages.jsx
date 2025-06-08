// components/Packages.js
import React from "react";
// Import your images here from your assets folder
import Mumbai from './assets/mumbai.jpg';
import goa1 from './assets/goa1.jpg';
import delhiget from './assets/delhiget.jpg';
import dubai from './assets/dubai.jpg'; 
import singapore from './assets/singapore.jpg';
import london from './assets/london.jpg';

const Packages = () => {
  // Add your packages data and images here
  const packages = [
    {
      id: 1,
      img: Mumbai,
      city: "M u m b a i",
      description: "lorem ipsum sit amet consectetur adipisicing elit. veritatis nam!",
      price: 90,
      oldPrice: 120,
    },
    {
      id: 2,
      img: goa1,
      city: "G o a",
      description: "lorem ipsum sit amet consectetur adipisicing elit. veritatis nam!",
      price: 90,
      oldPrice: 120,
    },
    {
      id: 3,
      img: delhiget,
      city: "D e l h i",
      description: "lorem ipsum sit amet consectetur adipisicing elit. veritatis nam!",
      price: 90,
      oldPrice: 120,
    },
    {
      id: 4,
      img: dubai,
      city: "d u b a i",
      description: "lorem ipsum sit amet consectetur adipisicing elit. veritatis nam!",
      price: 90,
      oldPrice: 120,
    },
    {
      id: 5,
      img: singapore,
      city: "s i n g a p o r e",
      description: "lorem ipsum sit amet consectetur adipisicing elit. veritatis nam!",
      price: 90,
      oldPrice: 120,
    },
    {
      id: 6,
      img: london,
      city: "l o n d o n",
      description: "lorem ipsum sit amet consectetur adipisicing elit. veritatis nam!",
      price: 90,
      oldPrice: 120,
    },
  ];

  return (
    <section className="packages" id="packages">
      <h1 className="heading">
        <span>p</span>
        <span>a</span>
        <span>c</span>
        <span>k</span>
        <span>a</span>
        <span>g</span>
        <span>e</span>
        <span>s</span>
      </h1>

      <div className="box-container">
        {packages.map(({ id, img, city, description, price, oldPrice }) => (
          <div className="box" key={id}>
            <img src={img} alt={city} />
            <div className="content">
              <h3>
                <i className="fas fa-map-marked-alt"></i> {city}
              </h3>
              <p>{description}</p>
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
              </div>
              <div className="price">
                ${price}.00 <span>${oldPrice}.00</span>
              </div>
              <a href="#book" className="btn">
                book now
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Packages;