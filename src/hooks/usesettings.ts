import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/services/apiClient';
import {
  settingsService,
  AllSettings,
  UpdateSettingsPayload,
  UpdateSettingsResponse,
} from '@/services/settingsservice';

interface UseSettingsResult {
  settings: AllSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateSettings: (payload: UpdateSettingsPayload) => Promise<UpdateSettingsResponse | null>;
  updating: boolean;
  updateError: string | null;
}

function hasUpdatedWrapper(
  data: UpdateSettingsResponse
): data is { updated: Partial<AllSettings>; errors: Record<string, unknown> } {
  return typeof data === 'object' && data !== null && 'updated' in data && 'errors' in data;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<AllSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsService.getAll();
      setSettings(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(
    async (payload: UpdateSettingsPayload): Promise<UpdateSettingsResponse | null> => {
      setUpdating(true);
      setUpdateError(null);
      try {
        const data = await settingsService.update(payload);

        
        const updatedSections = hasUpdatedWrapper(data) ? data.updated : data;
        setSettings((prev) => (prev ? { ...prev, ...updatedSections } : prev));

        if (hasUpdatedWrapper(data) && Object.keys(data.errors).length > 0) {
          setUpdateError('Some sections failed to update. Check field-level errors.');
        }

        return data;
      } catch (err) {
        setUpdateError(err instanceof ApiError ? err.message : 'Failed to update settings.');
        return null;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSettings,
    updating,
    updateError,
  };
}