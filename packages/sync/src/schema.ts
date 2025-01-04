import { ExtractDocumentTypeFromTypedRxJsonSchema } from 'rxdb';

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
      type: 'number',
      multipleOf: 1,
      minimum: 0,
      maximum: 9007199254740991  // Number.MAX_SAFE_INTEGER
    },
    deviceId: {
      type: 'string',
      maxLength: 100
    },
    syncedAt: {
      type: 'number',
      multipleOf: 1,
      minimum: 0,
      maximum: 9007199254740991  // Number.MAX_SAFE_INTEGER
    },
    _deleted: {
      type: 'boolean'
    }
  },
  required: ['id', 'url', 'visitTime', 'deviceId', '_deleted'],
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
  _deleted: boolean;
}
