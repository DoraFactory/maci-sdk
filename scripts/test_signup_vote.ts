import { MaciClient } from '../src';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
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

  const address = (await wallet.getAccounts())[0].address;
  console.log('address', address);

  // ================ test oracle signup and vote

  const RoundAddress =
    'dora12x24cs2l4nswqgkh9zz0l6ej78yk5edtc3hdx3vvamn4n9yd2xws0cmlje';

  // generate maci account
  const maciAccount = await client.circom.genKeypairFromSign(wallet, address);
  console.log('maciAccount First', maciAccount);

  // // get certificate
  // const certificate = await client.maci.requestOracleCertificate({
  //   signer: wallet,
  //   ecosystem: 'doravota',
  //   address,
  //   contractAddress: RoundAddress,
  // });
  // console.log('certificate', certificate);

  // let gasStationEnable = roundInfo.gasStationEnable;
  // console.log('gasStationEnable', gasStationEnable);

  // while (!gasStationEnable) {
  //   await delay(1000);
  //   gasStationEnable = await client.maci.queryRoundGasStation({
  //     contractAddress: RoundAddress,
  //   });
  //   console.log('checking gasStationEnable:', gasStationEnable);
  // }

  // await delay(6000);

  // // oracle maci sign up
  // const signupResponse = await client.maci.signup({
  //   signer: wallet,
  //   address,
  //   contractAddress: RoundAddress,
  //   oracleCertificate: {
  //     amount: certificate.amount,
  //     signature: certificate.signature,
  //   },
  //   gasStation: false,
  // });

  // console.log('signup tx:', signupResponse.transactionHash);

  // await delay(6000);

  // // get user state idx
  // const stateIdx = await client.maci.getStateIdxByPubKey({
  //   contractAddress: RoundAddress,
  //   pubKey: maciAccount.pubKey,
  // });
  // console.log('stateIdx', stateIdx);

  // // vote
  // const voteResponse = await client.maci.vote({
  //   signer: wallet,
  //   address,
  //   stateIdx,
  //   contractAddress: RoundAddress,
  //   selectedOptions: [
  //     { idx: 0, vc: 1 },
  //     { idx: 1, vc: 1 },
  //   ],
  //   operatorCoordPubKey: [
  //     BigInt(roundInfo.coordinatorPubkeyX),
  //     BigInt(roundInfo.coordinatorPubkeyY),
  //   ],
  //   gasStation: false,
  // });

  // console.log('vote tx:', voteResponse.transactionHash);
}

main();
