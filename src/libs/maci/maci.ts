import { OfflineSigner } from '@cosmjs/proto-signing';
import { batchGenMessage, Circom, PublicKey, stringizing } from '../circom';
import { Contract } from '../contract';
import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import { GasPrice, calculateFee, StdFee } from '@cosmjs/stargate';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';

export class MACI {
  public circom: Circom;
  public contract: Contract;
  constructor({ circom, contract }: { circom: Circom; contract: Contract }) {
    this.circom = circom;
    this.contract = contract;
  }

  async signup({
    signer,
    address,
    contractAddress,
    oracleCertificate,
    gasStation = false,
  }: {
    signer: OfflineSigner;
    address: string;
    contractAddress: string;
    oracleCertificate?: {
      amount: string;
      signature: string;
    };
    gasStation?: boolean;
  }) {
    try {
      const maciAccount = await this.circom.genKeypairFromSign(signer, address);

      const client = await this.contract.contractClient({
        signer,
      });

      if (oracleCertificate) {
        await this.signupOracle({
          client,
          address,
          pubKey: maciAccount.pubKey,
          contractAddress,
          oracleCertificate,
          gasStation,
        });
      } else {
        await this.signupSimple({
          client,
          address,
          pubKey: maciAccount.pubKey,
          contractAddress,
          gasStation,
        });
      }
    } catch (error) {
      throw Error(`Signup failed! ${error}`);
    }
  }

  submit = async ({
    signer,
    address,
    stateIdx,
    contractAddress,
    selectedOptions,
    operatorCoordPubKey,
    gasStation = false,
  }: {
    signer: OfflineSigner;
    address: string;
    stateIdx: number;
    contractAddress: string;
    selectedOptions: {
      idx: number;
      vc: number;
    }[];
    operatorCoordPubKey: PublicKey;
    gasStation?: boolean;
  }) => {
    const options = selectedOptions.filter((o) => !!o.vc);

    try {
      const maciAccount = await this.circom.genKeypairFromSign(signer, address);

      const plan = options.map((o) => {
        return [o.idx, o.vc] as [number, number];
      });

      const payload = batchGenMessage(
        stateIdx,
        maciAccount,
        operatorCoordPubKey,
        plan
      );

      const client = await this.contract.contractClient({
        signer,
      });

      await this.submitPlan({
        client,
        address,
        payload,
        contractAddress,
        gasStation,
      });
    } catch (error) {
      throw Error(`Submit failed! ${error}`);
    }
  };

  async submitPlan({
    client,
    address,
    payload,
    contractAddress,
    gasStation,
  }: {
    client: SigningCosmWasmClient;
    address: string;
    payload: {
      msg: bigint[];
      encPubkeys: PublicKey;
    }[];
    contractAddress: string;
    gasStation: boolean;
  }) {
    const msgs: MsgExecuteContractEncodeObject[] = payload.map(
      ({ msg, encPubkeys }) => ({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: address,
          contract: contractAddress,
          msg: new TextEncoder().encode(
            JSON.stringify(
              stringizing({
                publish_message: {
                  enc_pub_key: {
                    x: encPubkeys[0],
                    y: encPubkeys[1],
                  },
                  message: {
                    data: msg,
                  },
                },
              })
            )
          ),
        }),
      })
    );

    const gasPrice = GasPrice.fromString('100000000000peaka');
    const fee = calculateFee(20000000 * msgs.length, gasPrice);

    if (gasStation) {
      const grantFee: StdFee = {
        amount: fee.amount,
        gas: fee.gas,
        granter: contractAddress,
      };
      return client.signAndBroadcast(address, msgs, grantFee);
    }
    return client.signAndBroadcast(address, msgs, fee);
  }

  async signupSimple({
    client,
    address,
    pubKey,
    contractAddress,
    gasStation,
  }: {
    client: SigningCosmWasmClient;
    address: string;
    pubKey: PublicKey;
    contractAddress: string;
    gasStation?: boolean;
  }) {
    const gasPrice = GasPrice.fromString('100000000000peaka');
    const fee = calculateFee(60000000, gasPrice);

    if (gasStation === true) {
      const grantFee: StdFee = {
        amount: fee.amount,
        gas: fee.gas,
        granter: contractAddress,
      };
      return client.execute(
        address,
        contractAddress,
        {
          sign_up: {
            pubkey: {
              x: pubKey[0].toString(),
              y: pubKey[1].toString(),
            },
          },
        },
        grantFee
      );
    }

    return client.execute(
      address,
      contractAddress,
      {
        sign_up: {
          pubkey: {
            x: pubKey[0].toString(),
            y: pubKey[1].toString(),
          },
        },
      },
      fee
    );
  }

  async signupOracle({
    client,
    address,
    pubKey,
    contractAddress,
    oracleCertificate,
    gasStation,
  }: {
    client: SigningCosmWasmClient;
    address: string;
    pubKey: PublicKey;
    contractAddress: string;
    oracleCertificate: {
      amount: string;
      signature: string;
    };
    gasStation?: boolean;
  }) {
    const gasPrice = GasPrice.fromString('100000000000peaka');
    const fee = calculateFee(60000000, gasPrice);

    if (gasStation === true) {
      const grantFee: StdFee = {
        amount: fee.amount,
        gas: fee.gas,
        granter: contractAddress,
      };
      return client.execute(
        address,
        contractAddress,
        {
          sign_up: {
            pubkey: {
              x: pubKey[0].toString(),
              y: pubKey[1].toString(),
            },
            amount: oracleCertificate.amount,
            certificate: oracleCertificate.signature,
          },
        },
        grantFee
      );
    }

    return client.execute(
      address,
      contractAddress,
      {
        sign_up: {
          pubkey: {
            x: pubKey[0].toString(),
            y: pubKey[1].toString(),
          },
          amount: oracleCertificate.amount,
          certificate: oracleCertificate.signature,
        },
      },
      fee
    );
  }
}
