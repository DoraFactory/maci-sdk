import {
  BalanceResponse,
  RoundResponse,
  RoundsResponse,
  OperatorResponse,
  OperatorsResponse,
  CircuitResponse,
  TransactionResponse,
  TransactionsResponse,
  CircuitsResponse,
  ProofResponse,
} from '../../types';
import { Http } from '../http';
import {
  Round,
  Account,
  Circuit,
  Operator,
  Proof,
  Transaction,
} from '../query';
import { handleError, ErrorType } from '../errors';
import { ERROR } from '../errors/types';
import { OracleCertificateParams } from './types';

/**
 * @class Indexer
 * @description This class is used to interact with Maci Indexer.
 */
export interface SignatureRequest {
  address: string;
  height: string;
  contractAddress: string;
  amount?: string;
}

export interface SignatureResponse {
  code: number;
  data?: {
    signature: string;
  };
  error?: {
    message: string;
    type: string;
  };
}

export class OracleCertificate {
  private certificateApiEndpoint: string;
  private http: Http;

  constructor({ certificateApiEndpoint, http }: OracleCertificateParams) {
    this.certificateApiEndpoint = certificateApiEndpoint;
    this.http = http;
  }

  async sign(data: SignatureRequest): Promise<SignatureResponse> {
    try {
      const response = await fetch(
        `${this.certificateApiEndpoint}/cosmoshub/sign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        return {
          code: response.status,
          error: {
            message: `Signature request failed: ${response.status} ${response.statusText}`,
            type: 'error',
          },
        };
      }

      const signatureData = await response.json();

      return {
        code: 200,
        data: signatureData,
      };
    } catch (error) {
      return handleError(error as ErrorType);
    }
  }
}
