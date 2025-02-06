import { Secp256k1HdWallet } from '@cosmjs/launchpad';
import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing';
import {
  GasPrice,
  SigningStargateClient,
  SigningStargateClientOptions,
} from '@cosmjs/stargate';
import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import { MaciClient } from './ts/Maci.client';
import { AMaciClient } from './ts/AMaci.client';
import { RegistryClient } from './ts/Registry.client';
import { ContractParams } from '../../types';
import {
  createAMaciClientBy,
  createContractClientByWallet,
  createMaciClientBy,
  createOracleMaciClientBy,
  createRegistryClientBy,
} from './config';
import { Whitelist } from './ts/Registry.types';
import { getDefaultParams } from '../const';
import {
  CreateAMaciRoundParams,
  CreateMaciRoundParams,
  CreateOracleMaciRoundParams,
} from './types';
import { getContractParams } from './utils';
import { QTR_LIB } from './vars';
import { MaciRoundType, MaciCertSystemType } from '../../types';
import { decompressPublicKey } from '../../utils';

export const prefix = 'dora';

export class Contract {
  public rpcEndpoint: string;
  public registryAddress: string;
  public maciCodeId: number;
  public oracleCodeId: number;
  public feegrantOperator: string;
  public whitelistBackendPubkey: string;

  constructor({
    rpcEndpoint,
    registryAddress,
    maciCodeId,
    oracleCodeId,
    feegrantOperator,
    whitelistBackendPubkey,
  }: ContractParams) {
    this.rpcEndpoint = rpcEndpoint;
    this.registryAddress = registryAddress;
    this.maciCodeId = maciCodeId;
    this.oracleCodeId = oracleCodeId;
    this.feegrantOperator = feegrantOperator;
    this.whitelistBackendPubkey = whitelistBackendPubkey;
  }

  async createAMaciRound({
    signer,
    startVoting,
    endVoting,
    operator,
    whitelist,
    title,
    description,
    link,
    maxVoter,
    maxOption,
    voiceCreditAmount,
    circuitType,
    preDeactivateRoot,
  }: CreateAMaciRoundParams) {
    const start_time = (startVoting.getTime() * 10 ** 6).toString();
    const end_time = (endVoting.getTime() * 10 ** 6).toString();

    const client = await createRegistryClientBy({
      rpcEndpoint: this.rpcEndpoint,
      wallet: signer,
      contractAddress: this.registryAddress,
    });

    preDeactivateRoot = preDeactivateRoot || '0';
    const res = await client.createRound({
      operator,
      preDeactivateRoot,
      voiceCreditAmount,
      whitelist,
      roundInfo: {
        title,
        description: description || '',
        link: link || '',
      },
      votingTime: {
        start_time,
        end_time,
      },
      maxVoter,
      maxOption,
      certificationSystem: '0',
      circuitType,
    });
    let contractAddress = '';
    res.events.map((event) => {
      if (event.type === 'wasm') {
        let actionEvent = event.attributes.find(
          (attr) => attr.key === 'action'
        )!;
        if (actionEvent.value === 'created_round') {
          contractAddress = event.attributes
            .find((attr) => attr.key === 'round_addr')!
            .value.toString();
        }
      }
    });
    return contractAddress;
  }

  async createMaciRound({
    signer,
    operatorPubkey,
    startVoting,
    endVoting,
    whitelist,
    title,
    description,
    link,
    maxVoter,
    maxOption,
    circuitType,
    certSystemType,
  }: CreateMaciRoundParams) {
    const start_time = (startVoting.getTime() * 10 ** 6).toString();
    const end_time = (endVoting.getTime() * 10 ** 6).toString();
    const [{ address }] = await signer.getAccounts();
    const client = await createContractClientByWallet(this.rpcEndpoint, signer);
    const { x: operatorPubkeyX, y: operatorPubkeyY } =
      decompressPublicKey(operatorPubkey);
    const {
      parameters,
      groth16ProcessVkey,
      groth16TallyVkey,
      plonkProcessVkey,
      plonkTallyVkey,
      maciVoteType,
      maciCertSystem,
    } = getContractParams(
      MaciRoundType.MACI,
      circuitType,
      certSystemType,
      maxVoter,
      maxOption
    );
    const instantiateResponse = await client.instantiate(
      address,
      this.maciCodeId,
      {
        round_info: { title, description, link },
        voting_time: {
          start_time,
          end_time,
        },
        parameters,
        coordinator: {
          x: operatorPubkeyX,
          y: operatorPubkeyY,
        },
        groth16_process_vkey: groth16ProcessVkey,
        groth16_tally_vkey: groth16TallyVkey,
        plonk_process_vkey: plonkProcessVkey,
        plonk_tally_vkey: plonkTallyVkey,
        max_vote_options: maxOption,
        whitelist,
        circuit_type: maciVoteType,
        certification_system: maciCertSystem,
        qtr_lib: QTR_LIB,
      },
      `[MACI] ${title}`,
      'auto'
    );

    return instantiateResponse;
  }

