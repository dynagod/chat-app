import { Camera, Check, ChevronRight, Mail, Pencil, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../features/authSlice.js';
import { Avatar } from '../components';

const ProfilePage = () => {
  const { user, isUserUpdating, isAuthenticated } = useSelector(state => state.auth);
  const { friends } = useSelector(state => state.friendship);

  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const[isFriendsPanelOpen, setIsFriendsPanelOpen] = useState(false);

  const [newData, setNewData] = useState({
    fullName: user?.fullName,
    username: user?.username,
  });

  const dispatch = useDispatch();

  const handleImageUpdate = (e) => {
    const formData = new FormData();
    formData.append('avatar', e.target.files ? e.target.files[0] : "");
    if(isAuthenticated) dispatch(updateUser({ updatedField: 'avatar', updatedData: formData }));
  };

  const handleFullNameUpdate = () => {
    if (newData.fullName !== user?.fullName && newData.fullName !== "") dispatch(updateUser({ updatedField: 'fullName', updatedData: { fullName: newData.fullName } }));
    setIsEditingFullName(false);
  };

  const handleUsernameUpdate = () => {
    if (newData.username !== user?.username && newData.username !== "") dispatch(updateUser({ updatedField: 'username', updatedData: { username: newData.username } }));
    setIsEditingUsername(false);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUserUpdating ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpdate}
                  disabled={isUserUpdating}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUserUpdating ? "Uploading..." : "Click the camera icon to update your photo."}
              &nbsp;
              <button onClick={handleImageUpdate} className='text-red-600 cursor-pointer text-sm'>Click to remove the image</button>
            </p>
          </div>

          {/* Friends section */}
          <div className='space-y-6'>
            <div className="flex items-center cursor-pointer" onClick={() => setIsFriendsPanelOpen(!isFriendsPanelOpen)}>
              <div className="text-sm text-zinc-400 flex items-center gap-2 mr-2">
                <User className="w-4 h-4" />
                Friends
              </div>
              <div className="flex ml-2">
                {friends?.slice(0, 3).map((friend, index) => (
                  <div key={index} className="relative -ml-3">
                    <img
                      src={friend?.avatar}
                      alt="Friend Avatar"
                      className="size-10 rounded-full object-cover border-2"
                    />
                  </div>
                ))}
              </div>
              <ChevronRight className='size-4 ml-2' />
            </div>
            {isFriendsPanelOpen && friends.length > 0 && (
              <div className="bg-base-200 p-4 rounded-lg">
                <div className='flex justify-between mb-3'>
                  <h3 className="text-xl">Your Friends</h3>
                  <button
                    onClick={() => setIsFriendsPanelOpen(false)}
                    className="px-4 cursor-pointer bg-red-600 rounded-lg text-white"
                  >
                    <X className='size-4' />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {friends?.map((friend, index) => (
                    <div key={index} className="flex w-full">
                      <Avatar user={friend} size={"48"} border={"2"} />
                      <div className='ml-3'><p>{friend?.username}</p><p className='text-base-content/60'>{friend?.fullName}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {friends.length === 0 && (
              <div>You have no friends</div>
            )}
          </div>

          <div className="space-y-6">
            <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <div className="form-control mb-3">
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditingFullName}
                  value={newData.fullName}
                  onChange={e => setNewData({ ...newData, fullName: e.target.value })}
                  className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full`}
                />
                <button
                  type="button"
                  className={`absolute inset-y-1 right-0 mr-1.5 flex items-center px-4 rounded-lg cursor-pointer text-white ${isEditingFullName ? "bg-green-600" : "bg-amber-500"}`}
                  onClick={() => {
                    if (isEditingFullName) handleFullNameUpdate();
                    else setIsEditingFullName(true);
                  }}
                >
                  {!isEditingFullName ? <Pencil className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" />
              Email
            </div>
            <div className="form-control mb-3">
              <div className="relative">
                <input
                  type="text"
                  disabled={true}
                  value={user?.email}
                  className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full`}
                />
              </div>
            </div>

            <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
              <User className="w-4 h-4" />
              Username
            </div>
            <div className="form-control mb-3">
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditingUsername}
                  value={newData.username}
                  onChange={e => setNewData({ ...newData, username: e.target.value })}
                  className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full`}
                />
                <button
                  type="button"
                  className={`absolute inset-y-1 right-0 mr-1.5 flex items-center px-4 rounded-lg cursor-pointer text-white ${isEditingUsername ? "bg-green-600" : "bg-amber-500"}`}
                  onClick={() => {
                    if (isEditingUsername) handleUsernameUpdate();
                    else setIsEditingUsername(true);
                  }}
                >
                  {!isEditingUsername ? <Pencil className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{user.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;