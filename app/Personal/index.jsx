import {View, Text} from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import Header from '../../components/Home/header'

const PERSON_MUTATION = gql`
mutation AddPerson($person: PersonInput!) {
  addPerson(
    person: $person
  ) {
    name
  }
}`;

const Personal = () => {
  //const { email } = route; // Destructure the params object
  const route = useRoute();
  const { email } = route.params;
  console.log(email);

  return (
    <View>
      <Text>Personal info</Text>
    </View>
  );
};

export default Personal;