import { Whitelist as RegistryWhitelist } from './ts/Registry.types';
import { Whitelist as MaciWhitelist } from './ts/Maci.types';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { MaciCircuitType, MaciCertSystemType } from '../../types';

export type CreateRoundParams = {
  signer: OfflineSigner;
  title: string;
  description?: string;
  link?: string;
  startVoting: Date;
  endVoting: Date;
  maxVoter: string;
  maxOption: string;
  circuitType: MaciCircuitType;
};

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
  whitelistEcosystem: 'cosmoshub' | 'doravota';
  whitelistSnapshotHeight: string;
  whitelistVotingPowerArgs: {
    mode: 'slope' | 'threshold';
    slope: string;
    threshold: string;
  };
  // whitelistBackendPubkey?: string;
  // feegrantOperator?: string;
} & CreateRoundParams;
