import { Button,Image ,Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { signOut } from 'aws-amplify/auth';

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View>
      <Button style={style.button} title="Salir" onPress={handleSignOut}/>
    </View>
  );
};

const Home = () => {

const router = useRouter();
  return (
    <View   
      style={{
        flex: 1,
        backgroundColor: Colors.BLACK
      }}
    >

        <Authenticator.Provider>
        <SignOutButton />
      </Authenticator.Provider>
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
           onPress={() => router.push('/(tabs)/home')}>
              <Text style={style.buttonText}>Iniciar</Text>
           </TouchableOpacity>

      </View>
      
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