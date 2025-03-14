import React, { useState, useEffect, useRef } from "react";
import { Loader2, Mail, Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createGroupChat } from "../features/groupChatSlice";

const CreateGroupButton = () => {
  const { creatingGroupChat } = useSelector((state) => state.groupChat);
  const { friends } = useSelector((state) => state.friendship);

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [groupCredentials, setGroupCredentials] = useState({
    name: "",
    users: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupCredentials.name.trim() && groupCredentials.users.length > 1) {
      const usersId = groupCredentials.users.map(u => u._id);
      await dispatch(createGroupChat({ name: groupCredentials.name, users: usersId }));
      setGroupCredentials({
        ...groupCredentials,
        name: "",
        users: [],
      });
      setIsOpen(false);
    }
  };

  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
      setGroupCredentials({
        ...groupCredentials,
        name: "",
        users: [],
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setGroupCredentials({
      ...groupCredentials,
      name: "",
      users: [],
    });
  };

  return (
    <div>
      {/* Button to open the modal */}
      <div className="border-b border-base-300 p-2">
        <button
          onClick={toggleModal}
          className={`w-full p-3 flex items-center gap-3 rounded-full lg:rounded-2xl hover:bg-base-300 transition-colors cursor-pointer`}
        >
          <div className="relative mx-auto lg:mx-0">
            <Plus className="size-6 object-cover rounded-full" />
          </div>
          <div className="hidden lg:block text-center min-w-0">
            <div className="font-medium truncate">Create Group</div>
          </div>
        </button>
      </div>

      {/* Modal content */}
      {isOpen && (
        <div className="fixed inset-0 bg-base-100/70 bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-base-200 p-6 rounded-lg w-96 shadow-lg relative"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Group</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="btn h-8 px-3 btn-error text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control mb-3">
                <label className="label">
                  <span className="label-text font-medium">Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`input input-bordered w-full`}
                    placeholder="Enter group name"
                    value={groupCredentials.name.replace(/\s+/g, " ")}
                    onChange={(e) =>
                      setGroupCredentials({
                        ...groupCredentials,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-control mb-3">
                <label className="label">
                  <span className="label-text font-medium">Members you want in this group</span>
                </label>
                <div className="flex items-center gap-2">
                  {friends.length > 0 && (
                    <div className="bg-base-200 p-4 rounded-lg w-full max-h-64 overflow-auto">
                      <div className="flex flex-col gap-4">
                        {friends?.map((friend, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex w-full">
                              <img
                                src={friend?.avatar}
                                alt={friend?.username}
                                className={`size-12 object-cover rounded-full border-2`}
                              />
                              <div className="ml-3">
                                <p>{friend?.username}</p>
                                <p className="text-base-content/60">
                                  {friend?.fullName}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="btn btn-secondary"
                              disabled={groupCredentials.users.includes(friend)}
                              onClick={() => {
                                if (!groupCredentials.users.includes(friend)) {
                                  setGroupCredentials({
                                    ...groupCredentials,
                                    users: [...groupCredentials.users, friend],
                                  });
                                }
                              }}
                            >
                              <Plus />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {friends.length === 0 && <div>You have no friends</div>}
                </div>
                <div className="mt-2">
                  {groupCredentials.users.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {groupCredentials.users.map((user) => (
                        <span
                          key={user._id}
                          className="cursor-pointer"
                          onClick={() => {
                            setGroupCredentials({
                              ...groupCredentials,
                              users: groupCredentials.users.filter(
                                (u) => u._id !== user._id
                              ),
                            });
                          }}
                        >
                          <img
                            src={user?.avatar}
                            alt={user?.username}
                            className={`size-8 object-cover rounded-full border-2`}
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={
                  creatingGroupChat ||
                  groupCredentials.users.length < 2 ||
                  !groupCredentials.name.trim()
                }
              >
                {creatingGroupChat ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroupButton;
