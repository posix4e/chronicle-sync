import { RxJsonSchema, ExtractDocumentTypeFromTypedRxJsonSchema } from 'rxdb';

export const historyItemSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    url: {
      type: 'string',
      maxLength: 2048
    },
    title: {
      type: 'string',
      maxLength: 1000
    },
    visitTime: {
      type: 'number'
    },
    deviceId: {
      type: 'string',
      maxLength: 100
    },
    syncedAt: {
      type: 'number'
    }
  },
  required: ['id', 'url', 'visitTime', 'deviceId'],
  indexes: ['visitTime', 'deviceId', 'syncedAt']
} as const;

export type HistoryItemDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof historyItemSchema>;

export interface HistoryItem {
  id: string;
  url: string;
  title?: string;
  visitTime: number;
  deviceId: string;
  syncedAt?: number;
}