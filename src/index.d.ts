import type { GlobalOptions } from '@googleapis/sheets';

export default function sheetParser(auth?: GlobalOptions['auth']): {
  getCollections(spreadsheetId: string): Promise<string[]>;
  getDataFromSheet<T extends { [dbId: string]: unknown }>(spreadsheetId: string, dbIds?: `#${(keyof T) & string}`[], mapping?: (value: any, header: string, sheetId: string, index: number) => any): Promise<T>;
};
