import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupChats,
  setSelectedGroupChat,
} from "../features/groupChatSlice";
import { setConversationTypeAndId } from "../features/messageSlice";
import SidebarSkeleton from "./SidebarSkeleton";
import CreateGroupButton from "./CreateGroupButton";

const GroupChatSidebar = () => {
  const [sortedGroupChats, setSortedGroupChats] = useState([]);

  const { groupChats, selectedGroupChat, isGroupChatsLoading } = useSelector(
    (state) => state.groupChat
  );
  const { user } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGroupChats());
  }, [dispatch]);

  useEffect(() => {
    // Sort group chats whenever groupChats changes
    const sortedChats = [...groupChats].sort((a, b) => {
      const aTimestamp = new Date(a.latestMessage?.createdAt).getTime() || 0;
      const bTimestamp = new Date(b.latestMessage?.createdAt).getTime() || 0;
      return bTimestamp - aTimestamp;
    });

    setSortedGroupChats(sortedChats); // Update the state with sorted chats
  }, [groupChats]);

  if (isGroupChatsLoading) return <SidebarSkeleton />;

  return (
    <>
      <CreateGroupButton />

      <div className="overflow-y-auto w-full py-3">
        {sortedGroupChats.map((groupChat) => (
          <button
            key={groupChat._id}
            onClick={() => {
              dispatch(setSelectedGroupChat(groupChat));
              dispatch(
                setConversationTypeAndId({
                  conversationType: "GroupChat",
                  conversationId: groupChat._id,
                })
              );
            }}
            className={`
                    ml-2 lg:ml-0 lg:w-full p-2 lg:p-3 flex items-center gap-3 rounded-full lg:rounded-2xl
                    hover:bg-base-300 transition-colors cursor-pointer
                    ${
                      selectedGroupChat?._id === groupChat._id
                        ? "bg-base-300 ring-1 ring-base-300"
                        : ""
                    }
                `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={groupChat.image}
                alt={groupChat.name}
                className="size-12 object-cover rounded-full"
              />
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{groupChat.name}</div>
              <div className="text-sm text-zinc-400">
                {groupChat.latestMessage ? (
                  <>
                    <span className="text-base-content/80">
                      {groupChat.latestMessage.sender.username === user.username ? "You" : groupChat.latestMessage.sender.username}:
                    </span>
                    {" "}
                    {groupChat.latestMessage.text ? (
                      groupChat.latestMessage.text.length >= 25 ? groupChat.latestMessage.text.slice(0, 18) + " ....." : groupChat.latestMessage.text
                    ) : (
                      <Image className="w-4 h-4" />
                    )}
                  </>
                ) : (
                  ""
                )}
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
