import { MaciClient, MaciCircuitType } from '../src';
import { Secp256k1HdWallet } from '@cosmjs/amino';
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
} from '@cosmjs/proto-signing';
import dotenv from 'dotenv';

dotenv.config();
async function main() {
  const client = new MaciClient({
    network: 'testnet',
  });

  const ROUND_ADDRESS =
    'dora1de7l4fx9tltcj67xjs80hwq5mgzh050y0k5838hax9dkgvsva6csqk9cl0';
  const TRANSACTION_HASH =
    'BD2D0D8141736519DBA92190A2AF56908ADB8D3CFDF3260EDDB1366FA2A073D2';
  const OPERATOR_ADDRESS = 'dora1zrd68hgj5uzqpm5x8v6pylwqjsnltp6nyr8s0k';
  const CIRCUIT_NAME = 'amaci-qv';

  try {
    // Test getting account balance
    const balance = await client.balanceOf(OPERATOR_ADDRESS);
    console.log('balanceOf:', balance.code);

    // Test getting round information
    const round = await client.getRoundById(ROUND_ADDRESS);
    console.log('getRoundById:', round.code);

    // Test getting paginated round list
    const rounds = await client.getRounds('first', 10);
    console.log('getRounds:', rounds.code);

    // Test getting rounds by status
    const roundsByStatus = await client.getRoundsByStatus(
      'Created',
      'first',
      10
    );
    console.log('getRoundsByStatus:', roundsByStatus.code);

    // Test getting rounds by circuit name
    const roundsByCircuit = await client.getRoundsByCircuitName(
      CIRCUIT_NAME,
      'first',
      10
    );
    console.log('getRoundsByCircuitName:', roundsByCircuit.code);

    // Test getting rounds by operator
    const roundsByOperator = await client.getRoundsByOperator(
      OPERATOR_ADDRESS,
      'first',
      10
    );
    console.log('getRoundsByOperator:', roundsByOperator.code);

    // Test getting operator information
    const operator = await client.getOperatorByAddress(OPERATOR_ADDRESS);
    console.log('getOperatorByAddress:', operator.code);

    // Test getting operator list
    const operators = await client.getOperators('first', 10);
    console.log('getOperators:', operators.code);

    // Test getting circuit information
    const circuit = await client.getCircuitByName(CIRCUIT_NAME);
    console.log('getCircuitByName:', circuit.code);

    // Test getting all circuits
    const circuits = await client.getCircuits();
    console.log('getCircuits:', circuits.code);

    // Test getting transaction information
    const transaction = await client.getTransactionByHash(TRANSACTION_HASH);
    console.log('getTransactionByHash:', transaction.code);

    // Test getting transaction list
    const transactions = await client.getTransactions('first', 10);
    console.log('getTransactions:', transactions.code);

    // Test getting transactions by contract address
    const txByContract = await client.getTransactionsByContractAddress(
      ROUND_ADDRESS,
      'first',
      10
    );
    console.log('getTransactionsByContractAddress:', txByContract.code);

    // Test getting proof information
    const proof = await client.getProofByContractAddress(ROUND_ADDRESS);
    console.log('getProofByContractAddress:', proof.code);
  } catch (error) {
    console.error('Error occurred during testing:', error);
  }

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

  const newRound = await client.contract.createOracleMaciRound({
    signer: wallet,
    operatorPubkey:
      '0e752cc9fe60255a607191dc8b56455eb459a34068fcec6701a80787cac532d02d61d1f14d35e3553e4abacdee2d47b417716d02c4c0379fc161c8c4f8863177',
    startVoting: new Date(),
    endVoting: new Date(new Date().getTime() + 1 * 60 * 1000),
    title: 'test',
    description: 'test',
    link: 'test',
    maxVoter: '5',
    maxOption: '5',
    circuitType: MaciCircuitType.IP1V,
    whitelistBackendPubkey: 'AoYo/zENN/JquagPdG0/NMbWBBYxOM8BVN677mBXJKJQ',
    whitelistEcosystem: 'cosmoshub',
    whitelistSnapshotHeight: '0',
    whitelistVotingPowerArgs: {
      mode: 'slope',
      slope: '1000000',
      threshold: '1000000',
    },
    feegrantOperator: 'dora1cw3wf6lxddx498ga9v4jdrragf2zhjx455cku3',
  });
  console.log('newRound:', newRound);

  // const roundInfo = await client.contract.queryRoundInfo({
  //   signer: wallet,
  //   contractAddress: newRound.contractAddress,
  // });
  // console.log('roundInfo:', roundInfo);
}

main();
