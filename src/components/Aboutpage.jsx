import React from "react";

const Aboutpage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-zinc-700 pb-2">About Cognivox</h1>

      <p className="mb-4 text-lg leading-relaxed text-zinc-300">
        <span className="font-semibold text-white">Cognivox</span> is an intelligent and interactive AI-based chatbot platform designed to facilitate seamless and natural conversations between users and machines. Whether for personal learning, customer service, or productivity, Cognivox is built to adapt and grow with your needs.
      </p>

      <p className="mb-4 text-lg leading-relaxed text-zinc-300">
        The platform leverages advanced language models and real-time processing to deliver fast, relevant, and context-aware responses. With a clean and intuitive interface, Cognivox ensures a smooth user experience whether on desktop or mobile devices.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>
      <ul className="list-disc list-inside space-y-2 text-zinc-300">
        <li>Natural language understanding and contextual awareness</li>
        <li>Secure authentication using Firebase</li>
        <li>Dynamic conversation history stored in the cloud</li>
        <li>Clean and responsive UI built with React and Tailwind CSS</li>
        <li>Custom prompt and message handling with Markdown rendering</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Technology Stack</h2>
      <ul className="list-disc list-inside space-y-2 text-zinc-300">
        <li>Frontend: React.js, Tailwind CSS</li>
        <li>Backend: Firebase Realtime Database</li>
        <li>Authentication: Firebase Auth</li>
        <li>AI Integration: Gemini API</li>
        <li>Hosting: Vercel (CI/CD enabled)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
      <p className="text-lg leading-relaxed text-zinc-300">
        At Cognivox, our mission is to make AI communication more accessible, natural, and human-like. We aim to empower individuals and businesses to harness the potential of conversational AI in their daily interactions.
      </p>
    </div>
  );
};

export default Aboutpage;
