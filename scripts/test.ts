import { MaciClient, MaciCircuitType, compressPublicKey } from '../src';
import { Secp256k1HdWallet } from '@cosmjs/amino';
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
} from '@cosmjs/proto-signing';
import dotenv from 'dotenv';

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

  const newRound = await client.createOracleMaciRound({
    signer: wallet,
    operatorPubkey:
      '0e752cc9fe60255a607191dc8b56455eb459a34068fcec6701a80787cac532d02d61d1f14d35e3553e4abacdee2d47b417716d02c4c0379fc161c8c4f8863177',
    startVoting: new Date(new Date().getTime() + 3 * 60 * 1000),
    endVoting: new Date(new Date().getTime() + 15 * 60 * 1000),
    title: 'test',
    description: 'test',
    link: 'test',
    voteOptionMap: ['option1: A', 'option2: B', 'option3: C'],
    circuitType: MaciCircuitType.IP1V,
    whitelistEcosystem: 'cosmoshub',
    whitelistSnapshotHeight: '0',
    whitelistVotingPowerArgs: {
      mode: 'slope',
      slope: '1000000',
      threshold: '1000000',
    },
  });
  console.log('newRound:', newRound);

  // const roundInfo = await client.contract.queryRoundInfo({
  //   signer: wallet,
  //   contractAddress: newRound.contractAddress,
  // });
  // console.log('roundInfo:', roundInfo);
}

main();
