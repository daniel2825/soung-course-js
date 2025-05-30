import { Stack } from "expo-router";
import { UserDetailContext } from '../context/UserDetailContext'
import React, { useContext, useState} from 'react'


export default function RootLayout() {

  const [userDetails,setUserDetails] = useState();

  return (
  //<UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
  <Stack screenOptions={{
    headerShown: false
  }}>

  </Stack>
  //</UserDetailContext.Provider>
)

}
