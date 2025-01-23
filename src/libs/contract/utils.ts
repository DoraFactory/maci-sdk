import {
  MaciCertSystemType,
  MaciCircuitType,
  MaciRoundType,
} from '../../types';
import { CIRCUIT_INFO } from './vars';

type MixedData<T> = T | Array<MixedData<T>> | { [key: string]: MixedData<T> };

export const stringizing = (
  o: MixedData<bigint>,
  path: MixedData<bigint>[] = []
): MixedData<string> => {
  if (path.includes(o)) {
    throw new Error('loop nesting!');
  }
  const newPath = [...path, o];

  if (Array.isArray(o)) {
    return o.map((item) => stringizing(item, newPath));
  } else if (typeof o === 'object') {
    const output: { [key: string]: MixedData<string> } = {};
    for (const key in o) {
      output[key] = stringizing(o[key], newPath);
    }
    return output;
  } else {
    return o.toString();
  }
};

export function getContractParams(
  type: MaciRoundType,
  circuitType: MaciCircuitType,
  proofSystem: MaciCertSystemType,
  maxVoter: string,
  maxOption: string
) {
  let parameters: {
    state_tree_depth: string;
    int_state_tree_depth: string;
    vote_option_tree_depth: string;
    message_batch_size: string;
  };
  let groth16ProcessVkey = null;
  let groth16TallyVkey = null;
  let plonkProcessVkey = null;
  let plonkTallyVkey = null;
  let maciVoteType = null;
  let maciCertSystem = null;

  switch (circuitType) {
    case MaciCircuitType.IP1V:
      maciVoteType = '0';
      break;
    case MaciCircuitType.QV:
      maciVoteType = '1';
      break;
    default:
      throw new Error(
        `Invalid circuit type ${circuitType}, only support 1P1V and QV`
      );
  }

  switch (proofSystem) {
    case MaciCertSystemType.GROTH16:
      maciCertSystem = '0';
      break;
    case MaciCertSystemType.PLONK:
      maciCertSystem = '1';
      break;
    default:
      throw new Error(
        `Invalid proof system ${proofSystem}, only support GROTH16 and PLONK`
      );
  }

  if (Number(maxVoter) <= 25 && Number(maxOption) <= 5) {
    // state_tree_depth: 2
    // vote_option_tree_depth: 1
    parameters = CIRCUIT_INFO['2-1-1-5'].parameter;
    if (proofSystem === MaciCertSystemType.GROTH16) {
      groth16ProcessVkey = CIRCUIT_INFO['2-1-1-5']['groth16'].process_vkey;
      groth16TallyVkey = CIRCUIT_INFO['2-1-1-5']['groth16'].tally_vkey;
    } else if (proofSystem === MaciCertSystemType.PLONK) {
      plonkProcessVkey = CIRCUIT_INFO['2-1-1-5']['plonk']?.process_vkey;
      plonkTallyVkey = CIRCUIT_INFO['2-1-1-5']['plonk']?.tally_vkey;
    }
  } else if (Number(maxVoter) <= 625 && Number(maxOption) <= 25) {
    // state_tree_depth: 4
    // vote_option_tree_depth: 2
    parameters = CIRCUIT_INFO['4-2-2-25'].parameter;
    if (proofSystem === MaciCertSystemType.GROTH16) {
      groth16ProcessVkey = CIRCUIT_INFO['4-2-2-25']['groth16'].process_vkey;
      groth16TallyVkey = CIRCUIT_INFO['4-2-2-25']['groth16'].tally_vkey;
    } else if (proofSystem === MaciCertSystemType.PLONK) {
      plonkProcessVkey = CIRCUIT_INFO['4-2-2-25']['plonk']?.process_vkey;
      plonkTallyVkey = CIRCUIT_INFO['4-2-2-25']['plonk']?.tally_vkey;
    }
  } else if (Number(maxVoter) <= 15625 && Number(maxOption) <= 125) {
    // state_tree_depth: 6
    // vote_option_tree_depth: 3
    parameters = CIRCUIT_INFO['6-3-3-125'].parameter;
    if (proofSystem === MaciCertSystemType.GROTH16) {
      groth16ProcessVkey = CIRCUIT_INFO['6-3-3-125']['groth16'].process_vkey;
      groth16TallyVkey = CIRCUIT_INFO['6-3-3-125']['groth16'].tally_vkey;
    } else if (proofSystem === MaciCertSystemType.PLONK) {
      plonkProcessVkey = CIRCUIT_INFO['6-3-3-125']['plonk']?.process_vkey;
      plonkTallyVkey = CIRCUIT_INFO['6-3-3-125']['plonk']?.tally_vkey;
    }
  } else if (Number(maxVoter) <= 1953125 && Number(maxOption) <= 125) {
    // state_tree_depth: 9
    // vote_option_tree_depth: 3
    parameters = CIRCUIT_INFO['9-4-3-625'].parameter;
    if (proofSystem === MaciCertSystemType.GROTH16) {
      groth16ProcessVkey = CIRCUIT_INFO['9-4-3-625']['groth16'].process_vkey;
      groth16TallyVkey = CIRCUIT_INFO['9-4-3-625']['groth16'].tally_vkey;
    } else if (proofSystem === MaciCertSystemType.PLONK) {
      throw new Error('PLONK is not supported for MACI-9');
    }
  } else {
    throw new Error('Number of voters or options is too large.');
  }
  switch (type) {
    case MaciRoundType.MACI:
      return {
        parameters,
        groth16ProcessVkey,
        groth16TallyVkey,
        plonkProcessVkey,
        plonkTallyVkey,
        maciVoteType,
        maciCertSystem,
      };
    case MaciRoundType.AMACI:
      return {
        // parameters,
        // groth16ProcessVkey,
        // groth16TallyVkey,
        // plonkProcessVkey,
        // plonkTallyVkey,
      };
    case MaciRoundType.ORACLE_MACI:
      return {
        parameters: CIRCUIT_INFO['9-4-3-625'].parameter,
        groth16ProcessVkey: CIRCUIT_INFO['9-4-3-625']['groth16'].process_vkey,
        groth16TallyVkey: CIRCUIT_INFO['9-4-3-625']['groth16'].tally_vkey,
        plonkProcessVkey: null,
        plonkTallyVkey: null,
        maciVoteType,
        maciCertSystem: '0',
      };
  }
}
