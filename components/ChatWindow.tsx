"use client"

import { useEffect, useRef } from "react"

type Message = {
  from: "user" | "agent" | "system"
  content: string
  sender?: string
}

type ChatWindowProps = {
  showChat: boolean
  ticketId: string | null
  chatClosed: boolean
  messages: Message[]
  chatInput: string
  setChatInput: (value: string) => void
  handleSendMessage: () => void
  handleCloseChat: () => void
  handleOpenChat: () => void
  setChatClosed: (closed: boolean) => void
  setTicketId: (id: string | null) => void
  setMessages: (msgs: Message[]) => void
  setValidationResult: (val: any) => void
  setLink: (link: string) => void
  ticketStatus?: string | null
}

export default function ChatWindow({
  showChat,
  ticketId,
  chatClosed,
  messages,
  chatInput,
  setChatInput,
  handleSendMessage,
  handleCloseChat,
  handleOpenChat,
  setChatClosed,
  setTicketId,
  setMessages,
  setValidationResult,
  setLink,
  ticketStatus,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current && showChat) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, showChat])

  const renderMessageContent = (content: string) => {
    if (!content || typeof content !== "string") {
      return "Message content unavailable"
    }

    console.log(content)
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = content.split(urlRegex)

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 underline font-medium"
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  if (!ticketId) return null

  const isInputDisabled =
    chatClosed || ticketStatus === "completed" || ticketStatus === "deleted" || ticketStatus === "closed"

  return (
    <>
      {showChat && (
        <div
  className="
    fixed bottom-4 right-4
    w-80 sm:w-96 lg:w-[500px] xl:w-[600px]
    lg:h-[700px]
    max-w-[calc(100vw-2rem)]
    rounded-2xl shadow-2xl shadow-pink-500/25
    z-50 flex flex-col overflow-hidden
    bg-neutral-900/95 backdrop-blur-xl
  "
>  {/* Header */}
          <div className="bg-neutral-800/95 text-white p-4 rounded-t-2xl flex items-center justify-between border-b border-neutral-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neutral-700/80 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">M</span>
              </div>
              <div>
                <div className="font-semibold">Support Chat</div>
                <div className="text-xs text-gray-400">
                  {ticketStatus === "completed"
                    ? "Order Completed"
                    : ticketStatus === "deleted"
                      ? "Order Cancelled"
                      : ticketStatus === "closed"
                        ? "Chat Closed"
                        : "Online"}
                </div>
              </div>
            </div>
            <button
              onClick={handleCloseChat}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-700/50 transition-colors text-xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 p-4 space-y-3 overflow-y-auto bg-neutral-900/90 max-h-90">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex flex-col max-w-xs">
                  {msg.from === "agent" && msg.sender && (
                    <span className="text-xs text-gray-400 mb-1 ml-1">{msg.sender}</span>
                  )}

                  <div
                    className={`px-4 py-2 rounded-lg ${
                      msg.from === "agent"
                        ? "bg-neutral-800/80 text-gray-200 border border-neutral-700/50"
                        : msg.from === "user"
                          ? "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white"
                          : "bg-neutral-700/50 text-gray-300 text-center border border-neutral-700/50"
                    }`}
                  >
                    {msg.content ? renderMessageContent(msg.content) : "Message content unavailable"}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-800/50 bg-neutral-900/90 rounded-b-2xl">
            {isInputDisabled ? (
              <div className="text-center text-sm text-gray-400 py-2">
                {ticketStatus === "completed"
                  ? "Order completed - chat is read-only"
                  : ticketStatus === "deleted"
                    ? "Order cancelled - chat is closed"
                    : ticketStatus === "closed"
                      ? "Chat has been closed"
                      : "Chat is no longer active"}
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2 bg-neutral-800/80 border border-neutral-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={chatInput.trim() === ""}
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:via-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!showChat && !chatClosed && ticketStatus === "open" && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-4 right-4 w-[4.5rem] h-[4.5rem] rounded-full shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-200 flex items-center justify-center z-40 hover:scale-105 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      )}
    </>
  )
}
