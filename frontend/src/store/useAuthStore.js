import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";

import toast from "react-hot-toast";

import { io } from "socket.io-client";

const BASEURL=import.meta.env.MODE==='development'?'http://localhost:3000':'/api';
// const BASEURL='/';

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    // login: (user) => set({ authUser: user }),

    checkAuth: async () => {
        // try {
        //   // refreshAccessToken();
        //   const res = await axiosInstance.get("/auth/check");
    
        //   set({ authUser: null });
        //   // get().connectSocket();
        // } catch (error) {
        //   console.log("Error in checkAuth:", error);
        //   set({ authUser: null });
        // }
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data });
          get().connectSocket();
          
        } catch (error) {
          console.log("Auth Check Failed:", error.response?.data || error);
          set({ authUser: null });
          
        }
        finally {
          set({ isCheckingAuth: false });
        }
      },

    signup: async(data)=>{
        set({isSigningUp:true});
        try {
            const res=await axiosInstance.post('/auth/signup',data);
            set({authUser:res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
        finally{
            set({isSigningUp:false});
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout', {}, {
                headers: {
                    // Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            // localStorage.removeItem("authToken"); // Remove JWT token
            set({ authUser: null });
            console.log("Logged out successfully");
            toast.success('Logged out successfully');
            get().disconnectSocket();
        } catch (error) {
            console.error("Logout Failed:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
          console.log("Logged in successfully");
    
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      updateProfile: async(data) =>{
          set({isUpdatingProfile:true});
          try {
            const res=await axiosInstance.put('/auth/update-profile',data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
          } catch (error) {
              console.log('Error in Updating Profile',error);
              toast.error(error.response.data.message);
          }
          finally{
            set({isUpdatingProfile:false});
          }
      },
      connectSocket:()=>{
        const { authUser } = get();
        if(!authUser || get().socket?.connected) return;
        const socket=io(BASEURL,{
            query:{
              userId:authUser._id,
            },
          }
        )
        socket.connect();
        set({socket:socket});
        socket.on('getOnlineUsers',(userIds)=>{
            set({onlineUsers:userIds});
        })
      },
      disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
        console.log("Disconnected from socket");
      }

}))