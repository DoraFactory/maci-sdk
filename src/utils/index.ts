import { decode } from 'bech32';

function verifyIsBech32(address: string): Error | undefined {
  try {
    decode(address);
  } catch (error) {
    return error instanceof Error ? error : new Error('Unknown error');
  }

  return undefined;
}

export function isValidAddress(address: string): boolean {
  // An address is valid if it starts with `dora` and is Bech32 format.
  return address.startsWith('dora') && verifyIsBech32(address) === undefined;
}

// export async function fetchBaseUrl(url: string) {
//   const response = await fetch(url);
//   return response;
// }

// export async function fetchPages<T>(
//   query: string,
//   after: string,
//   limit: number | null = 10
// ): Promise<T> {
//   const isFirstPage = after === 'first';
//   // after = isFirstPage ? null : after;

//   const response = await fetch(apiEndpoint, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//     body: JSON.stringify({
//       query,
//       variables: { limit, after: isFirstPage ? undefined : after },
//     }),
//   }).then((res) => res.json());

//   return response;
// }
