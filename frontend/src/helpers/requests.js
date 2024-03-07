export const createAccount = async (accountInfo) => {
  const baseLink = "/api/v1/accounts";
  const response = await fetch(baseLink, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: accountInfo,
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 201) {
    return data;
  } else {
    console.log(`Failed to create an account. ${data.Error}`);
  }
};

export const getAccountId = async (emailAddr) => {
  const baseLink = `/api/v1/accounts?email=${emailAddr}`;
  const response = await fetch(baseLink, {
    method: "GET",
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 200) {
    return data;
  } else {
    console.log(`Failed to get the account id. ${data.Error}`);
  }
};

// checked ok
export const getOverviewList = async (accountId) => {
  const baseLink = `/api/v1/accounts/${accountId}/items`;
  const response = await fetch(baseLink, {
    method: "GET",
  }).catch((error) => console.log(error));
  console.log(response);
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 200) {
    return data;
  } else {
    console.log(`Failed to get the account id. ${data.Error}`);
  }
};

/**
 * 
 * @param {String} accountId 
 * @param {JSON} credential 
 * @returns {Boolean} whether the item is successfully modified
 */
export const createCredential = async (accountId, credential) => {
  const baseLink = `/api/v1/accounts/${accountId}/items`;
  const response = await fetch(baseLink, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: credential,
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 201) {
    return true;
  } else {
    console.log(`Failed to create a credential. ${data.Error}`);
    return false;
  }
};

export const getCredential = async (accountId, itemId) => {
  const baseLink = `/api/v1/accounts/${accountId}/items/${itemId}`;
  const response = await fetch(baseLink, {
    method: "GET",
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  return data;
};

/**
 * 
 * @param {String} accountId 
 * @param {String} itemId 
 * @param {JSON} credential 
 * @returns {Boolean} whether the item is successfully modified
 */
export const editCredential = async (accountId, itemId, credential) => {
  // encrypt credential JSON here
  const baseLink = `/api/v1/accounts/${accountId}/items/${itemId}`;
  const response = await fetch(baseLink, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: credential,
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 200) {
    return true;
  } else {
    console.log(`Failed to edit a credential. ${data.Error}`);
    return false
  }
};

export const deleteCredential = async (accountId, itemId, accountInfo) => {
  const baseLink = `/api/v1/accounts/${accountId}/items/${itemId}`;
  const response = await fetch(baseLink, {
    method: "DELETE",
    body: accountInfo,
  }).catch((error) => console.log(error));
  if (response.status === 204) {
    return true;
  } else {
    return false;
  }
};
