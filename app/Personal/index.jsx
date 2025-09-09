import { TextInput ,View, Text} from 'react-native'
import { useRoute } from '@react-navigation/native';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import Header from '../../components/Home/header'
import React, { useEffect, useState } from 'react';

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



  const route = useRoute();
  const { email } = route.params;

  useEffect(() => {
    setEmailRegisted();
  }, []);

  const setEmailRegisted = () => {
    setEmailInput(email);
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
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} // Basic styling
        onChangeText={text1 => setnameInput(text1)} // Update state on text change
        value={nameInput} // Bind the input value to the state
        placeholder="Enter text here..." // Placeholder text
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} // Basic styling
        onChangeText={text => setLastNameInput(text)} // Update state on text change
        value={lastNameInput} // Bind the input value to the state
        placeholder="Enter text here..." // Placeholder text
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} // Basic styling
        onChangeText={text => setBirthDayInput(text)} // Update state on text change
        value={birthDateInput} // Bind the input value to the state
        placeholder="Enter text here..." // Placeholder text
      />
    </View>
  );
};

export default Personal;