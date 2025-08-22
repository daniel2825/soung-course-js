import {View, Text} from 'react-native'
import React from 'react'
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

export default function Personal(){
    const { user } = useAuthenticator();

    const emailInput = user.signInDetails.loginId;
  
    const [addPerson, { loading, error }] = useMutation(PERSON_MUTATION);

    addPerson({
      variables: {
        person:{
          name: "Medico",
          email: emailInput,
        }
      },
    });

    return (
        <View>
            <Text>Personal info</Text>
        </View>
    )
}
