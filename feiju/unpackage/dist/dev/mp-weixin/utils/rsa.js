"use strict";
const utils_jsencrypt_min = require("./jsencrypt.min.js");
function rsaEncrypt(txt, publicKey) {
  const encryptor = new utils_jsencrypt_min.modificationWindow.JSEncrypt();
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(txt);
}
exports.rsaEncrypt = rsaEncrypt;
