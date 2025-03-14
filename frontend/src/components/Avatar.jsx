import React, { useEffect, useRef, useState } from "react";

const Avatar = ({ user, size = "32", border = "0", position = "left" }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const avatarRef = useRef(null);

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
          className="absolute -top-5 mt-2 p-4 bg-white shadow-lg rounded-md border z-10"
          style={{
            [position]: `100%`,
          }}
        >
          <h3 className="text-lg font-semibold">{user?.username}</h3>
          <p>{user?.email}</p>
          <div onClick={(e) => handleClick(e)} className="mt-2 text-red-500">
            Close Panel
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
