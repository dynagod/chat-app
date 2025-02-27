import React from 'react';
import { ChatContainer, NoChatSelected, Sidebar } from '../components';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const { selectedChat } = useSelector(state => state.chat);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedChat ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;