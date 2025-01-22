import { Whitelist as RegistryWhitelist } from './ts/Registry.types';
import { Whitelist as MaciWhitelist } from './ts/Maci.types';
import { OfflineSigner } from '@cosmjs/proto-signing';

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

export interface CreateRoundParams {
  signer: OfflineSigner;
  title: string;
  description?: string;
  link?: string;
  startVoting: Date;
  endVoting: Date;
  maxVoter: string;
  maxOption: string;
  circuitType: MaciCircuitType;
}

export type CreateAMaciRoundParams = {
  operator: string;
  whitelist: RegistryWhitelist;
  voiceCreditAmount: string;
  preDeactivateRoot?: string;
} & CreateRoundParams;

export type CreateMaciRoundParams = {
  operatorPubkey: string;
  whitelist: MaciWhitelist;
  certSystemType: MaciCertSystemType;
} & CreateRoundParams;

export type CreateOracleMaciRoundParams = {
  operatorPubkey: string;
  whitelistEcosystem: string;
  whitelistSnapshotHeight: string;
  whitelistVotingPowerArgs: {
    mode: string;
    slope: string;
    threshold: string;
  };
  whitelistBackendPubkey?: string;
  feegrantOperator?: string;
} & CreateRoundParams;
