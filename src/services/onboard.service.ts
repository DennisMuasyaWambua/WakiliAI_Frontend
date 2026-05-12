import apiClient from '@/lib/api/client';
import { ActivateOwnerRequest, ActivateOwnerResponse } from '@/types/onboard.types';

export const onboardService = {
  activateOwner: async (data: ActivateOwnerRequest): Promise<ActivateOwnerResponse> => {
    const response = await apiClient.post('auth/onboard/activate-owner/', data);
    return response.data;
  },
};
