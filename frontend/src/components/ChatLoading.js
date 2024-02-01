import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <div>
    <Stack>
    <Skeleton height="45px"></Skeleton>
      <Skeleton height="45px"></Skeleton>
        <Skeleton height="45px"></Skeleton>
          <Skeleton height="45px"></Skeleton>
            <Skeleton height="45px"></Skeleton>
              <Skeleton height="45px"></Skeleton>
                <Skeleton height="45px"></Skeleton>
                  <Skeleton height="45px"></Skeleton>
                    <Skeleton height="45px"></Skeleton>
                    <Skeleton height="45px"></Skeleton>
                    <Skeleton height="45px"></Skeleton>
                    
    </Stack>
    </div>
  )
}

export default ChatLoading