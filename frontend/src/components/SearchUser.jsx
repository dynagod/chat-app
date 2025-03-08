import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendFriendRequest } from '../features/friendshipSlice';
import { Loader2 } from 'lucide-react';

const SearchUser = () => {
    const { sendingRequest } = useSelector(state => state.friendship)

    const [value, setValue] = useState("");
    const dispatch = useDispatch();

    return (
    <>
    <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
            <div className="form-control w-3xs">
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
                        type='button'
                        disabled={sendingRequest}
                        className="absolute inset-y-1 right-0 mr-1.5 flex items-center px-4 rounded-lg cursor-pointer bg-green-600 text-white"
                        onClick={() => {
                            if (value) dispatch(sendFriendRequest(value));
                            setValue("");
                        }}
                    >
                        { sendingRequest ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add" }
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
    );
};

export default SearchUser;