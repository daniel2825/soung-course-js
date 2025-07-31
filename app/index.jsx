import React from "react";
import { Button, View, StyleSheet } from "react-native";
import { useRoute } from '@react-navigation/native';

import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import Home from "./Home/init";

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
  return (
    <Authenticator.Provider>
      <Authenticator socialProviders={['google']}>
        <Home />
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