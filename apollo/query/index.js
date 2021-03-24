import { gql, useQuery } from '@apollo/client';

const TOKEN_BALANCE = gql`
  query tokenBalanceQuery($holderAddress: String, $first: Int) {
    tokenHolders(first: $first, where: { holderAddress: $holderAddress }) {
      tokenId
      contractAddress
      amount
    }
  }
`;

export const useTokenBalance = (holderAddress, first) => {
  const variables = {
    holderAddress,
    first,
  };

  return useQuery(TOKEN_BALANCE, {
    variables,
    notifyOnNetworkStatusChange: true,
  });
};
