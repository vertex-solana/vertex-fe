export interface GetAllIndexersParams {
  pageNum?: number;
  pageSize?: number;
}

export interface GetAllIdlsParams {
  pageNum?: number;
  pageSize?: number;
}

export interface UploadIdlPayload {
  programId: string;
  version: string;
  name: string;
  idlFile: File;
}

export interface CreateIndexerPayload {
  name: string;
  idlId: number | null;
  cluster: string;
  description: string;
  programId: string;
}

export interface CreateTablePayload {
  indexerId: number;
  tableName: string;
  schema: {
    name: string;
    type: any;
    nullable: boolean | undefined;
  }[];
}

export interface CreateTriggerAndTransformerPayload {
  indexerId: number;
  tableId: number;
  triggerType: string;
  pdaPubkey: string;
  pdaName: string;
  transformCode: string;
}

export interface UpdateTransformerScriptPayload {
  indexerId: number;
  script: string;
  transformerId: number;
}

export interface CreateQueryLogPayload {
  indexerId: number;
  description: string;
  query: string;
}
