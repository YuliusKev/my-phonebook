import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider,
  HttpLink,
  from,
  NormalizedCacheObject
} from '@apollo/client'
import { persistCache, LocalStorageWrapper, CachePersistor } from 'apollo3-cache-persist';
import {onError} from '@apollo/client/link/error'
import ShowLists from "./Components/GetContactLists" 
import InputContactForm from './Components/InputContact';
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
const cache = new InMemoryCache();


function App() {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  // const [persistor, setPersistor] = useState<
  //   CachePersistor<NormalizedCacheObject>
  // >();

  useEffect(() => {
    async function init() {
      await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
      });

      setClient(
        new ApolloClient({
          link,
          cache,
        }),
      );
    }

    init().catch(console.error);
  }, []);

  if (!client) {
    return <h2>Initializing app...</h2>;
  }

  return (
    <ApolloProvider client={client}> 
      <ContactHeader />
      <Routes>
        <Route path="/" element={<ShowLists />} />
        <Route path="/input-contact" element={<InputContactForm />} />
        <Route path="/input-contact/:id" element={<InputContactForm />} />
      </Routes>
  </ApolloProvider>
  )
}

export default App;
