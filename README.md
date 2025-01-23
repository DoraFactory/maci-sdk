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

#### Create New Oracle Maci Round
```typescript
const wallet = await DirectSecp256k1Wallet.fromKey(
  Buffer.from(privateKey, 'hex'),
  'dora'
);

const newRound = await client.createOracleMaciRound({
  signer: wallet,
  operatorPubkey: '0e752c...',
  startVoting: new Date(),
  endVoting: new Date(new Date().getTime() + 10 * 60 * 1000),
  title: 'Just for fun',
  description: 'some description',
  link: 'https://www.dorafactory.org',
  maxVoter: '5',
  maxOption: '5',
  circuitType: MaciCircuitType.IP1V,
  whitelistEcosystem: 'cosmoshub',
  whitelistSnapshotHeight: '0',
  whitelistVotingPowerArgs: {
    mode: 'slope',
    slope: '1000000',
    threshold: '1000000',
  },
});
```

**Note:** 
- The `operatorPubkey` is the public key of the operator. It is the compressed public key of the operator's private key.
- The `whitelistEcosystem` is the ecosystem of the whitelist (e.g. 'cosmoshub'). Only wallet addresses that have staked tokens in the specified ecosystem before the snapshot block height will be eligible to become voters.
- The `whitelistSnapshotHeight` is the snapshot block height for checking voter eligibility. The minimum valid height is 23,342,001. If set to "0", the round will evaluate the voter's stake at the time of signup.
- The `whitelistVotingPowerArgs` configures how voting power is calculated:
  - `mode`: Can be either 'slope' or 'threshold'
    - 'slope' mode: Calculates voice credits based on each voter's stake amount using the formula: voice credits = staked tokens / slope value
    - 'threshold' mode: Equally assigns 1 voice credit to voters whose stake exceeds the specified threshold
  - `slope`: The slope value for calculating voice credits in slope mode (e.g. 1000000)
  - `threshold`: The minimum stake threshold in threshold mode (e.g. 1000000)

For example, if a voter stakes 100000000 tokens and the slope value is 2500000, the voter will be assigned 40 voice credits.

> The 1,000,000 reference value here is the precision of cosmoshub, which is 6 bits, and doravota, which is 18 bits, so when you want to pick doravota's staker as a whitelist and ask them to pledge 1DORA to convert 1vote, you need to set the scope to 1000000000000000000 (10**18). Note that currently only cosmoshub and doravota are supported as ecosystem options.
> 
> One detail, here the slope is calculated by rounding down.