
export enum ScanStatus {
  Idle = 'idle',
  Scanning = 'scanning',
  Success = 'success',
  Error = 'error',
}

export interface NFCRecord {
  recordType: string;
  mediaType?: string;
  data: string;
  encoding?: string;
}

export interface NFCMessage {
  records: NFCRecord[];
  serialNumber?: string;
}
