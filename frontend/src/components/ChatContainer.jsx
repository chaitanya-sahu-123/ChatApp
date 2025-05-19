import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
// import {authUser} from "../store/useAuthStore.js";
// import { subscribeToMessages } from "../store/useChatStore.js";
import { useRef } from "react";


const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages,unsubscribeFromMessages } = useChatStore();
    // const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);
    
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
            subscribeToMessages();
            return ()=> unsubscribeFromMessages();
        }
    }, [selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages]); // Include selectedUser in dependencies

    useEffect(()=>{
        if(messageEndRef.current && messages.length>0)
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[messages]);

    const { authUser } = useAuthStore();

    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            <div className='flex-1 p-4 space-y-4 overflow-auto'>
                {messages.map((message) => (
                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`} ref={messageEndRef}>
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img 
                                    src={message.senderId === authUser._id ? authUser.profile || "/avatar.png" : selectedUser?.profile || "/avatar.png"} 
                                    alt="profile pic" 
                                />
                            </div>
                        </div>
                        <div className='chat-header mb-1'>
                            <time className='text-xs ml-1 opacity-50'>{new Date(message.createdAt).toLocaleString()}</time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                        {message.image && (
                            <img
                            src={message.image}
                            alt="Image cant be displayed"
                            className="sm:max-w-[200px] rounded-md mb-2"
                            />
                        )}
                        {message.text && <p>{message.text}</p>}
                </div>
                </div>
                ))}
            </div>
            <MessageInput />
        </div>
    );
};

export default ChatContainer;
