const api_address = 'https://api.opensea.io/api/v1';

export const getAllAssets = (address, offset = 0, limit = 50) => {
    const options = {method: 'GET'};
    return fetch(`${api_address}/assets?owner=${address}&offset=${offset}&limit=${limit}`, options)
      .then(response => response.json())
      .catch(err => console.error(err));
}