import { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ref, push, set, onValue, get } from "firebase/database";
import { database } from "../components/firebase";
import { v4 as uuidv4 } from "uuid";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [chatId, setChatId] = useState("");
  const [chatList, setChatList] = useState([]);

  // Logout handler
  function handleLogout() {
    setError("");
    try {
      logout();
      navigate("/");
    } catch {
      setError("Failed to logout");
    }
  }

  // Disable browser back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);
    return () => window.removeEventListener("popstate", preventBack);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load user's chat list and create first chat if needed
  const [hasCreatedChat, setHasCreatedChat] = useState(false);

  useEffect(() => {
    if (!currentUser || hasCreatedChat) return;

    const userChatsRef = ref(database, `users/${currentUser.uid}/chats`);
    get(userChatsRef).then((snapshot) => {
      const data = snapshot.val();
      let chatArray = [];

      if (data) {
        chatArray = Object.entries(data).map(([id, val]) => ({
          id,
          title: val.title || "Untitled",
        }));
      }

      const nextChatNumber = chatArray.length + 1;
      const newChatTitle = `Chat ${nextChatNumber}`;
      const newChatId = uuidv4();

      const chatRef = ref(
        database,
        `users/${currentUser.uid}/chats/${newChatId}`
      );
      set(chatRef, { title: newChatTitle, messages: [] }).then(() => {
        const updatedChatList = [
          ...chatArray,
          { id: newChatId, title: newChatTitle },
        ];
        setChatList(updatedChatList);
        setChatId(newChatId);
        setMessages([]);
        setHasCreatedChat(true); // ✅ prevents infinite chat creation
      });
    });
  }, [currentUser, hasCreatedChat]);

  // Load messages from Firebase for selected chat
  const loadMessages = async (selectedChatId) => {
    if (!currentUser) return;

    const messagesRef = ref(
      database,
      `users/${currentUser.uid}/chats/${selectedChatId}/messages`
    );
    const snapshot = await get(messagesRef);
    const data = snapshot.val();
    if (data) {
      const msgArray = Object.values(data);
      setMessages(msgArray);
    } else {
      setMessages([]);
    }
  };

  // Create a new chat
  const createNewChat = async () => {
    if (!currentUser) return;

    const userChatsRef = ref(database, `users/${currentUser.uid}/chats`);
    const snapshot = await get(userChatsRef);
    const data = snapshot.val();
    const chatCount = data ? Object.keys(data).length : 0;

    const nextChatNumber = chatCount + 1;
    const newChatTitle = `Chat ${nextChatNumber}`;
    const newChatId = uuidv4();

    const chatRef = ref(
      database,
      `users/${currentUser.uid}/chats/${newChatId}`
    );
    await set(chatRef, { title: newChatTitle, messages: [] });

    const updatedChatList = [
      ...chatList,
      { id: newChatId, title: newChatTitle },
    ];
    setChatList(updatedChatList);
    setChatId(newChatId);
    setMessages([]);
  };

  // Handle chat click from sidebar
  const handleChatClick = (id) => {
    setChatId(id);
    loadMessages(id);
  };

  // Ask question and save messages
  const askQuestion = async () => {
    if (!question.trim() || !chatId) return;

    const userMsg = { type: "question", text: question };
    const loadingMsg = {
      type: "answer",
      text: "<p class='text-gray-400'>⌛ Waiting for response...</p>",
      loading: true,
    };

    const updatedMsgs = [...messages, userMsg, loadingMsg];
    setMessages(updatedMsgs);
    setQuestion("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });

      const data = await res.json();
      const filteredMsgs = updatedMsgs.filter((msg) => !msg.loading);

      let answerMsg;
      if (data.error) {
        const errorText =
          data.error.code === 503
            ? `<p class="text-yellow-400">⚠️ Gemini is overloaded. Try later.</p>`
            : `<p class="text-red-400">❌ Error: ${data.error.message}</p>`;
        answerMsg = { type: "answer", text: errorText };
      } else {
        const rawHtml = marked.parse(data.reply);
        const safeHtml = DOMPurify.sanitize(rawHtml);
        answerMsg = { type: "answer", text: safeHtml };
      }

      const finalMsgs = [...filteredMsgs, answerMsg];
      setMessages(finalMsgs);

      // Save both Q & A to Firebase
      const msgsRef = ref(
        database,
        `users/${currentUser.uid}/chats/${chatId}/messages`
      );
      await set(msgsRef, finalMsgs);
    } catch (err) {
      const filteredMsgs = messages.filter((msg) => !msg.loading);
      const errorMsg = {
        type: "answer",
        text: `<p class='text-red-400'>❌ Network error.</p>`,
      };
      setMessages([...filteredMsgs, errorMsg]);
    }
  };

  return (
    <div className="grid grid-cols-5 h-screen text-white">
      {/* Sidebar */}
      <div className="col-span-1 bg-zinc-800 border-r border-zinc-700 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Cognivox</h2>

        <div className="flex-1 space-y-3 overflow-auto text-left">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className={`bg-zinc-700 rounded-lg p-2 cursor-pointer hover:bg-zinc-600 ${
                chat.id === chatId ? "bg-zinc-600" : ""
              }`}
            >
              {chat.title}
            </div>
          ))}
        </div>

        <button
          onClick={createNewChat}
          className="mt-4 bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          + New Chat
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="col-span-4 flex flex-col h-screen bg-zinc-900">
        {/* Header */}
        <div className="px-10 py-6 flex justify-between items-center border-b border-zinc-700">
          <span className="text-xl font-semibold">Cognivox</span>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{currentUser.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 hover:shadow transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-10 py-6 pb-28 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "question" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-xl break-words inline-block ${
                    msg.type === "question"
                      ? "bg-zinc-600 text-white"
                      : "bg-zinc-700 text-white"
                  }`}
                  style={{ maxWidth: "75%", wordWrap: "break-word" }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 bg-transparent">
            <div className="flex items-center bg-zinc-800/70 backdrop-blur-md rounded-full px-4 h-16 border border-zinc-700">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                className="h-full w-full p-3 outline-none bg-transparent"
                placeholder="Ask me anything?"
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
                <span className="text-white font-semibold pl-0.5 group-hover:opacity-0 transition-opacity duration-200">
                  Ask
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
