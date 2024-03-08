/**
 *
 * @param {String} emailAddr
 * @returns {Boolean} whether an account infromation is created by this request
 */
export const createAccount = async (emailAddr) => {
  // encrypt user email into account info here
  const accountInfo = emailAddr;
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
    return true;
  } else {
    console.log(`Failed to create an account. ${data.Error}`);
    return false;
  }
};

/**
 * @param {String} emailAddr user email address
 * @returns {String} account ID for this user email address
 */
export const getUserId = async (emailAddr) => {
  const baseLink = `/api/v1/accounts?email=${emailAddr}`;
  const response = await fetch(baseLink, {
    method: "GET",
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });

  // decrypt if necessary
  if (response.status === 200) {
    return data;
  } else {
    console.log(`Failed to get the account id. ${data.Error}`);
  }
};

/**
 *
 * @param {String} userId
 * @returns {Array} array of decrypted account overview information
 */
export const getOverviewList = async (userId) => {
  const baseLink = `/api/v1/accounts/${userId}/items`;
  const response = await fetch(baseLink, {
    method: "GET",
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 200) {
    // decrypt data here and return the decrypted version in a list like this [{id:"abcd", name:"amazon"}]
    return data;
  } else {
    console.log(`Failed to get the account overview list. ${data.Error}`);
  }
};

/**
 *
 * @param {String} userId
 * @param {JSON} credential
 * @returns {Boolean} whether the item is successfully modified
 */
export const createCredential = async (userId, credential) => {
  // encrypt credential information here
  const baseLink = `/api/v1/accounts/${userId}/items`;
  const response = await fetch(baseLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
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

/**
 *
 * @param {String} userId
 * @param {String} itemId
 * @returns
 */
export const getCredential = async (userId, itemId) => {
  const baseLink = `/api/v1/accounts/${userId}/items/${itemId}`;
  const response = await fetch(baseLink, {
    method: "GET",
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 200) {
    // decrypt data here and return the decrypted data in JSON format
    return data;
  } else {
    console.log(`Failed to get a set of credentials. ${data.Error}`);
  }
};

/**
 *
 * @param {String} userId
 * @param {String} itemId
 * @param {JSON} credential
 * @returns {Boolean} whether the item is successfully modified
 */
export const editCredential = async (userId, itemId, credential) => {
  // encrypt credential JSON here
  const baseLink = `/api/v1/accounts/${userId}/items/${itemId}`;
  const response = await fetch(baseLink, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 200) {
    return true;
  } else {
    console.log(`Failed to edit a credential. ${data.Error}`);
    return false;
  }
};

export const deleteCredential = async (userId, itemId, accountInfo) => {
  const baseLink = `/api/v1/accounts/${userId}/items/${itemId}`;
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
