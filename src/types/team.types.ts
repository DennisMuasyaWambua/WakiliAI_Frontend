export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
}

export interface InviteMemberRequest {
  email: string;
  role_id: number;
}

export interface InviteMemberResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    role: string;
    invited_at: string;
  };
}

export interface TeamMember {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role: string;
  role_id: number;
  is_active: boolean;
  joined_at?: string;
}

export interface Invite {
  id: string;
  email: string;
  role_name: string;
  is_used: boolean;
  expires_at: string;
  created_at: string;
}

export interface InvitesResponse {
  success: boolean;
  data: Invite[];
  message?: string;
}

export interface FirmMember {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  roles: string[];
  access_level: number;
  is_activated: number;
  status: number;
  date_joined: string;
}

export interface FirmMembersResponse {
  success: boolean;
  data: FirmMember[];
  message?: string;
}
