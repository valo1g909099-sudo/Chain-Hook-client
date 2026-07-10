import { useCallback, useState } from 'react';

import { generateClientToken,GenerateClientTokenPayload } from '@/services/clientTokenService';
import { ApiError } from '@/services/apiClient';
interface UseGenerateClientTokenResult {
  generate: (payload: GenerateClientTokenPayload) => Promise<string | null>;
  loading: boolean;
  error: string | null;
  clientId: string | null;
  reset: () => void;
}

export function useGenerateClientToken(): UseGenerateClientTokenResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const generate = useCallback(async (payload: GenerateClientTokenPayload) => {
    setLoading(true);
    setError(null);
    setClientId(null);
    try {
      const res = await generateClientToken(payload);
      setClientId(res.client_id);
      return res.client_id;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to generate client token.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setClientId(null);
    setError(null);
  }, []);

  return { generate, loading, error, clientId, reset };
}
