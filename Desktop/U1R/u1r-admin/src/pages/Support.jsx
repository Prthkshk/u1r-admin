import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";

export default function Support() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const authHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/support/chats`, {
        headers: authHeaders(),
      });
      setChats(res.data || []);
      if (res.data?.length && !selectedChat) {
        openChat(res.data[0]._id);
      }
    } catch (error) {
      console.log("Fetch chats error:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/support`, {
        headers: authHeaders(),
      });
      setTickets(res.data || []);
    } catch (error) {
      console.log("Fetch tickets error:", error);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchTickets();
  }, []);

  const openChat = async (chatId) => {
    setLoadingChat(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/support/chats/${chatId}`, {
        headers: authHeaders(),
      });
      setSelectedChat(res.data);
      setMessages(res.data?.messages || []);
    } catch (error) {
      console.log("Open chat error:", error);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selectedChat) return;

    setSending(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/support/chats/${selectedChat._id}/reply`,
        { text },
        { headers: authHeaders() }
      );

      setMessages(res.data?.chat?.messages || []);
      setInput("");
      // also update preview list
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: res.data?.chat?.messages || [], updatedAt: new Date().toISOString() }
            : chat
        )
      );
    } catch (error) {
      console.log("Send chat reply error:", error);
    } finally {
      setSending(false);
    }
  };

  const lastMessagePreview = (chat) => {
    const msgs = chat.messages || [];
    const last = msgs[msgs.length - 1];
    if (!last) return "No messages yet";
    return `${last.sender === "admin" ? "You: " : ""}${last.text}`.slice(0, 60);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Support</h1>
          <p className="text-gray-600 mt-1">
            Manage conversations started from the app&apos;s &quot;Chat with us&quot; option.
          </p>
        </div>
        <button
          onClick={() => {
            fetchChats();
            fetchTickets();
          }}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Chats list */}
        <div className="col-span-4 bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Chats</h3>
            {loadingChats && <span className="text-xs text-gray-500">Loading...</span>}
          </div>

          {loadingChats ? (
            <div className="text-gray-500 text-sm">Fetching chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-gray-500 text-sm">No conversations yet.</div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => openChat(chat._id)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedChat?._id === chat._id
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-800">
                      {chat.userId?.name || chat.userId?.email || "Unknown user"}
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {chat.updatedAt
                        ? new Date(chat.updatedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {chat.userId?.phone || chat.userId?.email || ""}
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    {lastMessagePreview(chat)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat window */}
        <div className="col-span-8 bg-white rounded-xl border shadow-sm flex flex-col">
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to view messages
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedChat.userId?.name || "Unknown user"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedChat.userId?.email || "N/A"} • {selectedChat.userId?.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div
                ref={chatRef}
                className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50"
              >
                {loadingChat ? (
                  <div className="text-gray-500 text-sm">Loading conversation...</div>
                ) : messages.length === 0 ? (
                  <div className="text-gray-500 text-sm">No messages yet.</div>
                ) : (
                  messages.map((msg, idx) => {
                    const fromAdmin = (msg.sender || msg.from) === "admin";
                    return (
                      <div
                        key={msg._id || msg.id || idx}
                        className={`flex ${fromAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xl px-4 py-3 rounded-2xl border text-sm leading-relaxed ${
                            fromAdmin
                              ? "bg-red-50 border-red-200 text-gray-800 rounded-br-md"
                              : "bg-white border-gray-200 text-gray-800 rounded-bl-md"
                          }`}
                        >
                          <div className="font-semibold text-[11px] mb-1 text-gray-500">
                            {fromAdmin ? "Admin" : "User"}
                          </div>
                          <div>{msg.text}</div>
                          {msg.timestamp && (
                            <div className="text-[11px] text-gray-500 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center gap-3 px-5 py-4 border-t bg-white">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                  rows={2}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className={`${
                    sending || !input.trim()
                      ? "bg-red-200 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white px-4 py-2 rounded-lg text-sm font-semibold transition`}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Call tickets */}
      <div className="mt-6 bg-white rounded-xl border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Call Tickets</h3>
            <p className="text-gray-600 text-sm">
              Requests raised from the &quot;Call us&quot; option (name, problem, phone).
            </p>
          </div>
          {loadingTickets && <span className="text-xs text-gray-500">Loading...</span>}
        </div>

        {loadingTickets ? (
          <div className="text-gray-500 text-sm">Fetching tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-gray-500 text-sm">No call tickets yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Problem</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="p-3">{ticket.name || "N/A"}</td>
                    <td className="p-3">{ticket.phone || "N/A"}</td>
                    <td className="p-3">{ticket.problem || "N/A"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ticket.status === "DONE"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {ticket.status || "PENDING"}
                      </span>
                    </td>
                    <td className="p-3">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
