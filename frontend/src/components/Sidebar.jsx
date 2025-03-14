import { Group, Users } from 'lucide-react';
import React, { useState } from 'react';
import GroupChatSidebar from './GroupChatSidebar';
import ChatSidebar from './ChatSidebar';
import { useDispatch } from 'react-redux';
import { setSelectedChat } from '../features/chatSlice';
import { setSelectedGroupChat } from '../features/groupChatSlice';

const Sidebar = () => {
  const [isGroupChatSelected, setIsGroupChatSelected] = useState(false);

  const dispatch = useDispatch();

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div
        className="border-b border-base-300 w-full p-5"
        onClick={() => {
          setIsGroupChatSelected(!isGroupChatSelected);
          if (!isGroupChatSelected) dispatch(setSelectedChat(null));
          else dispatch(setSelectedGroupChat(null));
        }}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          {isGroupChatSelected ? <Group className="size-6" /> : <Users className="size-6" />}
          <span className="font-medium hidden lg:block">{isGroupChatSelected ? "Groups" : "Friends"}</span>
        </div>
        {/* TODO: Online filter toggle */}
        {/* {!isGroupChatSelected && <div className="mt-3 hidden lg:flex items-center gap-2">
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
        </div>} */}
      </div>

      {isGroupChatSelected ? <GroupChatSidebar /> : <ChatSidebar />}

    </aside>
  );
};

export default Sidebar;