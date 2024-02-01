import React, { useEffect } from 'react'
import{ Container,Box,Text, Tabs,Tab,TabPanels,TabList, TabPanel} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom'
const HomePage = () => {
    const history=useHistory();
    
    useEffect(()=>{
      const user=JSON.parse(localStorage.getItem("userInfo"));
      if(user) history.push("/chats");
    },[history]);

  return <Container maxW='xl' centerContent>
   <Box 
   display='flex'
   justifyContent='center'
   alignItems='center'
   p={3}
   bg={"white"}
   w="100%"
   m="40px 0 15px 0"
   borderRadius="lg"
   borderWidth="1px"
   >
   <Text 
   fontSize="4xl"
   fontFamily="Work sans"
   alignItems='center'
   color="black"
   >Chat Application</Text>
   </Box>

   <Box bg="white"
   p={4}
   w="100%"
   borderRadius="lg"
   borderWidth="1px"
   color="black"
   >
   <Tabs variant='soft-rounded' >
  <TabList mb='1em'>
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
     <Login />
    </TabPanel>
    <TabPanel>
     <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>

   </Box>
  </Container>
    
  
}

export default HomePage;