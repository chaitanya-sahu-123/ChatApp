import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

export const useSocketMessageHandler = () => {
  const { socket, authUser } = useAuthStore();
  const { setLatestMessage } = useChatStore();

  useEffect(() => {
    if (!socket || !authUser) return;

    const handleNewMessage = (message) => {
      const otherUserId =
        message.senderId === authUser._id
          ? message.receiverId
          : message.senderId;

      setLatestMessage(otherUserId, message);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, authUser, setLatestMessage]);
};
