import apiClient from '@/lib/api/client';
import { 
  RolesResponse, 
  InviteMemberRequest, 
  InviteMemberResponse, 
  InvitesResponse,
  FirmMembersResponse 
} from '@/types/team.types';

export const teamService = {
  getRoles: async (): Promise<RolesResponse> => {
    const response = await apiClient.get('auth/roles/');
    return response.data;
  },

  inviteMember: async (data: InviteMemberRequest): Promise<InviteMemberResponse> => {
    const response = await apiClient.post('auth/onboard/invite/', data);
    return response.data;
  },

  getInvites: async (): Promise<InvitesResponse> => {
    const response = await apiClient.get('auth/onboard/invites/');
    return response.data;
  },

  getFirmMembers: async (): Promise<FirmMembersResponse> => {
    const response = await apiClient.get('auth/firm/members/');
    return response.data;
  },
};
