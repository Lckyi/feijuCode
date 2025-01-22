"use strict";const n=require("./jsencrypt.min.js");exports.rsaEncrypt=function(t,r){const c=new n.modificationWindow.JSEncrypt;return c.setPublicKey(r),c.encrypt(t)};
