import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const useSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketIo = io(url, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    socketRef.current = socketIo;
    setSocket(socketIo);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  return socket;
};

export default useSocket;

