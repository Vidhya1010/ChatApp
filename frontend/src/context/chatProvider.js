import React, { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat,setSelectedChat]=useState();
  const[chats,setChats]=useState([]);
  const history = useHistory();
  const[notification,setNotification]=useState([])

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // Check if history is defined and has the push method before using it
    if (!userInfo ) {
     if (history && history.push) {
      history.push("/");
    }
    }
  }, [history]);

  return (
    <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
