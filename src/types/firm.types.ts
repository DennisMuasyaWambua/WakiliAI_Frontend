export type FirmType = 'big_law' | 'mid_size' | 'system';

export interface CreateFirmRequest {
  firm_name: string;
  firm_type: FirmType;
  firm_email: string;
  firm_phone: string;
  firm_address: string;
  owner_email: string;
  owner_role: number;
}

export interface CreateFirmPayload {
  firm_name: string;
  firm_type: FirmType;
  firm_email: string;
  firm_phone: string;
  firm_address: string;
  owner_email: string;
  owner_role: number;
}

export interface Firm {
  name: string;
  firm_type: FirmType;
  email: string;
  phone: string;
  address: string;
  logo: string | null;
  is_active: boolean;
}

export interface FirmResponse {
  success: boolean;
  data: Firm;
}

export const FIRM_TYPE_CHOICES: { value: FirmType; label: string }[] = [
  { value: 'big_law', label: 'Big Law Firm' },
  { value: 'mid_size', label: 'Mid-Sized Firm' },
  { value: 'system', label: 'System' },
];

export const ROLE_CHOICES = {
  big_law: [
    { value: 1, label: 'Managing Partner' },
    { value: 2, label: 'Senior Partner' },
    { value: 3, label: 'Junior Partner' },
    { value: 4, label: 'Senior Associate' },
    { value: 5, label: 'Associate' },
    { value: 6, label: 'Junior Associate' },
    { value: 7, label: 'Trainee Advocate / Pupil' },
  ],
  mid_size: [
    { value: 1, label: 'Founding Partner' },
    { value: 2, label: 'Partner' },
    { value: 3, label: 'Junior Advocate' },
    { value: 4, label: 'Pupil / Trainee Advocate' },
  ],
  system: [
    { value: 1, label: 'System Admin' },
  ],
};
