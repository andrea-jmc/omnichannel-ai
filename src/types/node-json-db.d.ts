export interface UserDataObject {
  id: string;
  dni: string;
  titular: string;
  poliza: string;
  certificado: string;
  paciente: string;
  cuenta: string;
  banco: string;
  tipo_cuenta: "LPS" | "USD";
  documents: string[];
}

export interface SaveUserRequest {
  id: string;
  dni: string;
  titular: string;
  poliza: string;
  certificado: string;
  paciente: string;
  cuenta: string;
  banco: string;
  tipo_cuenta: "LPS" | "USD";
}

export interface AddDataRequest {
  id: string;
  document: string;
}
