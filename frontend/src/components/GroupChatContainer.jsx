import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { deleteMessage, getMessages } from "../features/messageSlice";
import Avatar from "./Avatar";
import GroupChatHeader from "./GroupChatHeader";
import { Trash2 } from "lucide-react";

const GroupChatContainer = () => {
  const { selectedGroupChat } = useSelector((state) => state.groupChat);
  const { user } = useSelector((state) => state.auth);
  const { messages, isMessagesLoading, conversationType, conversationId, isDeletingMessage } =
    useSelector((state) => state.message);

  const dispatch = useDispatch();

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (conversationId && conversationType)
      dispatch(getMessages({ conversationType, conversationId }));
  }, [dispatch, conversationId]);

  const messageEndRef = useRef(null);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <GroupChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.sender._id !== user._id ? "chat-start" : "chat-end"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image">
              <Avatar
                user={message.sender}
                size={"40"}
                border={"1"}
                position={message.sender._id === user._id ? "right" : "left"}
              />
            </div>
            <div className="chat-header mb-1 flex items-center">
              <span className='text-base'>{message.sender.username}</span>
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
              { message.sender._id === user._id && !isDeletingMessage && (
                <button
                  onClick={() => dispatch(deleteMessage({ conversationId, conversationType, messageId: message._id }))}
                  className='hover:cursor-pointer'
                >
                  <Trash2 className='text-red-600 size-4'/>
                </button>
              ) }
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

export default GroupChatContainer;
