import { useEffect, useState } from "react";
import { API_ROOT } from "~/utils/constants";

//
export default function ChatBox({ onClose }) {
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem("chatMessages");
      // Kiểm tra xem dữ liệu có hợp lệ không
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Kiểm tra xem dữ liệu có phải là mảng không
        if (Array.isArray(parsed)) {
          // Kiểm tra từng phần tử trong mảng
          const validMessages = parsed.filter(
            (msg) =>
              msg &&
              typeof msg === "object" &&
              "role" in msg &&
              "content" in msg &&
              typeof msg.role === "string" &&
              typeof msg.content === "string"
          );
          console.log("Loaded valid messages:", validMessages);
          return validMessages;
        }
      }
      return [];
    } catch (error) {
      console.error("Error parsing chatMessages from localStorage:", error);
      // Nếu có lỗi, xóa dữ liệu cũ và trả về mảng rỗng
      localStorage.removeItem("chatMessages");
      return [];
    }
  });
  const [input, setInput] = useState("");

  // Lưu messages vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    try {
      // Lọc bỏ các tin nhắn loading trước khi lưu
      const messagesForStorage = messages.filter((msg) => !msg.isLoading);
      localStorage.setItem("chatMessages", JSON.stringify(messagesForStorage));
      console.log("Saved messages to localStorage:", messagesForStorage);
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    // Cập nhật messages sau khi loại bỏ tin nhắn loading
    const updatedMessages = [
      ...messages.filter((msg) => !msg.isLoading),
      userMessage,
    ];
    setMessages(updatedMessages);
    setInput("");

    // Thêm tin nhắn loading
    const loadingMessage = {
      role: "assistant",
      content: "...",
      isLoading: true,
    };
    setMessages([...updatedMessages, loadingMessage]);

    try {
      // Tạo bản sao của tin nhắn không có tin nhắn loading
      const messageHistory = updatedMessages;

      // Log tin nhắn đang gửi
      console.log("Sending message history:", messageHistory);

      // Sử dụng định dạng như trong ví dụ
      const requestBody = {
        messages: messageHistory,
      };

      console.log("Request body:", JSON.stringify(requestBody));

      const res = await fetch(`${API_ROOT}/api/chats/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      // Log phản hồi từ server
      console.log("Server response:", data);

      // Xóa tin nhắn loading và thêm tin nhắn thật
      setMessages((prev) => {
        const filteredMessages = prev.filter((msg) => !msg.isLoading);

        // Lấy nội dung phản hồi từ trường reply
        let responseContent = "Lỗi từ server.";
        if (data && data.reply) {
          responseContent = data.reply;
        }

        return [
          ...filteredMessages,
          {
            role: "assistant",
            content: responseContent,
          },
        ];
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => {
        const filteredMessages = prev.filter((msg) => !msg.isLoading);

        // Thông báo lỗi kết nối
        const errorMessage = "Không thể kết nối đến server.";

        return [
          ...filteredMessages,
          {
            role: "assistant",
            content: errorMessage,
          },
        ];
      });
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
