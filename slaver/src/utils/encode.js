import CryptoJS from 'crypto-js';

const CryptoJSKey = CryptoJS.enc.Utf8.parse('HyperBass_B1ockc');
const iv = CryptoJS.enc.Utf8.parse('B1ockc_HyperBass');
const salt = 'sthjt';

export const CRYPTO_TYPE = {
  AES: 'AES',
  SHA: 'SHA',
}
export const encode = (word, type = CRYPTO_TYPE.SHA) => {
  if(type === CRYPTO_TYPE.SHA) {
    return encodeBySHA(word);
  }
  return encodeByAES(word);
};

export const decode = word => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(srcs, CryptoJSKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};

export function encodeByAES(word) {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, CryptoJSKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toUpperCase();
}

export function encodeBySHA(word) {
  return  CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(salt + word));
}