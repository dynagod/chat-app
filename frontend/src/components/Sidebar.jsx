import { Image, Users } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, setSelectedChat } from '../features/chatSlice';
import SidebarSkeleton from './SidebarSkeleton';
import { setConversationTypeAndId } from '../features/messageSlice';

const Sidebar = () => {
  const { chats, selectedChat, isChatsLoading } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  const onlineUsers = [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const chatUsers = useMemo(() => chats.map(chat => {
    const otherUser = chat.users.find(u => u._id !== user._id);
    const isOnline = onlineUsers.includes(otherUser._id);
    return { chat, otherUser, isOnline }
  }), [ chats, onlineUsers ]);

  if (isChatsLoading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        {/* <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div> */}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {chatUsers.map(({ chat, otherUser, isOnline }) => (
          <button
            key={chat._id}
            onClick={() => {
              dispatch(setSelectedChat(chat));
              dispatch(setConversationTypeAndId({ conversationType: "Chat", conversationId: chat._id }));
            }}
            className={`
              w-full p-3 flex items-center gap-3 rounded-full lg:rounded-2xl
              hover:bg-base-300 transition-colors cursor-pointer
              ${selectedChat?._id === chat._id ? "bg-base-300 ring-1 ring-base-300" : ""}
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
              <div className="font-medium truncate">{otherUser.fullName}</div>
              <div className="text-sm text-zinc-400">
                {
                  chat.latestMessage ? chat.latestMessage.text ? chat.latestMessage.text : <Image className='w-4 h-4' /> :
                  isOnline ? "Online" : "Offline"
                }
              </div>
            </div>
          </button>
        ))}

        {chats.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;