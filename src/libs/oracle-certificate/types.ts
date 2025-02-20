import { CertificateEcosystem } from '../../types';
import { Http } from '../http/http';

export type OracleCertificateParams = {
  certificateApiEndpoint: string;
  http: Http;
};

export type SignatureRequest = {
  ecosystem: CertificateEcosystem;
  address: string;
  height: string;
  contractAddress: string;
};

export type SignatureResponse = {
  signature: string;
  amount: string;
  snapshotHeight: string;
};

export type FeegrantAllowanceResponse = {
  granter: string;
  grantee: string;
  spend_limit: {
    denom: string;
    amount: string;
  }[];
};
