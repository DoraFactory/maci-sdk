import { ERROR } from '../errors/types';
import { Http } from '../../libs';
import {
  OperatorsGraphqlResponse,
  RoundsCountGraphqlResponse,
  OperatorResponse,
  OperatorsResponse,
} from '../../types';
import { isValidAddress } from '../../utils';
import { handleError, ErrorType } from '../errors';

export class Operator {
  public http: Http;
  public amaciRegistryContract: string;

  constructor(http: Http, amaciRegistryContract: string) {
    this.http = http;
    this.amaciRegistryContract = amaciRegistryContract;
  }

  async getOperatorByAddress(address: string): Promise<OperatorResponse> {
    try {
      if (!isValidAddress(address)) {
        return {
          code: 400,
          error: {
            message: 'Invalid operator address format',
            type: ERROR.ERROR_OPERATOR_INVALID_ADDRESS,
          },
        };
      }

      const OPERATORS_QUERY = `query {
    operators(filter: { operatorAddress: { equalTo: "${address}" } }) {
        edges {
          node {
            id
            validatorAddress
            operatorAddress
            coordinatorPubkeyX
            coordinatorPubkeyY
            identity
          }
        }
      }
    }`;

      const response = await this.http.fetchGraphql<OperatorsGraphqlResponse>(
        OPERATORS_QUERY,
        ''
      );

      if (
        !response ||
        !response.data ||
        !response.data.operators ||
        !response.data.operators.edges ||
        response.data.operators.edges.length === 0
      ) {
        return {
          code: 404,
          error: {
            message: `No operator found for address ${address}`,
            type: ERROR.ERROR_OPERATOR_NOT_FOUND,
          },
        };
      }

      const operatorResponse = response.data.operators.edges[0].node;

      if (
        operatorResponse.operatorAddress === '' ||
        operatorResponse.coordinatorPubkeyX === ''
      ) {
        operatorResponse.activeRoundsCount = 0;
        operatorResponse.completedRoundsCount = 0;
      } else {
        const ROUNDS_QUERY = `query {
        activeRoundsCount: rounds(filter: {
          period: {notEqualTo: "Ended"},
          operator: {equalTo: "${operatorResponse.operatorAddress}"},
          caller: {equalTo: "${this.amaciRegistryContract}"}
        }) {
          totalCount
        }
        completedRoundsCount: rounds(filter: {
          period: {equalTo: "Ended"},
          operator: {equalTo: "${operatorResponse.operatorAddress}"},
          caller: {equalTo: "${this.amaciRegistryContract}"}
        }) {
          totalCount
        }
      }`;

        const roundsCount =
          await this.http.fetchGraphql<RoundsCountGraphqlResponse>(
            ROUNDS_QUERY,
            ''
          );
        operatorResponse.activeRoundsCount =
          roundsCount.data.activeRoundsCount.totalCount;
        operatorResponse.completedRoundsCount =
          roundsCount.data.completedRoundsCount.totalCount;
      }

      operatorResponse.logoUrl = '';
      operatorResponse.moniker = '';
      const identity = response.data.operators.edges[0].node.identity;

      const keybaseUrl = `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}`;
      const keybaseResponse = await this.http.fetch(keybaseUrl);
      const keybaseData = await keybaseResponse.json();

      if (keybaseData.status.code === 0) {
        if (keybaseData.them[0]?.pictures?.primary?.url) {
          operatorResponse.logoUrl = keybaseData.them[0].pictures.primary.url;
        }
        if (keybaseData.them[0]?.basics?.username_cased) {
          operatorResponse.moniker = keybaseData.them[0].profile.full_name;
        }
      }
      const operator: OperatorResponse = {
        code: 200,
        data: {
          operator: operatorResponse,
        },
      };
      return operator;
    } catch (error) {
      return handleError(error as ErrorType);
    }
  }

  async getOperators(
    after: string,
    limit?: number
  ): Promise<OperatorsResponse> {
    try {
      const OPERATORS_QUERY = `query ($limit: Int, $after: Cursor) {
          operators(first: $limit, after: $after) {
            pageInfo {
              endCursor
              hasNextPage
            }
            totalCount
            edges {
              cursor
              node {
                id
                validatorAddress
                operatorAddress
                coordinatorPubkeyX
                coordinatorPubkeyY
                identity
              }
            }
          }
        }`;

      const response = await this.http.fetchGraphql<OperatorsGraphqlResponse>(
        OPERATORS_QUERY,
        after,
        limit
      );
      if (
        !response ||
        !response.data ||
        !response.data.operators ||
        !response.data.operators.edges
      ) {
        return {
          code: 404,
          error: {
            message: 'No operators found',
            type: ERROR.ERROR_OPERATORS_NOT_FOUND,
          },
        };
      }
      const operatorsWithRounds = await Promise.all(
        response.data.operators.edges.map(async (edge) => {
          const operator = edge.node;
          if (
            operator.operatorAddress === '' ||
            operator.coordinatorPubkeyX === ''
          ) {
            operator.activeRoundsCount = 0;
            operator.completedRoundsCount = 0;
            return operator;
          }
          const ROUNDS_QUERY = `query {
              activeRoundsCount: rounds(filter: {
                period: {notEqualTo: "Ended"},
                operator: {equalTo: "${operator.operatorAddress}"},
                caller: {equalTo: "${this.amaciRegistryContract}"}
              }) {
                totalCount
              }
              completedRoundsCount: rounds(filter: {
                period: {equalTo: "Ended"},
                operator: {equalTo: "${operator.operatorAddress}"},
                caller: {equalTo: "${this.amaciRegistryContract}"}
              }) {
                totalCount
              }
            }`;

          const roundsCount =
            await this.http.fetchGraphql<RoundsCountGraphqlResponse>(
              ROUNDS_QUERY,
              ''
            );
          operator.activeRoundsCount =
            roundsCount.data.activeRoundsCount.totalCount;
          operator.completedRoundsCount =
            roundsCount.data.completedRoundsCount.totalCount;

          return operator;
        })
      );

      response.data.operators.edges = operatorsWithRounds.map(
        (operator, index) => ({
          cursor: response.data.operators.edges[index].cursor,
          node: operator,
        })
      );

      await Promise.all(
        response.data.operators.edges.map(async (edge) => {
          const operator = edge.node;
          const identity = operator.identity;
          operator.logoUrl = '';
          operator.moniker = '';

          // try {
          const keybaseUrl = `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}`;
          const keybaseResponse = await this.http.fetch(keybaseUrl);
          const keybaseData = await keybaseResponse.json();

          if (keybaseData.status.code === 0) {
            if (keybaseData.them[0]?.pictures?.primary?.url) {
              operator.logoUrl = keybaseData.them[0].pictures.primary.url;
            }
            if (keybaseData.them[0]?.basics?.username_cased) {
              operator.moniker = keybaseData.them[0].profile.full_name;
            }
          }
          // } catch (error) {
          //   console.error('Error fetching keybase data:', error);
          // }
          return operator;
        })
      );

      return {
        code: 200,
        data: response.data,
      };
    } catch (error) {
      return handleError(error as ErrorType);
    }
  }
}
