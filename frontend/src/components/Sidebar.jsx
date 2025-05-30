import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { useEffect,useState } from 'react';
import SidebarSkeleton from './skeletons/SidebarSkeleton.jsx';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useRef } from 'react';


const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, latestMessages } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const sortedUsers = [...users].sort((a, b) => {
    const timeA = latestMessages[a._id]?.createdAt;
    const timeB = latestMessages[b._id]?.createdAt;
    return new Date(timeB) - new Date(timeA); // newest message first
  });
  

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-s text-green-500">({onlineUsers.length-1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 ">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors cursor-pointer
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute top-0 right-0 size-3 bg-green-500 
                  rounded-full"
                />
              )}
            </div>
            

            
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>

              <div className="text-sm text-zinc-400">
                  {/* show latest message */}
                
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
        {filteredUsers.length !== 0 && (
          <div className="text-center text-zinc-500 py-4">{filteredUsers.length} Contacts</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar