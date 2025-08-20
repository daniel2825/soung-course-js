import React from "react";
import { StyleSheet } from "react-native";
import { useRoute } from '@react-navigation/native';

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react-native";
import Home from "./Home/init";
import { ApolloProvider } from '@apollo/client';
import client from '../clients/apolloClient';
import {View, Text, TextInput, Button} from 'react-native'


// https://docs.amplify.aws/react-native/build-a-backend/auth/set-up-auth/
// https://blog.logrocket.com/aws-amplify-react-native-tutorial-examples/
// https://ui.docs.amplify.aws/react/connected-components/authenticator/customization
// https://genotechies.medium.com/expo-and-aws-amplify-auth-error-an-unknown-error-has-occurred-77b361620ae7
// https://docs.amplify.aws/react-native/start/quickstart/
// https://www.youtube.com/watch?v=SF4K1kDmHwU
//https://blog.logrocket.com/aws-amplify-react-native-tutorial-examples/ themes

import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const App = () => {
  const route = useRoute();
  const currentRouteName = route.name;
  console.log("current name",currentRouteName);

  const MySignUp = ({ fields, handleSignUp }) => {
    // Implement your custom sign-up form with desired fields and validation
    return (
      <View>
        <Text>Custom Sign Up</Text>
        <TextInput placeholder="Correo" />
        <TextInput placeholder="Contraseña" secureTextEntry />
        <TextInput placeholder="Confirmar Contraseña" secureTextEntry />
        <TextInput placeholder="Nombres" />
        <TextInput placeholder="Apellidos" />
        <TextInput placeholder="Fecha de nacimiento" />
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    );
  };

  const myFormFields = {
    signUp: {
      email: {
        label: 'Your Email Address',
        placeholder: 'Enter your email',
        required: true,
      },
      password: {
        label: 'Create a Password',
        placeholder: 'Choose a strong password',
      },
      'custom:firstName': { // Example of a custom attribute
        label: 'First Name',
        placeholder: 'Enter your first name',
        required: true,
      },
    },
    // You can also customize signIn, forgotPassword, etc.
  };
  

  return (
    <Authenticator.Provider>
      <Authenticator formFields={myFormFields} components={{ SignUp: MySignUp }} socialProviders={['google']}>
        <ApolloProvider client={client}>
          <Home />
        </ApolloProvider>
      </Authenticator>
    </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  }
});

export default App;