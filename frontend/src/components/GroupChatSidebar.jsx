import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupChats, setSelectedGroupChat } from '../features/groupChatSlice';
import { setConversationTypeAndId } from '../features/messageSlice';
import SidebarSkeleton from './SidebarSkeleton';
import { Plus } from 'lucide-react';

const GroupChatSidebar = () => {
    const { groupChats, selectedGroupChat, isGroupChatsLoading } = useSelector(state => state.groupChat);

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getGroupChats());
    }, [dispatch]);

    if (isGroupChatsLoading) return <SidebarSkeleton />

  return (
    <>
    <div className='border-b border-base-300 p-2'>
        <button className={`w-full p-3 flex items-center gap-3 rounded-full lg:rounded-2xl hover:bg-base-300 transition-colors cursor-pointer`}>
            <div className="relative mx-auto lg:mx-0"><Plus className="size-6 object-cover rounded-full" /></div>
            <div className="hidden lg:block text-center min-w-0">
                <div className="font-medium truncate">Create Group</div>
            </div>
        </button>
    </div>

    <div className="overflow-y-auto w-full py-3">
        {groupChats.map((groupChat) => (
            <button
                key={groupChat._id}
                onClick={() => {
                    dispatch(setSelectedGroupChat(groupChat));
                    dispatch(setConversationTypeAndId({ conversationType: "GroupChat", conversationId: groupChat._id }));
                }}
                className={`
                    w-full p-3 flex items-center gap-3 rounded-full lg:rounded-2xl
                    hover:bg-base-300 transition-colors cursor-pointer
                    ${selectedGroupChat?._id === groupChat._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
            >
                <div className="relative mx-auto lg:mx-0">
                    <img
                        src={groupChat.avatar}
                        alt={groupChat.name}
                        className="size-12 object-cover rounded-full"
                    />
                </div>

                {/* User info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{groupChat.name}</div>
                    <div className="text-sm text-zinc-400">
                        {/* {
                            groupChat.latestMessage ? groupChat.latestMessage.text ? groupChat.latestMessage.text : <Image className='w-4 h-4' /> :
                            isOnline ? "Online" : "Offline"
                        } */}
                    </div>
                </div>
            </button>
        ))}

        {groupChats.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No Group Chats</div>
        )}
    </div>
    </>
  );
};

export default GroupChatSidebar;