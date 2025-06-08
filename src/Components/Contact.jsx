import React, { useState } from "react";
import Swal from "sweetalert2";
import travelo from "./assets/travelo.jpg";

// 🟢 NEW: Define your API base URL using the environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const HEADING = "contact".split("");

const INITIAL_STATE = { name: "", email: "", number: "", subject: "", message: "" };

function Contact() {
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, number, subject, message } = formData;
    const contactData = { name, email, message: `${subject} | Phone: ${number} | ${message}` };

    try {
      // 🟢 UPDATED API CALL FOR CONTACT FORM 🟢
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Thanks for contacting us. We will get back to you shortly.",
          confirmButtonColor: "#3085d6",
        });
        setFormData(INITIAL_STATE);
      } else {
        // More descriptive error handling
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send message");
      }
    } catch (error) { // Catch the actual error object
      console.error("Contact form submission error:", error); // Log the error for debugging
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong. Please try again.", // Display specific error message
      });
    }
  };

  return (
    <section className="contact" id="contact">
      <h1 className="heading">
        {HEADING.map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </h1>

      <div className="row">
        <div className="image">
          <img src={travelo} alt="contact" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input type="text" name="name" placeholder="name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="inputBox">
            <input type="number" name="number" placeholder="number" value={formData.number} onChange={handleChange} />
            <input type="text" name="subject" placeholder="subject" value={formData.subject} onChange={handleChange} />
          </div>
          <textarea name="message" placeholder="message" cols="30" rows="10" value={formData.message} onChange={handleChange} />
          <input type="submit" className="btn" value="send message" />
        </form>
      </div>
    </section>
  );
}

export default Contact;