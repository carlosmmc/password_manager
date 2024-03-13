import { getKey, decrypt, encOnD } from './encDec';

/**
 *
 * @param {String} emailAddr
 * @returns {Boolean} whether an account infromation is created by this request
 */
export const createAccount = async (emailAddr) => {
  const accountInfo = {
    email: emailAddr,
    public_key: emailAddr,
    private_key: emailAddr,
    account_key: emailAddr,
  };
  const baseLink = "/api/v1/accounts";
  const response = await fetch(baseLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountInfo),
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
    headers: {
      "Accept": "application/json"
    }
  }).catch((error) => console.log(error));
  if (response.status === 200) {
    const data = await response.json().catch((error) => {
      console.log(error);
    });
    return data;
  } else {
    console.log(`Failed to get the account id.`);
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
    headers: {
      "Accept": "application/json"
    }
  }).catch((error) => {console.log(error)});
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 200) {
    const key = await getKey();
    const itemList = [];
    // decrypt data
    for (let item in data) {
      const itemCopy = JSON.parse(JSON.stringify(data[item]))
      const ctxtObj = JSON.parse(itemCopy.data);
      if (ctxtObj.length === 2) {
        const iv = new Uint8Array(ctxtObj[0])
        const ptxt = await decrypt(ctxtObj[1], iv, key)
        itemCopy.data = ptxt
      }
      itemList.push(itemCopy)
    }
    return itemList;
  } else {
    console.log(`Failed to get the account overview list. ${data.Error}`);
    return []
  }
};

/**
 *
 * @param {String} userId
 * @param {JSON} credential
 * @returns {Boolean} whether the item is successfully modified
 */
export const createCredential = async (userId, kid, credential) => {
  const plainParams = {
    kid: kid,
    enc: "AES-GCM",
    cty: "b5+jwk+json"
  }
  // encrypt credential JSON
  const credEnc = await encOnD(credential, plainParams);
  const baseLink = `/api/v1/accounts/${userId}/items`;
  const response = await fetch(baseLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credEnc),
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
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => console.log(error));
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  if (response.status === 200) {
    const ctxtObj = JSON.parse(data.data);
    if (ctxtObj.length === 2) {
      const key = await getKey();
      const dataCopy = JSON.parse(JSON.stringify(data));
      const iv = new Uint8Array(ctxtObj[0])
      const ptxt = await decrypt(ctxtObj[1], iv, key)
      dataCopy.data = JSON.parse(ptxt);
      return dataCopy;
    } else {
      return data;
    }
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

export const editCredential = async (userId, itemId, kid, credential) => {
  const plainParams = {
    kid: kid,
    enc: "AES-GCM",
    cty: "b5+jwk+json"
  }
  const credEnc = await encOnD(credential, plainParams);
  const baseLink = `/api/v1/accounts/${userId}/items/${itemId}`;
  const response = await fetch(baseLink, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credEnc),
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

/**
 * 
 * @param {String} userId 
 * @param {String} itemId 
 * @returns {Boolean} if account is successfully deleted
 */
export const deleteCredential = async (userId, itemId) => {
  const baseLink = `/api/v1/accounts/${userId}/items/${itemId}`;
  const response = await fetch(baseLink, {
    method: "DELETE",
  }).catch((error) => console.log(error));
  if (response.status === 204) {
    return true;
  } else {
    return false;
  }
};
