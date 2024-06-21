// Create interface for ads data
export interface AdsData {
  id: string;
  network: string;
  link: string;
  email: string;
  phone: string;
  status: string;
  statusID: string;
}

// Create interface for validate
export interface ConfigValidateAds {
  email?: string;
  phone?: string;
  status?: string;
  network?: string;
  link?: string;
  [key: string]: string;
}

// Create interface for errors
export interface Errors {
  [key: string]: string;
}
