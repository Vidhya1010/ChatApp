import React, { useEffect, useInsertionEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Box,FormControl,IconButton,Input,Spinner,Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender ,getSenderFull} from '../config/ChatLogics';
import ProfileModel from './Authentication/miscellaneous/ProfileModel';
import UpdateGroupChatModal from './Authentication/miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";

import io from 'socket.io-client'
 const ENDPOINT="http://localhost:5000";
 var socket,selectedChatCompare;
const SingleChat = ({fetchAgain,setFetchAgain}) => {
const [messages,setMessages]=useState([]);
const [loading,setLoading]=useState(false);
const[newMessage,setNewMessage]=useState("");
const [socketConnected,setSocketConnected]=useState(false);
const[typing,setTyping]=useState(false);
const[isTyping,setIsTyping]=useState(false);

const defaultOptions={
  loop:true,
  autoplay:true,
  animationData:animationData,
  rendererSettings:{
    preserveAspectRatio:"xMidYMid slice",
  }
}

const toast=useToast();
    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
    
   const fetchMessages=async ()=>{
  if(!selectedChat) return;
  try {
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`,
      }
    };


    setLoading(true);

    const {data}=await axios.get(`/api/message/${selectedChat._id}`,config)
    
    setMessages(data);
    setLoading(false);
    socket.emit('join chat',selectedChat._id);
    console.log(messages)
  } catch (error) {
    toast({
      title:"Error Occured!",
      description:"Failed to Load the messages",
      status:"error",
      duration:5000,
      isClosable:true,
      position:"bottom",
    })
  }
   };


    useEffect(()=>{
      socket=io(ENDPOINT);
      socket.emit("setup",user);
      socket.on("connected",()=>setSocketConnected(true));
      socket.on('typing',()=> setIsTyping(true))
      socket.on('stop typing',()=>setIsTyping(false));
    },[]);
   useEffect(()=>{
   fetchMessages();
   selectedChatCompare=selectedChat;

   },[selectedChat])


  useEffect(()=>{
    socket.on('message received',(newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id){
       if(!notification.includes(newMessageReceived)){
        setNotification([newMessageReceived,...notification]);
        setFetchAgain(!fetchAgain);
       }
      }else{
        setMessages([...messages,newMessageReceived]);
      }

    })
  })

    const sendMessage=async(event)=>{
    if(event.key==="Enter" && newMessage){
      socket.emit("stop typing",selectedChat._id)
      try {
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`,
          }
        };
 setNewMessage("");
        const {data}=await axios.post('/api/message',{
          content:newMessage,
          chatId:selectedChat._id,
        },config);
   
         socket.emit('new message',data);
        setMessages([...messages,data]);
      } catch (error) {
        toast({
          title:"Error Occured!",
          description:"Failed to send the message"
        })
      }
    }
    }
   
    const typingHandler=(e)=>{
    setNewMessage(e.target.value);

     if(!socketConnected) return;
     if(!typing){
      setTyping(true);
      socket.emit('typing',selectedChat._id);
     }
     let lastTypingTime =new Date().getTime()
     var timerLength=3000;
    setTimeout(()=>{
    var timeNow=new Date().getTime();
    var timeDiff=timeNow-lastTypingTime;

    if(timeDiff>=timerLength && typing){
      socket.emit("stop typing",selectedChat._id);
      setTyping(false);
    }
    },timerLength)
    }
    //     console.log("user:", user);
    // console.log("selectedChat:", selectedChat);
  return (
   <> 
   {selectedChat ? (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={2}
        px={3}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
         <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
          { messages && 
            (!selectedChat.isGroupChat ? (
            <>
              {getSender(user, selectedChat.users)}
              <ProfileModel 
              user={getSenderFull(user, selectedChat.users)} 
              />
            </>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            </>
          ))}
       
      </Text>

      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
          />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}
        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
          {isTyping ? <div>
            <Lottie
            options={defaultOptions}
             width={70}
             style={{marginBottom:15,marginLeft:0}}
            />
            </div>:(
              <></>
              )}
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a Message.."
            onChange={typingHandler}
            value={newMessage}
          />
        </FormControl>
      </Box>
    </>
  ) : (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="100%"
    >
      <Text fontSize="3xl" pb={3} fontFamily="Work sans">
        Click on a user to start chatting
      </Text>
    </Box>
  )
}

   </>
  )
}

export default SingleChat