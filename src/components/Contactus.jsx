import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contactus = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  formRef.current,
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
)
      .then(
      () => {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      },
      (error) => {
        console.error("EmailJS Error:", error);
        toast.error("Failed to send message. Try again.");
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-zinc-700 pb-2">
        Contact Us
      </h1>

      <p className="text-zinc-300 mb-6">
        Have questions, feedback, or suggestions about Cognivox? We’d love to
        hear from you! Fill out the form below and we’ll get in touch as soon
        as possible.
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-zinc-400">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-zinc-400">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-zinc-400">Message</label>
          <textarea
            name="message"
            required
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex items-center justify-center bg-zinc-900">
          <button
            type="submit"
            className="px-6 py-2 bg-white text-black rounded-full transition hover:bg-gray-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contactus;
