import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { UserCheck2, UserPen, UserPlus2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChat, getUsers, setSelectedChat } from "../features/chatSlice";
import { removeFriend, sendFriendRequest } from "../features/friendshipSlice";

const Avatar = ({ user, size = "32", border = "0", position = "left" }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFriendPanelOpen, setIsFriendPanelOpen] = useState(false);

  const { friends } = useSelector(state => state.friendship);
  const currentUser = useSelector(state => state.auth.user);

  const { isCurrentUserAndUserSame, isFriend } = useMemo(() => {
    const isCurrentUserAndUserSame = currentUser.username === user.username;
    const index = friends.findIndex(friend => friend.username === user.username);
    const isFriend = index !== -1;
    return { isCurrentUserAndUserSame, isFriend };
  }, [user, friends, currentUser]);

  const avatarRef = useRef(null);

  const dispatch = useDispatch();

  const handleRemoveFriend = async () => {
      await dispatch(removeFriend(otherUser._id));
      await dispatch(setSelectedChat(null));
      await dispatch(deleteChat(selectedChat._id))
      await dispatch(getUsers());
    };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsPanelOpen(!isPanelOpen);
  };

  const handleClickOutside = (e) => {
    if (avatarRef.current && !avatarRef.current.contains(e.target)) {
      setIsPanelOpen(false);
    }
  };

  useEffect(() => {
    if (isPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPanelOpen]);

  return (
    <div className="relative">
      <img
        src={user?.avatar}
        alt={user?.username}
        className={`object-cover rounded-full cursor-pointer`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${border}px`,
        }}
        onClick={(e) => handleClick(e)}
      />
      {isPanelOpen && (
        <div
          ref={avatarRef}
          className="absolute -top-5 mt-2 shadow-lg rounded-md border z-10 bg-base-200 w-80"
          style={{
            [position]: `100%`,
          }}
        >
          <div className="bg-base-300 h-28 relative">
            <div className="p-2 text-right">
              {!isCurrentUserAndUserSame && (
                <>
                <button
                  onClick={ isFriend ? () => setIsFriendPanelOpen(!isFriendPanelOpen) : () => dispatch(sendFriendRequest(user.username)) }
                  className={`btn btn-sm gap-2`}
                >
                  {isFriend ? <UserCheck2 className="size-5"/> : <UserPlus2 className="size-5"/>}
                  <span>{ isFriend ? "Friend" : "Add Friend"}</span>
                </button>
                {isFriendPanelOpen && (
                  <button
                    className="absolute top-0 -right-28 p-2 bg-base-200 hover:cursor-pointer hover:bg-base-300 rounded-2xl"
                    onClick={handleRemoveFriend}
                  >
                    Remove Friend
                  </button>
                )}
                </>
              )}

              {isCurrentUserAndUserSame && (
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <UserPen className="size-5" />
                  <span>Edit Profile</span>
                </Link>
              )}
            </div>
            <div className="absolute -bottom-10 left-10">
              <img
                src={user?.avatar}
                alt={user?.username}
                className={`object-cover rounded-full h-20 w-20 border-7 border-base-200`}
              />
            </div>
          </div>
          <div className="p-5 pt-10 flex flex-col">
            <p className="font-extrabold text-xl">{user?.fullName}</p>
            <p>{user?.username}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
