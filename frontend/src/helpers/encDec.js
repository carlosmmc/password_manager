async function getKeyMaterial(password) {
  // based on example from the documentation for derivekey() found at:
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey 
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
}

export const getIV = () => {
  const iv = new Uint8Array(12);
  return window.crypto.getRandomValues(iv);
}

export const arrToStr = (typedArr) => {
  const str = Array.from(typedArr)
    .map((b) => b.toString())
    .join("");
  return str;
}

export const idHash = async (id) => {
  const enc = new TextEncoder();
  const idArr = enc.encode(id)
  const hashBuf = await crypto.subtle.digest("SHA-256", idArr);
  const hashArr = new Uint8Array(hashBuf);
  const hashStr = arrToStr(hashArr);
  return hashStr.slice(0, 10);
}

export const makeKey = async (pw, sk) => {
  const keyMaterial = await getKeyMaterial(pw);
  const enc = new TextEncoder();
  const salt = enc.encode(sk);
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 650000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

export const setupMasterKey = async (pw, sk, skID) => {
  localStorage.setItem(skID, sk);
  const key = await makeKey(pw, sk);
  const expKey = await window.crypto.subtle.exportKey("raw", key)
  const hashArr = new Uint8Array(expKey);
  const arrKey = Array.from(hashArr);
  const keyObj = JSON.stringify(arrKey);
  sessionStorage.setItem("mk", keyObj);
  return
}

export const getKey = async () => {
  const thisKey = sessionStorage.getItem("mk");
  const mkObj = JSON.parse(thisKey);
  const mkUint8 = new Uint8Array(mkObj)
  return window.crypto.subtle.importKey(
    "raw",
    mkUint8.buffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"],
  )
}

export const encrypt = async (plaintext, iv, key) => {
  const txtEnc = new TextEncoder();
  const encPtxt = txtEnc.encode(plaintext);
  const encBuf = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encPtxt);
  const encArr = new Uint8Array(encBuf);
  return Array.from(encArr);
}

export const encOnD = async (encParams, plainParams) => {
  const cred = JSON.parse(JSON.stringify(plainParams));
  const iv = getIV()
  const key = await getKey();
  const overviewEnc = await encrypt(encParams.appName, iv, key);
  const overviewEncArr = new Uint8Array(overviewEnc);
  cred.overview = JSON.stringify([Array.from(iv), Array.from(overviewEncArr)]);
  const details = JSON.stringify({
    website: encParams.website,
    email: encParams.email,
    password: encParams.password,  
  })
  const detailsEnc = await encrypt(details, iv, key);
  const detailsEncArr = new Uint8Array(detailsEnc);
  cred.details = JSON.stringify([Array.from(iv), Array.from(detailsEncArr)])
  return cred;
}

export const decrypt = async (ctxtObj, iv, key) => {
  const decArr = new Uint8Array(ctxtObj);
  const ptxtBuf = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, decArr.buffer);
  const ptxtArr = new Uint8Array(ptxtBuf);
  const ptxt = new TextDecoder().decode(ptxtArr);
  return ptxt;
}

