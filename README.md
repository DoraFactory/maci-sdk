# Maci Client

MACI (Minimal Anti-Collusion Infrastructure) client SDK for interacting with MACI contracts.

## Installation

```bash
npm install @dorafactory/maci-sdk
```

## Usage

### Initialize Client

```typescript
import { MaciClient } from '@dorafactory/maci-sdk';

const client = new MaciClient({
  network: 'testnet', // or 'mainnet'
});
```

### Query Functions

#### Query Account Balance
```typescript
const balance = await client.balanceOf('dora1...');
```

#### Query Round Information
```typescript
// Query round by ID
const round = await client.getRoundById('dora1...');

// Get list of rounds
const rounds = await client.getRounds('first', 10);

// Query rounds by status
const roundsByStatus = await client.getRoundsByStatus('Created', 'first', 10);

// Query rounds by circuit name
const roundsByCircuit = await client.getRoundsByCircuitName('amaci-qv', 'first', 10);

// Query rounds by operator address
const roundsByOperator = await client.getRoundsByOperator('dora1...', 'first', 10);
```

#### Query Operator Information
```typescript
// Query operator by address
const operator = await client.getOperatorByAddress('dora1...');

// Get list of operators
const operators = await client.getOperators('first', 10);
```

#### Query Circuit Information
```typescript
// Query circuit by name
const circuit = await client.getCircuitByName('amaci-qv');

// Get all circuits
const circuits = await client.getCircuits();
```

#### Query Transaction Information
```typescript
// Query transaction by hash
const transaction = await client.getTransactionByHash('HASH...');

// Get list of transactions
const transactions = await client.getTransactions('first', 10);

// Query transactions by contract address
const txByContract = await client.getTransactionsByContractAddress('dora1...', 'first', 10);
```

#### Query Proof Information
```typescript
const proof = await client.getProofByContractAddress('dora1...');
```

### Contract Interactions

#### Create New Voting Round
```typescript
const wallet = await DirectSecp256k1Wallet.fromKey(
  Buffer.from(privateKey, 'hex'),
  'dora'
);

const newRound = await client.createOracleMaciRound({
  signer: wallet,
  operatorPubkey: '0e752c...',
  startVoting: new Date(),
  endVoting: new Date(new Date().getTime() + 1 * 60 * 1000),
  title: 'test',
  description: 'test',
  link: 'test',
  maxVoter: '5',
  maxOption: '5',
  circuitType: MaciCircuitType.IP1V,
  whitelistBackendPubkey: 'AoYo...',
  whitelistEcosystem: 'cosmoshub',
  whitelistSnapshotHeight: '0',
  whitelistVotingPowerArgs: {
    mode: 'slope',
    slope: '1000000',
    threshold: '1000000',
  },
  feegrantOperator: 'dora1...',
});
```
