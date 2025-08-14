import { Button,Image ,Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router';
import { gql, useMutation } from '@apollo/client';

const PERSON_MUTATION = gql`
mutation AddPerson($person: PersonInput!) {
  addPerson(
    person: $person
  ) {
    name
  }
}
`;
  

const Home = () => {
  const [addPerson, { loading, error }] = useMutation(PERSON_MUTATION);
  function send() {
    alert("send information"); 
    addPerson({
      variables: {
        person:{
          name: "profe",
          email: "daniel2825@hotmail.com",
        }
      },
    });
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
           onPress={() => router.push('/(tabs)/home')}>
              <Text style={style.buttonText}>Iniciar</Text>
           </TouchableOpacity>

           <Button style={style.button} onPress={send} title="send information"/>

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