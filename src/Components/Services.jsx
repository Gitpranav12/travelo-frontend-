import React from "react";
const DESCRIPTION =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore commodi earum, quis voluptate exercitationem ut minima itaque iusto ipsum corrupti!";
const SERVICES = [
  { icon: "fas fa-hotel", title: "affordable hotels" },
  { icon: "fas fa-utensils", title: "food and drinks" },
  { icon: "fas fa-bullhorn", title: "safty guide" },
  { icon: "fas fa-globe-asia", title: "around the world" },
  { icon: "fas fa-plane", title: "fastest Travel" },
  { icon: "fas fa-hiking", title: "adventures" },
];

const HEADING = "services".split("");

function Services() {
  return (
    <section className="services" id="services">
      <h1 className="heading">
        {HEADING.map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </h1>

      <div className="box-container">
        {SERVICES.map(({ icon, title }, i) => (
          <div className="box" key={i}>
            <i className={icon} />
            <h3>{title}</h3>
            <p>{DESCRIPTION}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Services;