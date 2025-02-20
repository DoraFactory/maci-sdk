/**
 * This file was automatically generated by @cosmwasm/ts-codegen@1.11.1.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

export type Addr = string;
export interface InstantiateMsg {
  admin: Addr;
  amaci_code_id: number;
  operator: Addr;
}
export type ExecuteMsg =
  | {
      set_maci_operator: {
        operator: Addr;
      };
    }
  | {
      set_maci_operator_pubkey: {
        pubkey: PubKey;
      };
    }
  | {
      set_maci_operator_identity: {
        identity: string;
      };
    }
  | {
      create_round: {
        certification_system: Uint256;
        circuit_type: Uint256;
        max_option: Uint256;
        max_voter: Uint256;
        operator: Addr;
        pre_deactivate_root: Uint256;
        round_info: RoundInfo;
        voice_credit_amount: Uint256;
        voting_time: VotingTime;
        whitelist?: Whitelist | null;
      };
    }
  | {
      set_validators: {
        addresses: ValidatorSet;
      };
    }
  | {
      remove_validator: {
        address: Addr;
      };
    }
  | {
      update_amaci_code_id: {
        amaci_code_id: number;
      };
    }
  | {
      change_operator: {
        address: Addr;
      };
    };
export type Uint256 = string;
export type Timestamp = Uint64;
export type Uint64 = string;
export interface PubKey {
  x: Uint256;
  y: Uint256;
}
export interface RoundInfo {
  description: string;
  link: string;
  title: string;
}
export interface VotingTime {
  end_time: Timestamp;
  start_time: Timestamp;
}
export interface Whitelist {
  users: WhitelistConfig[];
}
export interface WhitelistConfig {
  addr: Addr;
}
export interface ValidatorSet {
  addresses: Addr[];
}
export type QueryMsg =
  | {
      admin: {};
    }
  | {
      operator: {};
    }
  | {
      is_maci_operator: {
        address: Addr;
      };
    }
  | {
      is_validator: {
        address: Addr;
      };
    }
  | {
      get_validators: {};
    }
  | {
      get_validator_operator: {
        address: Addr;
      };
    }
  | {
      get_maci_operator_pubkey: {
        address: Addr;
      };
    }
  | {
      get_maci_operator_identity: {
        address: Addr;
      };
    };
export interface AdminResponse {
  admin: Addr;
}
export type String = string;
export type Boolean = boolean;
