import React from "react";
import { Button, View, StyleSheet } from "react-native";

import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import Home from "./Home/index";

// https://docs.amplify.aws/react-native/build-a-backend/auth/set-up-auth/
// https://blog.logrocket.com/aws-amplify-react-native-tutorial-examples/
// https://ui.docs.amplify.aws/react/connected-components/authenticator/customization
// https://genotechies.medium.com/expo-and-aws-amplify-auth-error-an-unknown-error-has-occurred-77b361620ae7
// https://docs.amplify.aws/react-native/start/quickstart/
// https://www.youtube.com/watch?v=SF4K1kDmHwU

import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator socialProviders={['google']}>
        <SignOutButton />
        <Home />
      </Authenticator>
    </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  signOutButton: {
    alignSelf: "flex-end",
    display: 'none'
  },
});

export default App;