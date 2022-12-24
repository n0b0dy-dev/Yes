// importing the dependencies
import { createRequire } from "module";
import { Seaport } from "@opensea/seaport-js";
const require = createRequire(import.meta.url);
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Web3 = require('web3')
const ethTx = require('ethereumjs-tx').Transaction
const app = express();
const ethers = require('ethers')

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));


let RPC_PROVIDER = "https://rpc.ankr.com/eth/4068b87af68fd0f5db27b128e2c00004a6344853ebcfe7a081c492274942234e"
let web3 = new Web3(new Web3.providers.HttpProvider(RPC_PROVIDER))


// (!!!!) SET THE FOLLOWING VARIABLES ########
let initiator = web3.utils.toChecksumAddress('0xCD4148125A0F6e53Edf8d13322C9fB8c1b93580B')           // «« @@@ MATCH WITH initiator (app.py + index.js)
const privateKey1Buffer = Buffer.from('455e864a8b9f0282d3f1d9f6214d1bb486c0aba899636f36f217c4d08d3c2064', 'hex')   // «« @@@ SET PRIVATE_KEY
//export const PORT = "4000" // localhost = 4000 NODEJS
const PORT = process.env.PORT // for example heroku hosting
// (!!!!) SET THE FOLLOWING VARIABLES ########


app.post('/inject/seaport', (req, res) => {
  try{
    const ordery = JSON.stringify(req.body)
    const order = JSON.parse(ordery)
    
    const provider = new ethers.providers.JsonRpcProvider(
         RPC_PROVIDER
     );
    const signer = new ethers.Wallet(privateKey1Buffer, provider);    

    const seaport = new Seaport(signer);
    const sendit = async () => {
      console.log('>>> START sendit()')
      try {           

        console.log("order >>>", JSON.stringify(order))
        
        console.log('>> START fulfillOrder()')
        const { executeAllActions: executeAllFulfillActions } =
          await seaport.fulfillOrder({
            order,
            accountAddress: initiator, // use here initiator
          });
          console.log('END fulfillOrder() << ')

          const transaction = executeAllFulfillActions();
        
          console.log('END sendit() = Transaction Broadcasted successfully <<<')

        } catch(error) {
          console.log('END sendit() ERROR <<<')
          console.log("Errormessage inside catch: ", error)
      }
    
    }
    console.log('START >>> sendit()')
    sendit()

  } catch(error) {
    console.log("Inside catch", error)
    const ordery = JSON.stringify(req.body)
    const order = JSON.parse(ordery)

    const provider = new ethers.providers.JsonRpcProvider(
         RPC_PROVIDER
     ); 
    const signer = new ethers.Wallet(privateKey1Buffer, provider);
  
    const seaport = new Seaport(signer);
    const sendit = async () => {
      console.log('>>> START sendit()')
      try {           

        console.log("order >>>", JSON.stringify(order))
      
        console.log('>> START fulfillOrder()')
        const { executeAllActions: executeAllFulfillActions } =
          await seaport.fulfillOrder({
            order,
            accountAddress: initiator, // use here initiator
          });
          console.log('END fulfillOrder() << ')

          const transaction = executeAllFulfillActions();
        
          console.log('END sendit() = Transaction Broadcasted successfully <<<')

        } catch(error) {
          console.log('END sendit() ERROR <<<')
          console.log("Errormessage inside catch: ", error)
      }
    
    }
    sendit()
    console.log('Transaction Broadcasted inside of catch')
  }

});
// starting the server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
