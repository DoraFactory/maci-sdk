import { MaciClient } from '../src';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import dotenv from 'dotenv';
import { isErrorResponse } from '../src/libs/maci/maci';

dotenv.config();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const client = new MaciClient({
    network: 'testnet',
  });

  console.log('======= start test contract logic =======');
  let key = process.env.ADMIN_PRIVATE_KEY;
  if (!key) {
    throw new Error('Admin private key not found in environment variables');
  }
  if (key.startsWith('0x')) {
    key = key.slice(2);
  }
  const wallet = await DirectSecp256k1Wallet.fromKey(
    Buffer.from(key, 'hex'),
    'dora'
  );

  const address = (await wallet.getAccounts())[0].address;
  console.log('address', address);

  // ================ test oracle signup and vote

  const RoundAddress =
    'dora1yttutgra9fhcn2yvrfa5g3f2tway3ggg0ehgc5egcvj3qd2yzm4qqztceg';

  const allowance = await client.maci.feegrantAllowance({
    address: 'dora1y7ajuup8wc6x9d7svce3uza53e38ur3lxqpfzl',
    contractAddress: RoundAddress,
  });
  console.log('allowance', allowance);
}

main();
