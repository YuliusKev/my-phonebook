import React from 'react';
import logo from './logo.svg';
import './App.css';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider,
  HttpLink,
  from 
} from '@apollo/client'
import {onError} from '@apollo/client/link/error'
import ShowLists from "./Components/GetContactLists" 
import InputContactForm from './Components/InputContact/InputContact';
import ContactHeader from './Components/ContactHeader';
import {
  Routes, Route
} from "react-router-dom";

const errorLink = onError(({ graphQLErrors,networkError }) => {
  if(graphQLErrors){
    graphQLErrors.map(({message, locations, path}) => {
      alert(`Graphql ERROR,  ${message}`)
    })
  }
})
const link = from([
  errorLink,
  new HttpLink({uri: "https://wpe-hiring.tokopedia.net/graphql"})
])

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
})

function App() {
  return (
    <ApolloProvider client={client}> 
      <ContactHeader />
      <Routes>
        <Route path="/" element={<ShowLists />} />
        <Route path="/input-contact" element={<InputContactForm />} />
      </Routes>
  </ApolloProvider>
  )
}

export default App;