  async createOracleMaciRound({
    signer,
    operatorPubkey,
    startVoting,
    endVoting,
    title,
    description,
    link,
    maxVoter,
    maxOption,
    circuitType,
    whitelistEcosystem,
    whitelistSnapshotHeight,
    whitelistVotingPowerArgs,
  }: CreateOracleMaciRoundParams) {
    const start_time = (startVoting.getTime() * 1_000_000).toString();
    const end_time = (endVoting.getTime() * 1_000_000).toString();
    const [{ address }] = await signer.getAccounts();
    const client = await createContractClientByWallet(this.rpcEndpoint, signer);
    const { x: operatorPubkeyX, y: operatorPubkeyY } =
      decompressPublicKey(operatorPubkey);
    const {
      parameters,
      groth16ProcessVkey,
      groth16TallyVkey,
      plonkProcessVkey,
      plonkTallyVkey,
      maciVoteType,
      maciCertSystem,
    } = getContractParams(
      MaciRoundType.ORACLE_MACI,
      circuitType,
      MaciCertSystemType.GROTH16,
      maxVoter,
      maxOption
    );
    const instantiateResponse = await client.instantiate(
      address,
      this.oracleCodeId,
      {
        round_info: { title, description: description || '', link: link || '' },
        voting_time: {
          start_time,
          end_time,
        },
        parameters,
        coordinator: {
          x: operatorPubkeyX,
          y: operatorPubkeyY,
        },
        groth16_process_vkey: groth16ProcessVkey,
        groth16_tally_vkey: groth16TallyVkey,
        plonk_process_vkey: plonkProcessVkey,
        plonk_tally_vkey: plonkTallyVkey,
        max_vote_options: maxOption,
        whitelist_backend_pubkey: this.whitelistBackendPubkey,
        whitelist_ecosystem: whitelistEcosystem,
        whitelist_snapshot_height: whitelistSnapshotHeight,
        whitelist_voting_power_args: whitelistVotingPowerArgs,
        circuit_type: maciVoteType,
        certification_system: maciCertSystem,
        qtr_lib: QTR_LIB,
        feegrant_operator: this.feegrantOperator,
      },
      `[Oracle MACI] ${title}`,
      'auto'
    );

    return instantiateResponse;
  }

  async queryRoundInfo({
    signer,
    roundAddress,
  }: {
    signer: OfflineSigner;
    roundAddress: string;
  }) {
    const client = await createMaciClientBy({
      rpcEndpoint: this.rpcEndpoint,
      wallet: signer,
      contractAddress: roundAddress,
    });
    const roundInfo = await client.getRoundInfo();
    return roundInfo;
  }

  async oracleMaciClient({
    signer,
    contractAddress,
  }: {
    signer: OfflineSigner;
    contractAddress: string;
  }) {
    const client = await createOracleMaciClientBy({
      rpcEndpoint: this.rpcEndpoint,
      wallet: signer,
      contractAddress,
    });
    return client;
  }

  async registryClient({
    signer,
    contractAddress,
  }: {
    signer: OfflineSigner;
    contractAddress: string;
  }) {
    return createRegistryClientBy({
      rpcEndpoint: this.rpcEndpoint,
      wallet: signer,
      contractAddress,
    });
  }

  async maciClient({
    signer,
    contractAddress,
  }: {
    signer: OfflineSigner;
    contractAddress: string;
  }) {
    return createMaciClientBy({
      rpcEndpoint: this.rpcEndpoint,
      wallet: signer,
      contractAddress,
    });
  }

  async amaciClient({
    signer,
    contractAddress,
  }: {
    signer: OfflineSigner;
    contractAddress: string;
  }) {
    return createAMaciClientBy({
      rpcEndpoint: this.rpcEndpoint,
      wallet: signer,
      contractAddress,
    });
  }

  async contractClient({ signer }: { signer: OfflineSigner }) {
    return createContractClientByWallet(this.rpcEndpoint, signer);
  }
}
