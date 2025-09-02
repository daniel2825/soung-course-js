import { Button,Image ,Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthenticator  } from "@aws-amplify/ui-react-native";
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';


const PERSON_QUERY = gql`
   query GetPerson($email: String!) {
    getPerson(email: $email) {
      email
    }
  }`;

  

const Home = () => {
  const { user } = useAuthenticator();

  const emailInput = user.signInDetails.loginId;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const [redirectScreen, setRedirectScreen ] = useState("/default");

  const [getPerson,{ loading, error, data }] = useLazyQuery(PERSON_QUERY, {
    
    onCompleted: () => {
      sleep(2000);
      console.log("data",data);
      setRedirectScreen(data.getPerson === null ? 
        '/Personal/' : '/(tabs)/home');
      console.log("what is route",redirectScreen);
      router.navigate(redirectScreen,{email : emailInput})
    },
    onError: () => {
      console.log("Not d");
    }
  
  });

  useEffect(() => {
  }, []);



function navigateRegisteredOrNot(){
    
    getPerson({
      variables: {
        email: emailInput
      }
    }
  );
  }
 

const router = useRouter();

  return (
        <View   
      style={{
        flex: 1,
        backgroundColor: Colors.BLACK
      }}
    >
     
      <Image source={require('../../assets/images/jair-santrich.png')}
        style={{
          width: '100%',
          height: 300
        }}
      />
      <View style={{
        padding: 25,
        backgroundColor: Colors.BACKGROUND,
        height: '100%',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35
      }}>
           <Text style={{
            fontWeight: 'bold',
            color: Colors.WHITE,
            textAlign: 'center'
           }}>BIENVENIDOS AL CURSO DE CANTO</Text>

           <Text style= {{
            fontSize: 12,
            color: Colors.WHITE,
            marginTop: 20,
            textAlign: 'center'
           }}>
            Transforma tu carrera musical
           </Text>
           <TouchableOpacity style={style.button}
           onPress={() => navigateRegisteredOrNot()}>
              <Text style={style.buttonText}>Iniciar</Text>
           </TouchableOpacity>

      </View>
      
    </View>
      );
};

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

export default Home;