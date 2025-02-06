import { Http } from '../http';
import {
  OracleCertificateParams,
  SignatureRequest,
  SignatureResponse,
} from './types';

export class OracleCertificate {
  private certificateApiEndpoint: string;
  private http: Http;

  constructor({ certificateApiEndpoint, http }: OracleCertificateParams) {
    this.certificateApiEndpoint = certificateApiEndpoint;
    this.http = http;
  }

  async sign(data: SignatureRequest): Promise<SignatureResponse> {
    const response = await this.http.fetch(
      `${this.certificateApiEndpoint}/${data.ecosystem}/sign`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: data.address,
          height: data.height,
          contractAddress: data.contractAddress,
        }),
      }
    );
    const signatureData = await response.json();

    return signatureData;
  }
}
