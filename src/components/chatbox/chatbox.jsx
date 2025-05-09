import { useEffect, useState } from "react";
import { API_ROOT } from "~/utils/constants";
//
export default function ChatBox({ onClose }) {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Lưu messages vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    // Thêm tin nhắn loading
    setIsLoading(true);
    const loadingMessage = {
      role: "assistant",
      content: "...",
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const res = await fetch(`${API_ROOT}/api/chats/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await res.json();

      // Xóa tin nhắn loading và thêm tin nhắn thật
      setIsLoading(false);
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.isLoading) // Xóa tin nhắn loading
          .concat({
            role: "assistant",
            content: data.reply || "Lỗi từ server.",
          })
      );
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.isLoading)
          .concat({
            role: "assistant",
            content: "Không thể kết nối đến server.",
          })
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[400px] bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-[#1DB954] text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="font-semibold">Chat Assistant</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#262629]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-[#1DB954] text-white rounded-tr-none"
                  : "bg-[#484851] text-white rounded-tl-none"
              } ${msg.isLoading ? "animate-pulse" : ""}`}
            >
              {msg.isLoading ? (
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-[#262629] rounded-b-lg">
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-[#1DB954] text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
          />
          <button
            className="px-4 py-2 bg-[#1DB954] text-white rounded-full hover:bg-blue-600 focus:outline-none"
            onClick={sendMessage}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
