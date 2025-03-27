import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendFriendRequest } from "../features/friendshipSlice";
import { Loader2, Search, X } from "lucide-react";

const SearchUser = () => {
  const [isSearchPannelOpen, setIsSearchPannelOpen] = useState(false);

  const { sendingRequest } = useSelector((state) => state.friendship);

  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  return (
    <>
      <div className="border-b border-base-300 w-full lg:p-5 p-1">
        <div className="flex items-center gap-2">
          <div className="form-control w-3xs">
            <div className="relative hidden lg:block">
              <input
                type="text"
                disabled={sendingRequest}
                className={`input input-bordered w-full pl-5`}
                placeholder="Add User by username"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button
                type="button"
                disabled={sendingRequest}
                className="absolute inset-y-1 right-0 mr-1.5 flex items-center px-4 rounded-lg cursor-pointer bg-green-600 text-white"
                onClick={() => {
                  if (value) dispatch(sendFriendRequest(value));
                  setValue("");
                }}
              >
                {sendingRequest ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Add"
                )}
              </button>
            </div>

            <div className="lg:hidden flex justify-center">
              <button
                onClick={() => setIsSearchPannelOpen(!isSearchPannelOpen)}
                className="p-4 rounded-full hover:bg-base-300 hover:cursor-pointer"
              >
                <Search />
              </button>
            </div>

            {isSearchPannelOpen && (
              <div className="fixed inset-0 bg-base-100/70 bg-opacity-50 flex justify-center items-center z-50 ">
                <div className="bg-base-200 p-6 rounded-lg w-96 shadow-lg relative">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Search user by username</h2>
                    <button
                      onClick={() => setIsSearchPannelOpen(false)}
                      className="btn h-8 px-3 btn-error text-white"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      disabled={sendingRequest}
                      className={`input input-bordered w-full pl-5`}
                      placeholder="Add User by username"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <button
                      type="button"
                      disabled={sendingRequest}
                      className="absolute inset-y-1 right-0 mr-1.5 flex items-center px-4 rounded-lg cursor-pointer bg-green-600 text-white"
                      onClick={() => {
                        if (value) dispatch(sendFriendRequest(value));
                        setValue("");
                      }}
                    >
                      {sendingRequest ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchUser;
