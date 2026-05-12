import apiClient, { tokenManager } from '@/lib/api/client';
import { CreateFirmPayload, FirmResponse } from '@/types/firm.types';

export const firmService = {
  createFirm: async (
    data: CreateFirmPayload
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('auth/admin/firms/create/', data);
    return response.data;
  },

  getFirm: async (): Promise<FirmResponse> => {
    const response = await apiClient.get('auth/firm/');
    return response.data;
  },
};

export const getOwnerFromStorage = (): { owner_email: string; owner_role: number } | null => {
  const user = tokenManager.getUser();
  if (!user) return null;
  return {
    owner_email: user.email,
    owner_role: 1,
  };
};
