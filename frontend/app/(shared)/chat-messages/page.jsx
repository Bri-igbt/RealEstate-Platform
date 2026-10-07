'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { chatMessagesStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useChat } from '@/context/ChatContext.jsx'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import API_URL from '@/config.js'
import Navbar from '@/app/components/commons/Navbar.jsx'
import RoleAwareShell from '@/app/components/commons/RoleAwareShell.jsx'
import { HiChevronLeft, HiOutlineChatAlt2, HiOutlineTrash, HiPaperAirplane } from 'react-icons/hi'
import Image from 'next/image'

const ChatMessagesPage = () => {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const chatIdFromParams = searchParams.get("chatId");
  const { socket, activeChat, setActiveChat, joinChat, sendMessage } = useChat();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!token) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/chat/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const fetchedConversations = res.data;
        setConversations(fetchedConversations);

        if (chatIdFromParams) {
          const existingChat = fetchedConversations.find(
            (c) => c._id === chatIdFromParams,
          );

          if (existingChat) {
            setActiveChat(existingChat);
          } else {
            try {
              const chatRes = await axios.get(`${API_URL}/api/chat/${chatIdFromParams}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setActiveChat(chatRes.data);
            } catch (err) {
              console.error("Failed to load chat from link:", err);
            }
          }
        }

      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, token, chatIdFromParams]);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/chat/${activeChat._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setMessages(res.data.messages || []);
          joinChat(activeChat._id);
          scrollToBottom();

        } catch (error) {
          console.error("Error fetching message:", error)
        }
      }
      fetchMessages()
    }
  }, [activeChat]);

  useEffect(() => {
    if (socket) {
      socket.on("recieveMessage", (data) => {
        if (activeChat && data.chatId === activeChat._id) {
          setMessages((prev) => [...prev, data]);
        }
      })
    }
    return () => socket?.off("recieveMessage")
  }, [socket, activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessages.trim() || !activeChat) return;

    const textToSend = newMessages;
    setNewMessages("");

    try {
      const res = await axios.post(
        `${API_URL}/api/chat/send`,
        {
          chatId: activeChat._id,
          text: textToSend,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedMessage = res.data.newMessage;
      if (savedMessage) {
        sendMessage(
          activeChat._id,
          textToSend,
          savedMessage._id,
          savedMessage.createdAt,
        );
      }

    } catch (error) {
      console.error("Error sending messages:", error)
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this conversation?"))
      return;

    try {
      await axios.delete(`${API_URL}/api/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConversations((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChat?._id === chatId) setActiveChat(null);

    } catch (err) {
      console.error("Error deleting chat:", err)
    }
  };

  const handleDeleteMessage = async (chatId, messageId) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      const res = await axios.delete(
        `${API_URL}/api/chat/${chatId}/message/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessages(res.data.chat.messages);
    } catch (error) {
      console.error("Error deleting chat:", error)
    }
  };

  const getChatPartner = (chat) => {
    return user._id === chat.buyer?._id ? chat.seller : chat.buyer;
  };

  if (loading) {
    return (
      <div className={s.loaderFullPage}>
        <div className={s.loader}></div>
      </div>
    )
  }

  return (
    <RoleAwareShell>
      <div className={`${s.chatContainer} ${
        user?.role === "seller" 
          ? s.chatContainerSeller 
          : s.chatContainerNonSeller}`}
      >
        {user?.role !== "seller" && <Navbar />}

        <div className={s.chatWrapper}>
          <div className={`${s.sidebar} ${activeChat ? s.sidebarHidden : ""}`}>
            <div className={s.sidebarHeader}>
              <h2 className={s.sidebarTitle}>Messages</h2>
            </div>

            <div className={s.sidebarContent}>
              {conversations.length === 0 ? (
                <div className={s.emptyConversations}>
                  <HiOutlineChatAlt2 className={s.emptyIcon} />
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((chat) => (
                  <div 
                    key={chat._id}
                    onClick={() => setActiveChat(chat)}
                    className={`${s.conversationItem} ${
                      activeChat?._id  === chat._id ? s.conversationItemActive : " "
                    }`} 
                  >
                    <div className={s.avatar}>
                      {getChatPartner(chat)?.profilePic ? (
                        <Image 
                          src={getChatPartner(chat).profilePic}
                          alt='pic'
                          width={40}
                          height={40}
                          className={s.avatarImg}
                        />
                      ) : (
                        getChatPartner(chat)?.name?.charAt(0)
                      )}
                    </div>

                    <div className={s.conversationInfo}>
                      <div className={s.conversationName}>
                        {getChatPartner(chat)?.name}
                      </div>
                      <div className={s.conversationPreview}>
                        {chat.messages.at(-1)?.text || "Started a conversation"}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteMessage(e, chat._id)}
                      className={s.deleteChatButton}
                      title='Delete Conversation'
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={s.chatArea}>
            {activeChat ? (
              <>
                <div className={s.chatHeader}>
                  <div className={s.chatHeaderLeft}>
                    <button
                      className={s.backButton}
                      onClick={() => setActiveChat(null)}
                    >
                      <HiChevronLeft size={24} />
                    </button>
                    <div className={s.avatar}>
                      {getChatPartner(activeChat)?.profilePic ? (
                        <img
                          className={s.avatarImg}
                          src={getChatPartner(activeChat).profilePic}
                          alt=""
                        />
                      ) : (
                        getChatPartner(activeChat)?.name?.charAt(0)
                      )}
                    </div>
                    <div className={s.chatPartnerName}>
                      {getChatPartner(activeChat)?.name}
                    </div>
                  </div>
                </div>

                <div className={s.messagesArea}>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`${s.messageBubble} ${(msg.sender?._id || msg.sender) === user._id ? s.messageOwn : s.messageOther}`}
                    >
                      <div className={s.messageContent}>
                        {msg.image && (
                          <div className={s.messageImageWrapper}>
                            <img
                              src={msg.image}
                              alt="Property Reference"
                              className={s.messageImage}
                            />
                          </div>
                        )}
                        <div className={s.messageText}>{msg.text}</div>
                        {(msg.sender?._id || msg.sender) === user._id && (
                          <button
                            className={s.deleteMessageButton}
                            onClick={() =>
                              handleDeleteMessage(activeChat._id, msg._id)
                            }
                            title="Delete Message"
                          >
                            <HiOutlineTrash size={14} />
                          </button>
                        )}
                      </div>
                      <span className={s.messageTime}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>

                <form className={s.messageForm} onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className={s.messageInput}
                    placeholder="Type a message..."
                    value={newMessages}
                    onChange={(e) => setNewMessages(e.target.value)}
                  />
                  <button type="submit" className={s.sendButton}>
                    <HiPaperAirplane className={s.sendIcon} />
                  </button>
                </form>
              </>
            ) : (
              <div className={s.noChatSelected}>
                <HiOutlineChatAlt2 className={s.noChatIcon} />
                <h3 className={s.noChatTitle}>Your Messages</h3>
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleAwareShell>
  )
}

export default function ChatMessagesPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatMessagesPage />
    </Suspense>
  );
}