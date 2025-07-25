import { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ref,
  push,
  set,
  onValue,
  get,
  update,
  remove,
  off,
} from "firebase/database";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameChatId, setRenameChatId] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDeleteId, setChatToDeleteId] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);


  function handleLogout() {
    setError("");
    try {
      logout();
      navigate("/");
    } catch {
      setError("Failed to logout");
    }
  }

  const didCreateNewChat = useRef(false);

  useEffect(() => {
    if (!currentUser || didCreateNewChat.current) return;

    const userChatsRef = ref(database, `users/${currentUser.uid}/chats`);

    const unsubscribe = onValue(userChatsRef, async (snapshot) => {
      const data = snapshot.val();
      let chatArray = [];

      if (data) {
        chatArray = Object.entries(data).map(([id, val]) => ({
          id,
          title: val.title || "Untitled",
        }));
      }

      setChatList(chatArray);

      if (!didCreateNewChat.current) {
        didCreateNewChat.current = true;

        const existingTitles = chatArray
          .map((chat) => chat.title)
          .filter((title) => /^Chat \d+$/.test(title));

        const usedNumbers = existingTitles.map((title) =>
          parseInt(title.replace("Chat ", ""), 10)
        );
        const nextChatNumber = usedNumbers.length
          ? Math.max(...usedNumbers) + 1
          : 1;

        const newChatTitle = `Chat ${nextChatNumber}`;
        const newChatId = uuidv4();

        const chatRef = ref(
          database,
          `users/${currentUser.uid}/chats/${newChatId}`
        );
        await set(chatRef, { title: newChatTitle, messages: [] });

        const updatedChatList = [
          ...chatArray,
          { id: newChatId, title: newChatTitle },
        ];
        setChatList(updatedChatList);
        setChatId(newChatId);
        setMessages([]);
      }
    });

    return () => off(userChatsRef);
  }, [currentUser]);

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

  const createNewChat = async () => {
    if (!currentUser) return;

    const userChatsRef = ref(database, `users/${currentUser.uid}/chats`);
    const snapshot = await get(userChatsRef);
    const data = snapshot.val();

    let existingTitles = [];

    if (data) {
      existingTitles = Object.values(data)
        .map((chat) => chat.title)
        .filter((title) => /^Chat \d+$/.test(title));
    }

    const usedNumbers = existingTitles.map((title) =>
      parseInt(title.replace("Chat ", ""), 10)
    );
    const nextChatNumber = usedNumbers.length
      ? Math.max(...usedNumbers) + 1
      : 1;

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

  const handleChatClick = (id) => {
    setChatId(id);
    loadMessages(id);
  };

  const renameChat = async (id, oldTitle) => {
    const newTitle = prompt("Enter new title:", oldTitle);
    if (!newTitle || !newTitle.trim()) return;

    const chatRef = ref(database, `users/${currentUser.uid}/chats/${id}`);
    await update(chatRef, { title: newTitle.trim() });

    const updated = chatList.map((chat) =>
      chat.id === id ? { ...chat, title: newTitle.trim() } : chat
    );
    setChatList(updated);
  };

  const deleteChat = async (id) => {
    const confirmDelete = window.confirm("Delete this chat?");
    if (!confirmDelete) return;

    const chatRef = ref(database, `users/${currentUser.uid}/chats/${id}`);
    await remove(chatRef);

    const updated = chatList.filter((chat) => chat.id !== id);
    setChatList(updated);

    if (chatId === id) {
      setChatId("");
      setMessages([]);
    }
  };

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
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen text-white">

       {/* Desktop Sidebar (visible ≥ md) */}
<div className="hidden md:flex md:flex-col bg-zinc-800 border-r border-zinc-700 p-4">
  <h2 className="text-lg font-bold mb-4 text-white">Cognivox</h2>

  <div className="flex-1 space-y-3 overflow-auto text-left">
    {chatList.map((chat) => (
      <div
        key={chat.id}
        className={`bg-zinc-700 rounded-lg p-2 cursor-pointer hover:bg-zinc-600 ${
          chat.id === chatId ? "bg-zinc-600" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <div
            onClick={() => handleChatClick(chat.id)}
            className="truncate w-full cursor-pointer text-white"
          >
            {chat.title}
          </div>
          <div className="flex space-x-2 ml-2">
            <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameChatId(chat.id);
                      setRenameTitle(chat.title);
                      setRenameDialogOpen(true);
                    }}
                    className="p-1 hover:bg-zinc-600 rounded cursor-pointer"
                  >
                    {/* ✏️ Rename Icon */}
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C18.9113 1.47862 21.0686 2.47256 21.2799 4.09382C21.4912 5.71508 19.8362 6.61172 19.8362 6.61172L21.2799 6.40005Z" />
                      <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatToDeleteId(chat.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="p-1 hover:bg-zinc-600 rounded cursor-pointer"
                  >
                    {/* 🗑️ Delete Icon */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 11V17" />
                      <path d="M14 11V17" />
                      <path d="M4 7H20" />
                      <path d="M6 7H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" />
                      <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" />
                    </svg>
                  </button>
          </div>
        </div>
      </div>
    ))}
  </div>

  <button
    onClick={createNewChat}
    className="mt-4 bg-white text-black py-2 rounded-full font-semibold hover:bg-gray-200 transition"
  >
    + New Chat
  </button>
</div>
{sidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}

{/* Mobile Sidebar (drawer, visible < md) */}
<div
  className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-800 border-r border-zinc-700 p-4 transform transition-transform duration-300 ease-in-out ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  } md:hidden`}
>
  {/* Close Button */}
  <div className="flex justify-end mb-4">
    <button
      onClick={() => setSidebarOpen(false)}
      className="text-white hover:text-gray-300 text-xl"
    >
      ×
    </button>
  </div>

  <h2 className="text-lg font-bold mb-4 text-white">Cognivox</h2>

  <div className="space-y-3 overflow-y-auto">
    {chatList.map((chat) => (
      <div
        key={chat.id}
        className={`bg-zinc-700 rounded-lg p-2 cursor-pointer hover:bg-zinc-600 ${
          chat.id === chatId ? "bg-zinc-600" : ""
        }`}
        onClick={() => {
          handleChatClick(chat.id);
          setSidebarOpen(false); // Close drawer after selecting chat
        }}
      >
        <div className="flex justify-between items-center text-white">
          <div className="truncate w-full">{chat.title}</div>
          <div className="flex space-x-2 ml-2">
           <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameChatId(chat.id);
                      setRenameTitle(chat.title);
                      setRenameDialogOpen(true);
                    }}
                    className="p-1 hover:bg-zinc-600 rounded cursor-pointer"
                  >
                    {/* ✏️ Rename Icon */}
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C18.9113 1.47862 21.0686 2.47256 21.2799 4.09382C21.4912 5.71508 19.8362 6.61172 19.8362 6.61172L21.2799 6.40005Z" />
                      <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatToDeleteId(chat.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="p-1 hover:bg-zinc-600 rounded cursor-pointer"
                  >
                    {/* 🗑️ Delete Icon */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 11V17" />
                      <path d="M14 11V17" />
                      <path d="M4 7H20" />
                      <path d="M6 7H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" />
                      <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" />
                    </svg>
                  </button>
          </div>
        </div>
      </div>
    ))}
  </div>

  <button
    onClick={createNewChat}
    className="mt-4 bg-white text-black py-2 rounded-full font-semibold hover:bg-gray-200 transition w-full"
  >
    + New Chat
  </button>
</div>


      <div className="col-span-1 md:col-span-4 flex flex-col h-screen bg-zinc-900">

       <div className="px-4 md:px-10 py-4 md:py-6 flex justify-between items-center border-b border-zinc-700">
  {/* Hamburger - Only visible below 850px (md) */}
  <button
    className="md:hidden text-white focus:outline-none"
    onClick={() => setSidebarOpen(true)}
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  <span className="text-xl font-semibold">Cognivox</span>

  <div className="flex items-center space-x-2 md:space-x-4">
    <span className="text-sm truncate max-w-[200px] hidden md:inline">
      {currentUser.email}
    </span>
    <button
      onClick={handleLogout}
      className="px-3 md:px-4 py-1.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 hover:shadow transition"
    >
      Logout
    </button>
  </div>
</div>


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
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        {/* Blurred dark overlay */}

        <DialogContent className="z-50 w-full max-w-sm bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg p-5 sm:p-7 min-h-[230px] flex flex-col items-center justify-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-white">
              Rename Chat
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2 text-sm">
              Enter a new title for your chat
            </DialogDescription>
          </DialogHeader>

          <div className="w-full mt-4 space-y-2">
            <Label htmlFor="new-title" className="text-white">
              New Title
            </Label>
            <Input
              id="new-title"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              className="w-full bg-zinc-700 text-white placeholder-gray-400 border border-zinc-600 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:ring-transparent focus:border-zinc-500 focus:shadow-none"
              placeholder="Enter new title"
            />
          </div>

          <DialogFooter className="mt-6 flex justify-center gap-3 w-full">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center justify-center px-5 py-2 border border-gray-500 text-gray-200 rounded-full font-semibold transition hover:bg-zinc-700"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={async () => {
                if (!renameTitle.trim() || !renameChatId) return;
                const chatRef = ref(
                  database,
                  `users/${currentUser.uid}/chats/${renameChatId}`
                );
                await update(chatRef, { title: renameTitle.trim() });

                const updated = chatList.map((chat) =>
                  chat.id === renameChatId
                    ? { ...chat, title: renameTitle.trim() }
                    : chat
                );
                setChatList(updated);
                setRenameDialogOpen(false);
              }}
              className="inline-flex items-center justify-center px-5 py-2 bg-white text-black border border-gray-300 rounded-full font-semibold transition hover:bg-gray-200"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="z-50 w-full max-w-sm bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg p-5 sm:p-7 min-h-[200px] flex flex-col items-center justify-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-white">
              Delete Chat
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2 text-sm">
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex justify-center gap-3 w-full">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center justify-center px-5 py-2 border border-gray-500 text-gray-200 rounded-full font-semibold transition hover:bg-zinc-700"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={async () => {
                if (!chatToDeleteId) return;

                const chatRef = ref(
                  database,
                  `users/${currentUser.uid}/chats/${chatToDeleteId}`
                );
                await remove(chatRef);

                const updated = chatList.filter(
                  (chat) => chat.id !== chatToDeleteId
                );
                setChatList(updated);

                if (chatId === chatToDeleteId) {
                  setChatId("");
                  setMessages([]);
                }

                setDeleteDialogOpen(false);
                setChatToDeleteId(null);
              }}
              className="inline-flex items-center justify-center px-5 py-2 bg-red-600 text-white border border-red-500 rounded-full font-semibold transition hover:bg-red-700"
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Chat;
