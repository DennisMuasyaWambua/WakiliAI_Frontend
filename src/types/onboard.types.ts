export interface ActivateOwnerRequest {
  token: string;
  username: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  password: string;
  confirm_password: string;
}

export interface ActivateOwnerResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      username: string;
      first_name: string;
      last_name: string;
      mobile_number: string;
    };
  };
}
