import React from 'react';
import { ChatContainer, GroupChatContainer, NoChatSelected, Sidebar } from '../components';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const { selectedChat } = useSelector(state => state.chat);
  const { selectedGroupChat } = useSelector(state => state.groupChat);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {selectedChat ? <ChatContainer /> : selectedGroupChat ? <GroupChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;