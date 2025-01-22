import { FetchOptions } from '../libs/http/http';
export type * from '../libs/contract/types';

export enum MaciCircuitType {
  IP1V = '0',
  QV = '1',
}

export enum MaciCertSystemType {
  GROTH16 = 'groth16',
  PLONK = 'plonk',
}

export enum MaciRoundType {
  MACI = '0',
  AMACI = '1',
  ORACLE_MACI = '2',
}

export type ClientParams = {
  network: 'mainnet' | 'testnet';
  rpcEndpoint?: string;
  restEndpoint?: string;
  apiEndpoint?: string;
  registryAddress?: string;
  maciCodeId?: number;
  oracleCodeId?: number;
  customFetch?: typeof fetch;
  defaultOptions?: FetchOptions;
};

export type ContractParams = {
  rpcEndpoint: string;
  registryAddress: string;
  maciCodeId: number;
  oracleCodeId: number;
};

export type TransactionType = {
  id: string;
  blockHeight: string;
  txHash: string;
  timestamp: string;
  type: string;
  status: string;
  circuitName: string;
  fee: string;
  gasUsed: string;
  gasWanted: string;
  caller: string;
  contractAddress: string;
};

export type RoundType = {
  id: string;
  blockHeight: string;
  txHash: string;
  caller: string;
  admin: string;
  operator: string;
  contractAddress: string;
  circuitName: string;
  timestamp: string;
  votingStart: string;
  votingEnd: string;
  status: string;
  period: string;
  actionType: string;
  roundTitle: string;
  roundDescription: string;
  roundLink: string;
  coordinatorPubkeyX: string;
  coordinatorPubkeyY: string;
  voteOptionMap: string;
  results: string;
  allResult: string;
  gasStationEnable: boolean;
  totalGrant: string;
  baseGrant: string;
  totalBond: string;
  circuitType: string;
  circuitPower: string;
  certificationSystem: string;
  codeId: string;
  maciType: string;
  voiceCreditAmount: string;
  preDeactivateRoot: string;
  identity: string;
  operatorLogoUrl?: string;
  operatorMoniker?: string;
  resultsList?: {
    v: number;
    v2: number;
  }[];
};

export type ProofType = {
  nodes: {
    id: string;
    blockHeight: string;
    txHash: string;
    contractAddress: string;
    timestamp: string;
    actionType: string;
    commitment: string;
    proof: string;
  }[];
};

export type OperatorType = {
  id: string;
  validatorAddress: string;
  operatorAddress: string;
  coordinatorPubkeyX: string;
  coordinatorPubkeyY: string;
  identity: string;
  logoUrl: string;
  moniker: string;
  activeRoundsCount: number;
  completedRoundsCount: number;
};

export type CircuitType = {
  maciType: string;
  circuitType: string;
  displayName: string;
  repoUrl: string;
  zipUrl: string;
  roundCount?: number;
};

export type CircuitsCountGraphqlResponse = {
  data: {
    rounds: {
      totalCount: number;
    };
  };
};

export type ErrorResponse = {
  code: number;
  error: {
    message: string;
    type: string;
  };
};

export type SuccessResponse<T> = {
  code: 200;
  data: T;
};

export type CircuitResponse =
  | SuccessResponse<{
      circuit: CircuitType;
    }>
  | ErrorResponse;

export type CircuitsResponse =
  | SuccessResponse<{
      circuits: CircuitType[];
    }>
  | ErrorResponse;

export type BalanceResponse =
  | SuccessResponse<{
      balance: string;
    }>
  | ErrorResponse;

export type OperatorResponse =
  | SuccessResponse<{
      operator: OperatorType;
    }>
  | ErrorResponse;

export type OperatorsResponse =
  | SuccessResponse<{
      operators: {
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
        edges: {
          cursor: string;
          node: OperatorType;
        }[];
        totalCount: number;
      };
    }>
  | ErrorResponse;

export type OperatorsGraphqlResponse = {
  data: {
    operators: {
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      edges: {
        cursor: string;
        node: OperatorType;
      }[];
      totalCount: number;
    };
  };
};

export type RoundsCountGraphqlResponse = {
  data: {
    activeRoundsCount: {
      totalCount: number;
    };
    completedRoundsCount: {
      totalCount: number;
    };
  };
};

export type TransactionGraphqlResponse = {
  data: {
    transaction: TransactionType;
  };
};

export type TransactionResponse =
  | SuccessResponse<{
      transaction: TransactionType;
    }>
  | ErrorResponse;

export type TransactionsGraphqlResponse = {
  data: {
    transactions: {
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      edges: {
        cursor: string;
        node: TransactionType;
      }[];
      totalCount: number;
    };
  };
};

export type TransactionsResponse =
  | SuccessResponse<{
      transactions: {
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
        edges: {
          cursor: string;
          node: TransactionType;
        }[];
        totalCount: number;
      };
    }>
  | ErrorResponse;

export type RoundResponse =
  | SuccessResponse<{
      round: RoundType;
    }>
  | ErrorResponse;

export type RoundsResponse =
  | SuccessResponse<{
      rounds: {
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
        edges: {
          cursor: string;
          node: RoundType;
        }[];
        totalCount: number;
      };
    }>
  | ErrorResponse;

export type RoundGraphqlResponse = {
  data: {
    round: RoundType;
  };
};

export type RoundsGraphqlResponse = {
  data: {
    rounds: {
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      edges: {
        cursor: string;
        node: RoundType;
      }[];
      totalCount: number;
    };
  };
};

export type ProofResponse =
  | SuccessResponse<{
      proofData: ProofType;
    }>
  | ErrorResponse;

export type ProofGraphqlResponse = {
  data: {
    proofData: ProofType;
  };
};
