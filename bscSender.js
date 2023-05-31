const { ethers } = require('ethers');
const readlineSync = require("readline-sync");
const fs = require('fs');

(async () => {
  const recipientAddress = readlineSync.question("[?] Input recipient address : ");
  const amount = readlineSync.question("[?] Input amount : ");
  const rlFile = readlineSync.question("[?] Input file.txt pk : ");
  const datas = fs.readFileSync(rlFile, 'utf-8');
  const data = datas.split('\n');
  console.log('')
  for (let i = 0; i < data.length; i++) {
    try {
        const privateKey = data[i]
        console.log(`[${i}] Using private key: ${privateKey}`)
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed3.binance.org')
        const signer = new ethers.Wallet(privateKey, provider)
        const transactionObject = {
            to: recipientAddress,
            value: ethers.utils.parseEther(amount)
        };

        const tx = await signer.sendTransaction(transactionObject);
        console.log(`[${i}] Hash: ${tx.hash}`);
        console.log('')
    } catch (e) {
        console.error(e);
    }
    }
})();
