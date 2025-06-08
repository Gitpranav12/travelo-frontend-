import gal1 from "./assets/gal1.jpg";
import gal2 from "./assets/gal2.jpg";
import gal3 from "./assets/gal3.jpg";
import gal4 from "./assets/gal4.jpg";
import gal5 from "./assets/gal5.jpg";

const DESC = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, tenetur.";
const TITLE = "amazing places";
const HEADING = "gallery".split("");

const galleryItems = [
  { img: gal1, link: "https://www.istockphoto.com/en/photo/taj-mahal-in-agra-india-on-sunset-gm639775532-115507415" },
  { img: gal2, link: "https://pixabay.com/photos/travel-delhi-gate-culture-stone-4813658/" },
  { img: gal3, link: "https://pixabay.com/photos/maldives-tropics-tropical-1993704/" },
  { img: gal4, link: "https://www.pexels.com/photo/brown-cathedral-1007427/" },
  { img: gal5, link: "https://www.pexels.com/photo/nature-beach-sand-relaxation-6544756/" },
];

function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <h1 className="heading">
        {HEADING.map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </h1>

      <div className="box-container">
        {galleryItems.map(({ img, link }, idx) => (
          <div className="box" key={idx}>
            <img src={img} alt={TITLE} />
            <div className="content">
              <h3>{TITLE}</h3>
              <p>{DESC}</p>
              <a href={link} className="btn" target="_blank" rel="noreferrer">
                see more
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;