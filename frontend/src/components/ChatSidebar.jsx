import React, { useEffect, useMemo } from "react";
import SearchUser from "./SearchUser";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setSelectedChat } from "../features/chatSlice";
import SidebarSkeleton from "./SidebarSkeleton";
import { setConversationTypeAndId } from "../features/messageSlice";

const ChatSidebar = () => {
  const { chats, selectedChat, isChatsLoading } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.socket);

  const dispatch = useDispatch();

  useEffect(() => {
    if (chats.length === 0) dispatch(getUsers());
  }, [dispatch]);

  const chatUsers = useMemo(
    () =>
      chats
        .map((chat) => {
          const otherUser = chat.users.find((u) => u._id !== user._id);
          const isOnline = onlineUsers.includes(otherUser._id);
          return { chat, otherUser, isOnline };
        })
        .sort((a, b) => {
          const aTimestamp =
            new Date(a.chat.latestMessage?.createdAt).getTime() || 0;
          const bTimestamp =
            new Date(b.chat.latestMessage?.createdAt).getTime() || 0;
          return bTimestamp - aTimestamp;
        }),
    [chats, onlineUsers]
  );

  if (isChatsLoading) return <SidebarSkeleton />;

  return (
    <>
      <SearchUser />

      <div className="overflow-y-auto w-full py-3">
        {chatUsers.map(({ chat, otherUser, isOnline }) => (
          <button
            key={chat._id}
            onClick={() => {
              dispatch(setSelectedChat(chat));
              dispatch(
                setConversationTypeAndId({
                  conversationType: "Chat",
                  conversationId: chat._id,
                })
              );
            }}
            className={`
                    ml-2 lg:ml-0 lg:w-full p-2 lg:p-3 flex items-center gap-3 rounded-full lg:rounded-2xl
                    hover:bg-base-300 transition-colors cursor-pointer
                    ${
                      selectedChat?._id === chat._id
                        ? "bg-base-300 ring-1 ring-base-300"
                        : ""
                    }
                `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={otherUser.avatar}
                alt={otherUser.username}
                className="size-12 object-cover rounded-full"
              />
              {isOnline && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                            rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{otherUser.username}</div>
              <div className="text-sm text-zinc-400">
                {chat.latestMessage ? (
                  <>
                    <span className="text-base-content/80">
                      {chat.latestMessage.sender.username === user.username ? "You" : otherUser.username}:
                    </span>{" "}
                    {chat.latestMessage.text ? (
                      chat.latestMessage.text.length >= 25 ? (
                        chat.latestMessage.text.slice(0, 18) + " ....."
                      ) : (
                        chat.latestMessage.text
                      )
                    ) : (
                      <Image className="w-4 h-4" />
                    )}
                  </>
                ) : (
                  isOnline ? "Online" : "Offline"
                )}
              </div>
            </div>
          </button>
        ))}

        {chats.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            You have no friends
          </div>
        )}
      </div>
    </>
  );
};

export default ChatSidebar;
