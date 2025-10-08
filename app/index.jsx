
import { ImageBackground, Image ,StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ThemeProvider } from '@aws-amplify/ui-react-native';
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react-native";
import MainNavigator from "./Main_navigator/main_navigator"
import { ApolloProvider } from '@apollo/client';
import client from '../clients/apolloClient';
import { I18n } from 'aws-amplify/utils';
import { translations } from '@aws-amplify/ui';

// https://docs.amplify.aws/react-native/build-a-backend/auth/set-up-auth/
// https://blog.logrocket.com/aws-amplify-react-native-tutorial-examples/
// https://ui.docs.amplify.aws/react/connected-components/authenticator/customization
// https://genotechies.medium.com/expo-and-aws-amplify-auth-error-an-unknown-error-has-occurred-77b361620ae7
// https://docs.amplify.aws/react-native/start/quickstart/
// https://www.youtube.com/watch?v=SF4K1kDmHwU
//https://blog.logrocket.com/aws-amplify-react-native-tutorial-examples/ themes
// https://docs.amplify.aws/react/build-a-backend/storage/set-up-storage/

import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
// Set default vocabulary and override for English
I18n.putVocabularies(translations);
I18n.setLanguage('es');
I18n.putVocabulariesForLanguage('es', {
  'Sign In': 'Ingresar',
  'Sign in': 'Ingresar',
  'Create Account': 'Crear Cuenta',
  'Email': 'Correo electrónico',
  'Password': 'Contraseña',
  'Forgot Password?': 'Olvidaste Contraseña',
  'Sign Out': 'Salir',
});


const theme = {
  components: {
   
    button: {
      container: {
        backgroundColor: '#4c4d50ff',
        
      }
    },
    link: {
      text: {
        fontSize: 14, // ✅ Link text like "Forgot Password?"
      },
    },
  },
  tokens: {
    colors: {
      white: '#c0c0c0ff',
      gray: '#353536ff',
      primary: {
        80: '#502a11ff'
      },
      background: {
        primary: '{colors.gray}',
        secondary: '{colors.white}'
      },
      font: {
        primary: '{colors.white}',
        size: 23,
        secondary: '{colors.white}',
        error: '#d7d5ddff',
        success: '#566957ff'
      }
    }
  }
}

const formFields = {
  signUp: {
    phone_number: {
      dialCodeList: ['+1', '+57', '+227', '+229']
    },
  },
}

const App = () => {
  const route = useRoute();
  const currentRouteName = route.name;
  console.log("current name",currentRouteName);

  return (

    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Authenticator.Provider>
            <Authenticator formFields={formFields} >
                <MainNavigator />
            </Authenticator>
        </Authenticator.Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;