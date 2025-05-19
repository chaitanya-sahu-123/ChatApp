import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { useEffect } from 'react';



export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    latestMessages:{},

    
    

    setUsers: (users) => set({ users }),


    setLatestMessage: (userId, message) =>
        set((state) => ({
        latestMessages: {
            ...state.latestMessages,
            [userId]: {
            text: message.text,
            createdAt: message.createdAt,
            },
        },
    })),
    

    getUsers: async() =>{
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get('/messages/users');
            set({users:res.data});
        } catch (error) {
            toast.error('There was an error fetching users');
        }
        finally{
            set({isUsersLoading:false});
        }
    },
    getMessages: async(userId) =>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        } catch (error) {
            toast.error('Error fetching messages');
        }
        finally{
            set({isMessagesLoading:false});
        }

    },
    sendMessage: async(messageData)=>{
        const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
        } catch (error) {
            toast.error('Error sending message');
        }
    },
    subscribeToMessages: ()=>{
        const {selectedUser}=get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on('newMessage',(newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;
            set({messages:[...get().messages,newMessage],});
        });
    },

    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },

    setSelectedUser:(selectedUser) =>set(({selectedUser})),

}))