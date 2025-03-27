import {
  Check,
  Eraser,
  Pencil,
  Settings,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteGroup,
  setSelectedGroupChat,
  updateGroupName,
} from "../features/groupChatSlice";
import { useEffect, useRef, useState } from "react";
import { deleteMessage } from "../features/messageSlice";

const GroupChatHeader = () => {
  const { selectedGroupChat } = useSelector((state) => state.groupChat);
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { conversationType, conversationId } = useSelector(
    (state) => state.message
  );

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroupChat.name);

  useEffect(() => {
    setGroupName(selectedGroupChat.name);
  }, [selectedGroupChat]);

  const dispatch = useDispatch();

  const settingRef = useRef(null);

  useEffect(() => {
    setIsAdmin(selectedGroupChat.admin === user._id);
  }, [selectedGroupChat, user]);

  const handleClickDelete = () => {
    dispatch(deleteGroup(selectedGroupChat._id));
    dispatch(setSelectedGroupChat(null));
  };

  const handleGroupNameUpdate = () => {
    if (groupName !== selectedGroupChat.name)
      dispatch(
        updateGroupName({ groupId: selectedGroupChat._id, name: groupName })
      );
    setIsEditingGroupName(false);
  };

  const handleClickOutside = (e) => {
    if (settingRef.current && !settingRef.current.contains(e.target)) {
      setIsSettingsOpen(false); // Close the notification box if clicked outside
    }
  };

  useEffect(() => {
    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedGroupChat.image} alt={selectedGroupChat.name} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedGroupChat.name}</h3>
            <p className="text-sm text-base-content/70">
              {selectedGroupChat.users.map((member, idx) => (
                <span key={idx}>
                  {idx === 0 ? "" : ", "}
                  {member.username}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm gap-2 transition-colors"
            onClick={() => {}}
          >
            <Users className="size-5" />
            <span className="hidden sm:inline">Members</span>
          </button>

          <button
            className="btn btn-sm gap-2 transition-colors"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="size-5" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {isSettingsOpen && (
            <div className="fixed inset-0 bg-base-100/70 bg-opacity-50 flex justify-center items-center z-50">
              <div
                ref={settingRef}
                className="bg-base-200 p-6 rounded-lg w-96 shadow-lg relative"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Group Settings</h2>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="btn h-8 px-3 btn-error text-white"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" />
                    Group Name
                  </div>
                  <div className="form-control mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        disabled={!isEditingGroupName}
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full`}
                      />
                      {isAdmin && (
                        <button
                          type="button"
                          className={`absolute inset-y-1 right-0 mr-1.5 flex items-center px-4 rounded-lg cursor-pointer text-white ${
                            isEditingGroupName ? "bg-green-600" : "bg-amber-500"
                          }`}
                          onClick={() => {
                            if (isEditingGroupName) handleGroupNameUpdate();
                            else setIsEditingGroupName(true);
                          }}
                        >
                          {!isEditingGroupName ? (
                            <Pencil className="h-5 w-5" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Clear Messages */}
                <button
                  className="btn btn-sm gap-2 w-full p-6"
                  onClick={() => {
                    dispatch(
                      deleteMessage({ conversationId, conversationType })
                    );
                    setIsSettingsOpen(false);
                  }}
                >
                  <Eraser className="size-5" />
                  <span className="text-xl">Clear All Messages</span>
                </button>
              </div>
            </div>
          )}

          {isAdmin && (
            <button
              className="btn btn-sm gap-2 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleClickDelete}
            >
              <Trash2 className="size-5" />
              <span className="hidden sm:inline">Dlelete Group</span>
            </button>
          )}

          {/* Close button */}
          <button
            onClick={() => dispatch(setSelectedGroupChat(null))}
            className="cursor-pointer"
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default GroupChatHeader;
