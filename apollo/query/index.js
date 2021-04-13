import { gql, useQuery } from '@apollo/client';

const SWAP_LISTS = gql`
  query swapListsQuery($first: Int) {
    swapLists(first: $first) {
      id
      sellerTokenAddr
      sellerTokenId
      sellerTokenAmount
      sellerTokenType
      buyerTokenAddr
      buyerTokenId
      buyerTokenType
      buyerTokenAmount
      isActive
      leftAmount
    }
  }
`;

export const getSwapList = (first) => {
  const variables = {
    first,
  };

  return useQuery(SWAP_LISTS, {
    variables,
    notifyOnNetworkStatusChange: true,
  });
};

const GET_SWAP = gql`
  query getSwapQuery($id: String) {
    swapLists(first: 1, where: {
      id: $id
    }) {
      id
      sellerTokenAddr
      sellerTokenId
      sellerTokenAmount
      sellerTokenType
      buyerTokenAddr
      buyerTokenId
      buyerTokenType
      buyerTokenAmount
      isActive
      leftAmount
    }
  }
`;

export const getSwap = (id) => {
  const variables = {
    id,
  };

  return useQuery(GET_SWAP, {
    variables,
    notifyOnNetworkStatusChange: true,
  });
};
