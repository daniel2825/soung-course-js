import { Button ,View, Text} from 'react-native'
import React from 'react'
import Header2 from '../../components/Home/header2'
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";

const SignOutButton = () => {
    const { signOut } = useAuthenticator();
  
    return (
      <View >
        <Button title="Sign Out" onPress={signOut} />
      </View>
    );
  };


export default function Profile(){
          
    return (
        <View>
            <Header2/>
            <Text>profile</Text>
            
            <Authenticator.Provider>
        <SignOutButton />
    </Authenticator.Provider>
        </View>
    )
}
