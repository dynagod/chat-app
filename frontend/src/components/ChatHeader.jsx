import { UserX, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChat, getUsers, setSelectedChat } from "../features/chatSlice";
import { useMemo } from "react";
import { removeFriend } from "../features/friendshipSlice";

const ChatHeader = () => {
  const { selectedChat } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const onlineUsers = [];

  const otherUser = useMemo(() => selectedChat?.users.find(u => u._id !== user._id), [selectedChat, user]);

  const handleLogout = async () => {
    await dispatch(removeFriend(otherUser._id));
    await dispatch(setSelectedChat(null));
    await dispatch(deleteChat(selectedChat._id))
    await dispatch(getUsers());
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={otherUser.avatar} alt={otherUser.username} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{otherUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(otherUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Remove Friend */}
        <button className="btn btn-sm gap-2 bg-red-600 hover:bg-red-700" onClick={handleLogout}>
          <UserX className="size-5" />
          <span className="hidden sm:inline">Remove friend</span>
        </button>

        {/* Close button */}
        <button onClick={() => dispatch(setSelectedChat(null))} className="cursor-pointer">
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;