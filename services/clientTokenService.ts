import { apiRequest } from './apiClient'; // adjust path to wherever apiRequest lives
import { ENDPOINTS } from './config';

export type ClientFlowType = 'login' | 'payment';

export interface GenerateClientTokenPayload {
  type: ClientFlowType;
  platform_name: string;
  base_url: string;
  merchant_name?: string;
  total_price?: string;
  api_key: string;
}

export interface GenerateClientTokenResponse {
  client_id: string;
}

export interface ValidateClientTokenResponse {
  valid: boolean;
  reason: string;
  message: string;
  client?: {
    id: number;
    name: string;
    base_url: string;
    for_login: boolean;
    for_payment: boolean;
  };
  payload?: Record<string, unknown>;
}

/**
 * Server-verified client_id generation.
 *
 * This replaces the old client-side `btoa(JSON.stringify(...))` approach.
 * The backend looks up the Client row by `api_key`, cross-checks
 * platform_name/base_url against what's registered, confirms the flow
 * type is authorized, and only then signs a client_id token. Nothing
 * about the returned token can be forged without a real api_key.
 *
 * Not session-authenticated — the api_key itself is the credential,
 * so this call intentionally does not attach a bearer token.
 */
export async function generateClientToken(
  payload: GenerateClientTokenPayload
): Promise<GenerateClientTokenResponse> {
  return apiRequest<GenerateClientTokenResponse>(ENDPOINTS.CLIENTS.GENERATE_TOKEN, {
    method: 'POST',
    data: payload,
    auth: false,
  });
}

/**
 * Optional helper if the portal ever wants to preview/inspect a
 * generated token before launching the flow.
 */
export async function validateClientToken(
  clientId: string
): Promise<ValidateClientTokenResponse> {
  return apiRequest<ValidateClientTokenResponse>(
    `${ENDPOINTS.CLIENTS.VALIDATE_TOKEN}?client_id=${encodeURIComponent(clientId)}`,
    { method: 'GET', auth: false }
  );
}
