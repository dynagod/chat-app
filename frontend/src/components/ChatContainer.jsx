import React, { useEffect, useMemo, useRef } from 'react';
import ChatHeader from './ChatHeader';
import { useDispatch, useSelector } from 'react-redux';
import MessageInput from './MessageInput';
import MessageSkeleton from './MessageSkeleton';
import { getMessages } from '../features/messageSlice';

const ChatContainer = () => {
  const { selectedChat } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const { messages, isMessagesLoading, conversationType, conversationId } = useSelector(state => state.message);

  const dispatch = useDispatch();

  const otherUser = useMemo(() => selectedChat?.users.find(u => u._id !== user._id), [selectedChat, user]);

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (conversationId && conversationType) dispatch(getMessages({ conversationType, conversationId }));
  }, [dispatch, conversationId])

  const messageEndRef = useRef(null);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.sender._id === user._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender._id === user._id
                      ? user?.avatar
                      : otherUser?.avatar
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;