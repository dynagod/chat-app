import React, { useEffect, useRef, useState } from 'react';
import { Bell, Loader2, LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/authSlice';
import { acceptFriendRequest, getAllPendingRequests, rejectFriendRequest } from '../features/friendshipSlice';
import { createChat, getUsers } from '../features/chatSlice';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const { friendRequests, acceptingRequest, rejectingRequest } = useSelector(state => state.friendship);

  const [boxOpen, setBoxOpen] = useState(false);

  const dispatch = useDispatch();

  const notificationRef = useRef(null)

  useEffect(() => {
    if (user) dispatch(getAllPendingRequests());
  }, []);

  // Function to handle click outside the notification box
  const handleClickOutside = (e) => {
    if (notificationRef.current && !notificationRef.current.contains(e.target)) {
      setBoxOpen(false); // Close the notification box if clicked outside
    }
  };

  // Add event listener on mount and remove on unmount
  useEffect(() => {
      if (boxOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [boxOpen]);

  const handleAcceptRequest = async (request) => {
    await dispatch(acceptFriendRequest(request._id));
    await dispatch(getAllPendingRequests());
    await dispatch(createChat(request.user1._id));
  };

  const handleRejectRequest = async (request) => {
    await dispatch(rejectFriendRequest(request._id));
    await dispatch(getAllPendingRequests());
  };

  return (
  <header className="absolute bg-base-100 border-b border-base-300 w-full top-0 z-40 backdrop-blur-lg">
    <div className="container mx-auto px-4 h-16">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-8">
          <Link to="/chat" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Chatty</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={"/settings"}
            className={`btn btn-sm gap-2 transition-colors`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {user && (
            <>
              <div className='relative'>
                <button
                  className="relative btn btn-sm gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBoxOpen(!boxOpen);
                  }}
                >
                  <Bell className="size-5" />
                  <span className="hidden sm:inline">Notification</span>
                  {friendRequests.length !== 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 
                      rounded-full ring-zinc-900 p-2 flex items-center justify-center text-white"
                    >
                      {friendRequests.length}
                    </span>
                  )}
                </button>

                {boxOpen && (
                  <div ref={notificationRef} className="overflow-auto absolute max-h-60 -left-20 top-12 bg-base-100 w-50 sm:w-64 p-3 shadow-lg rounded-lg z-50">
                    <ul className="mt-2">
                      {friendRequests.length === 0 ? (
                        <li>No new friend requests</li>
                      ) : (
                        friendRequests.map((request) => (
                          <li key={request._id} className="mt-2 flex items-center justify-between border-b-1">
                            <div className="flex items-center gap-2">
                              <img
                                src={request.user1.avatar}
                                alt={`${request.user1.username}'s profile`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className='text-sm'>{request.user1.username} wants to be your friend</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                disabled={acceptingRequest}
                                className="btn btn-xs btn-success" 
                                onClick={() => handleAcceptRequest(request)}
                              >
                                { acceptingRequest || rejectingRequest ? <Loader2 className="size-6 animate-spin" /> : "Accept" }
                              </button>
                              <button 
                                disabled={acceptingRequest}
                                className="btn btn-xs btn-error" 
                                onClick={() => handleRejectRequest(request)}
                              >
                                { acceptingRequest || rejectingRequest ? <Loader2 className="size-6 animate-spin" /> : "Reject" }
                              </button>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button className="btn btn-sm gap-2 bg-red-600 hover:bg-red-700 text-white" onClick={() => dispatch(logoutUser())}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
  );
};

export default Navbar;