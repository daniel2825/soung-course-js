import { Button ,View, Text,Touchable, TouchableOpacity, StyleSheet} from 'react-native'
import Colors from '../../constants/Colors'
import React from 'react'
import { useRouter } from 'expo-router';
import Header2 from '../../components/Home/header2'
import { signOut } from 'aws-amplify/auth';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";


export default function Profile(){
  const router = useRouter();

  const style = StyleSheet.create({
    button:{
      padding: 15,
      backgroundColor: Colors.WHITE,
      marginTop: 20,
      borderRadius: 30,
      borderWidth: 12,
      borderColor: Colors.WHITE
  
    },
    buttonText:{
      textAlign: 'center',
      fontSize: 18,
      color: Colors.BLACK
    }
  })
  const SignOutButton = () => {
  
    return (
      <View>
        <Button style={style.button} title="Salir" onPress={handleSignOut}/>
      </View>
    );
  };    

  async function handleSignOut() {
    try {
      await signOut();
      // User is now signed out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

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
