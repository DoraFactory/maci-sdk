import { Whitelist as RegistryWhitelist } from './ts/Registry.types';
import { Whitelist as MaciWhitelist } from './ts/Maci.types';
import { OfflineSigner } from '@cosmjs/proto-signing';
import {
  MaciCircuitType,
  MaciCertSystemType,
  CertificateEcosystem,
} from '../../types';

export type CreateRoundParams = {
  signer: OfflineSigner;
  title: string;
  description?: string;
  link?: string;
  startVoting: Date;
  endVoting: Date;
  circuitType: MaciCircuitType;
};

export type CreateAMaciRoundParams = {
  maxVoter: string;
  maxOption: string;
  operator: string;
  whitelist: RegistryWhitelist;
  voiceCreditAmount: string;
  preDeactivateRoot?: string;
} & CreateRoundParams;

export type CreateMaciRoundParams = {
  maxVoter: string;
  maxOption: string;
  operatorPubkey: string;
  whitelist: MaciWhitelist;
  certSystemType: MaciCertSystemType;
} & CreateRoundParams;

export type CreateOracleMaciRoundParams = {
  voteOptionMap: string[];
  operatorPubkey: string;
  whitelistEcosystem: CertificateEcosystem;
  whitelistSnapshotHeight: string;
  whitelistVotingPowerArgs: {
    mode: 'slope' | 'threshold';
    slope: string;
    threshold: string;
  };
  // whitelistBackendPubkey?: string;
  // feegrantOperator?: string;
} & CreateRoundParams;
