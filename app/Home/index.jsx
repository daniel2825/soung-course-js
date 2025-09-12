import { TextInput, Button ,View, Text} from 'react-native'
import { useRoute } from '@react-navigation/native';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import Header from '../../components/Home/header'
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';


const PERSON_MUTATION = gql`
mutation AddPerson($person: PersonInput!) {
  addPerson(
    person: $person
  ) {
    name
  }
}`;

const Personal = () => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setnameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [birthDateInput, setBirthDayInput] = useState('');

  const [addPerson, { loading, error, data }] = useMutation(PERSON_MUTATION);
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params;

  useEffect(() => {
    setEmailRegisted();
  }, []);

  const setEmailRegisted = () => {
    setEmailInput(email);
  }
  
  const savePersonalInformation = async() => {

    try{

      const { data } = await 
      addPerson({
              variables: {
                person:{
                  name: nameInput,
                  email: emailInput,
                  lastName: lastNameInput,
                  birthDay: birthDateInput 
                }     
              },
            });
      console.log("data", data);
      navigation.navigate("(tabs)");
  }

    catch(err){
      console.log("un expected error", err);
    }

  }

  return (
    <View>
      <Text>Personal info</Text>
      <TextInput
        readOnly
        label={'Email'}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} // Basic styling
        onChangeText={text => setEmailInput(text)} // Update state on text change
        value={emailInput} // Bind the input value to the state
        placeholder="Enter text here..." // Placeholder text
      />
      <TextInput
        label={'Name'}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} // Basic styling
        onChangeText={text => setnameInput(text)} // Update state on text change
        value={nameInput} // Bind the input value to the state
        placeholder="Enter text here..." // Placeholder text
      />
      <TextInput
        label={'Last Name'}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} // Basic styling
        onChangeText={text => setLastNameInput(text)} // Update state on text change
        value={lastNameInput} // Bind the input value to the state
        placeholder="Enter text here..." // Placeholder text
      />
      <TextInput
        label={'Birthday'}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} // Basic styling
        onChangeText={text => setBirthDayInput(text)} // Update state on text change
        value={birthDateInput} // Bind the input value to the state
        placeholder="Enter text here..." // Placeholder text
      />
       <Button
      title="Guardar"
      onPress={() => savePersonalInformation()}
    />
    </View>
  );
};

export default Personal;