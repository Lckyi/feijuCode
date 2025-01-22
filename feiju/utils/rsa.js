import JSEncrypt from '@/utils/jsencrypt.min';
 
export function rsaEncrypt(txt,publicKey) {
  const encryptor = new JSEncrypt.JSEncrypt ();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对需要加密的数据进行加密
}

//解密
export function rsaDecrypt(txt,priviteKey) {
  const encryptor = new JSEncrypt.JSEncrypt ();
  encryptor.setPrivateKey(priviteKey); 
  return encryptor.decrypt(txt); 
}

