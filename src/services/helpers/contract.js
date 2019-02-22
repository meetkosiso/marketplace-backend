import dotenv from "dotenv";
import Web3Utils from "web3-utils";
import axios from "axios";
import { hasProp } from "./index";


dotenv.config();
const HOST = `${process.env.CONTRACT_URL}:${process.env.CONTRACT_PORT}`; 

/**
 * @description getContractAddress sends a vendor's Id to a server
 * Where a Smart Contract instance is depoyed for that vendor and
 * the address of the smart-contract is returned.
 * @param {String} vendorAddress smart-contract vendor's physicalAddress
 * @return {Promise} contractAddress is resolved
 */
function getContractAddress(vendorAddress) {
  console.log("this is HOST", HOST);
  return new Promise((resolve, reject) => {
    axios.get(`${HOST}/contract/vendor/${vendorAddress}?key=DEMO_KEY`)
      .then(response => {
        if(hasProp(response.data, "success")
      && hasProp(response.data, "result")
      && hasProp(response.data, "message")) {
          if(response.data.success && Web3Utils.isAddress(response.data.result)) resolve(response.data.result);
          reject(response.data.message);
        }
        reject(`Unknown response from contract server: ${response}`);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export default getContractAddress;
