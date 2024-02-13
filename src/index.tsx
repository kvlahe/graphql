import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AppWrapper from './App';
import {ApolloClient, ApolloProvider, InMemoryCache, createHttpLink} from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import Cookies from 'universal-cookie';

const httpLink = createHttpLink({
  uri: 'https://01.kood.tech/api/graphql-engine/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = new Cookies().get('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppWrapper />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
