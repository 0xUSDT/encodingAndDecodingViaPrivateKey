const secp256k1 = require('secp256k1');
const crypto = require('crypto');
const EthCrypto = require("eth-crypto");
dotenv = require('dotenv')
dotenv.config()


async function encryptMessage({ message, publicKey }) {
  const encrypted = await EthCrypto.encryptWithPublicKey(
    Buffer.from(publicKey.slice(2), "hex"),
    message
  );
  return EthCrypto.cipher.stringify(encrypted);
}
  
async function decryptMessage({ message, privateKey }) {
  const decrypted = await EthCrypto.decryptWithPrivateKey(
    privateKey,
    message
  );
  return decrypted;
}

function toHex(buffer) {
  return Array.from(buffer)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
}


async function main() {
    //load from dotenv
    let _privateKey = process.env.PRIVATE_KEY
    
    let _publicKey = secp256k1.publicKeyCreate(Buffer.from(_privateKey, 'hex'), true); // Generate public key
    _publicKey = toHex(_publicKey)
    _publicKey = "0x" + _publicKey

    console.log("Public Key: ", _publicKey.toString("hex"))

    obj_public = {message: 'test@gmail.com', publicKey: _publicKey}
    
    let encryptedMsg = await encryptMessage(obj_public)
    console.log("Encrypted Message: ", encryptedMsg)
    
    obj_private = {message: encryptedMsg, privateKey: _privateKey}
    let decryptedMsg = await decryptMessage(obj_private)
    console.log("Decrypted Message: ", decryptedMsg)

}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exitCode = 1
	})
