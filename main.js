const express = require('express'); 
const cors = require('cors')
const app = express(); 
app.use(express.json());
app.use(cors());
const PORT = 3000; 

const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545'); // RPC Node

const ABI = 
[
    {
        "constant": true,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "sender",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "toon",
        "outputs": [
          {
            "internalType": "int256",
            "name": "",
            "type": "int256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "value",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getSenders",
        "outputs": [
          {
            "internalType": "address[16]",
            "name": "",
            "type": "address[16]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "senderId",
            "type": "uint256"
          }
        ],
        "name": "setSender",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "v",
            "type": "uint256"
          }
        ],
        "name": "setValue",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "doneJobArray",
        "outputs": [
          {
            "internalType": "string",
            "name": "recive_id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "username",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "string",
            "name": "_recive_id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_username",
            "type": "string"
          }
        ],
        "name": "addDoneJob",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getdoneJobArray",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "recive_id",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "username",
                "type": "string"
              }
            ],
            "internalType": "struct WorkDone.DoneJob[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
];

const account = web3.eth.accounts.wallet.add('0xc5cf6eebf5b31d6711cb6dd7b22f56ef3e5efc62ab4132238b8900489a683dbb'); //private key
const EContract = new web3.eth.Contract(ABI, '0xEE3c69f2fCf2adbDb81ff0Be2610EC3684E86bdA');// contract address

app.get('/getDoneJob',async (req, res)=>{ 
    web3.eth.net.isListening()
    .then(async() => {

        let doneJob = await EContract.methods.getdoneJobArray().call();
        res.status(200).json(doneJob); 
    })
    .catch((error) => {

      res.status(500).send('Error: Web3 connection failed.');
    });
    
}); 

app.get('/', (req, res)=>{ 
  web3.eth.net.isListening()
  res.status(200);
  res.json({msg:"conected successfully"}).send;
}); 

app.post('/addDoneJob',async (req, res)=>{ 
  const data = req.body;
    
  try {
      // Check Web3 connection
      await web3.eth.net.isListening();

      // Extract data from request body
      const { recive_id, username } = data;

      // Call contract method
      await EContract.methods.addDoneJob(recive_id, username).send({ from: account[0].address });

      // Send success response
      res.status(200).send('Sent e-contract successfully!');
  } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).send('Error: Web3 connection failed or invalid request data.');
  }
}); 
  
app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 