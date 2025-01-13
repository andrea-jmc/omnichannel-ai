export interface UserDataObject {
  id: string;
  name: string;
  email: string;
  account: string;
  form: string[];
  recibosConsultas: string[];
  recetas: string[];
  facturasFarmacia: string[];
  ordenesLab: string[];
  facturasLab: string[];
  resultados: string[];
}

export interface CreateUserRequest {
  id: string;
  name: string;
  email: string;
  account: string;
}

export interface AddDataRequest {
  id: string;
  value: string;
}
