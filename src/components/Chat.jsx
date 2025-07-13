import { useEffect, useState } from "react";
import "./Chat.css";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
// import { URL } from './constants'

function Chat() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
  const preventBack = () => {
    window.history.pushState(null, "", window.location.href);
  };

  window.history.pushState(null, "", window.location.href); // initial push
  window.addEventListener("popstate", preventBack);

  return () => window.removeEventListener("popstate", preventBack);
}, []);


  // const payload={ 
  //   "contents": [
  //     {
  //       "parts": [
  //         {
  //           "text": "Explain how AI works in a few words"
  //         }
  //       ]
  //     }
  //   ]
  // }

  const askQuestion = async () => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: question }),
    });
    const data = await res.json();
    // console.log("Gemini says:", data.reply);
    //setResult(data.reply)
    try {
      const rawHtml = marked.parse(data.reply);
      const safeHtml = DOMPurify.sanitize(rawHtml);
      setResult(safeHtml);
    } catch (err) {
      console.error("Markdown parsing error:", err);
      setResult("<p>Oops! Failed to render response.</p>");
    }

    // console.log(question)
    // let response= await fetch(URL,{
    //   method:"POST",body:JSON.stringify(payload)
    // })

    // response= await response.json();

    // console.log(response);
  };


  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-800"></div>
      <div className="col-span-4 p-10">
        <div className="container h-[28rem] overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent text-left">
          {/* <div className='text-white'>
              {result}
            </div> */}
          <div
            className="text-white prose prose-p:my-2 prose-pre:my-3 prose-li:my-1 max-w-none dark:prose-invert parsed-markdown"
            dangerouslySetInnerHTML={{ __html: result }}
          />
        </div>
        <div
          className="bg-zinc-800 w-1/2 p-1 pr-5 text-white m-auto rounded-4xl
          border border-zinc-700 flex h-16"
        >
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && question.trim() !== "") {
                event.preventDefault();
                askQuestion();
              }
            }}
            className="h-full w-full p-3 outline-none"
            placeholder="Ask me anything ?"
          />
          <button
            onClick={askQuestion}
            className="group relative ml-2 flex items-center justify-center px-4 py-1.5 rounded-full border border-none transition-transform duration-200 active:scale-95"
          >
            <svg
              className="animate-pulse absolute z-10 transition-all duration-300 text-white group-hover:text-white h-5 w-5 left-0 top-1/2 transform -translate-y-1/2 group-hover:h-7 group-hover:w-7 group-hover:left-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z"
              />
            </svg>

            <span className="text-white font-semibold pl-0.5 group-hover:opacity-0 transition-opacity duration-200 ">
              Ask
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
