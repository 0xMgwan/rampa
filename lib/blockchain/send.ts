import { ethers } from 'ethers';
import TronWeb from 'tronweb';

interface SendCryptoParams {
  network: string;
  token: string;
  toAddress: string;
  amount: number;
}

const USDT_CONTRACTS = {
  BEP20: '0x55d398326f99059fF775485246999027B3197955',
  TRC20: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  BASE: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  POLYGON: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
};

const USDC_CONTRACTS = {
  BEP20: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  TRC20: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
  BASE: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  POLYGON: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
};

export async function sendCrypto(params: SendCryptoParams): Promise<string> {
  const { network, token, toAddress, amount } = params;

  if (network === 'TRC20') {
    return sendTronToken(token, toAddress, amount);
  } else {
    return sendEVMToken(network, token, toAddress, amount);
  }
}

async function sendEVMToken(
  network: string,
  token: string,
  toAddress: string,
  amount: number
): Promise<string> {
  let rpcUrl: string;
  let privateKey: string;

  switch (network) {
    case 'BEP20':
      rpcUrl = process.env.RPC_URL_BSC || 'https://bsc-dataseed1.binance.org';
      privateKey = process.env.HOT_WALLET_PRIVATE_KEY_BEP20 || '';
      break;
    case 'BASE':
      rpcUrl = process.env.RPC_URL_BASE || 'https://mainnet.base.org';
      privateKey = process.env.HOT_WALLET_PRIVATE_KEY_BASE || '';
      break;
    case 'POLYGON':
      rpcUrl = process.env.RPC_URL_POLYGON || 'https://polygon-rpc.com';
      privateKey = process.env.HOT_WALLET_PRIVATE_KEY_POLYGON || '';
      break;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }

  if (!privateKey) {
    throw new Error(`Private key not configured for ${network}`);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const tokenContract = token === 'USDT' 
    ? USDT_CONTRACTS[network as keyof typeof USDT_CONTRACTS]
    : USDC_CONTRACTS[network as keyof typeof USDC_CONTRACTS];

  if (!tokenContract) {
    throw new Error(`Token contract not found for ${token} on ${network}`);
  }

  const erc20Abi = [
    'function transfer(address to, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
  ];

  const contract = new ethers.Contract(tokenContract, erc20Abi, wallet);
  const decimals = await contract.decimals();
  const amountInWei = ethers.parseUnits(amount.toString(), decimals);

  const tx = await contract.transfer(toAddress, amountInWei);
  const receipt = await tx.wait();

  return receipt.hash;
}

async function sendTronToken(
  token: string,
  toAddress: string,
  amount: number
): Promise<string> {
  const privateKey = process.env.HOT_WALLET_PRIVATE_KEY_TRC20 || '';
  
  if (!privateKey) {
    throw new Error('TRC20 private key not configured');
  }

  const tronWeb = new TronWeb({
    fullHost: process.env.RPC_URL_TRON || 'https://api.trongrid.io',
    privateKey,
  });

  const tokenContract = token === 'USDT'
    ? USDT_CONTRACTS.TRC20
    : USDC_CONTRACTS.TRC20;

  const contract = await tronWeb.contract().at(tokenContract);
  const decimals = await contract.decimals().call();
  const amountInSun = amount * Math.pow(10, decimals);

  const tx = await contract.transfer(toAddress, amountInSun).send();

  return tx;
}
