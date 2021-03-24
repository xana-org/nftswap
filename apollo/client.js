import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

let apolloClient;

const GRAPHQL_HTTP_ENDPINT =
  'https://api.thegraph.com/subgraphs/name/bondly/nftswap';

const GRAPHQL_WSS_ENDPOINT =
  'wss://api.thegraph.com/subgraphs/name/bondly/nftswap';

const httpLink = new HttpLink({
  uri: GRAPHQL_HTTP_ENDPINT,
  credentials: 'same-origin',
});

const wssLink = new WebSocketLink({
  uri: GRAPHQL_WSS_ENDPOINT,
  options: {
    reconnect: true,
  },
  webSocketImpl: require('websocket').w3cwebsocket,
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wssLink,
      httpLink
    ),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            tokenHolders: {
              keyArgs: ['where'],
              merge(existing, incoming) {
                // Slicing is necessary because the existing data is
                // immutable, and frozen in development.
                const merged = existing ? existing.slice(0) : [];
                for (let i = 0; i < incoming.length; ++i) {
                  merged[i] = incoming[i];
                }
                return merged;
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
