export interface AdsData {
  id: string;
  network: string;
  link: string;
  email: string;
  phone: string;
  status: string;
  statusID: string;
}

export interface ConfigValidateAds {
  email?: string;
  phone?: string;
  status?: string;
  network?: string;
  link?: string;
}
