import { IKeyType, IKeyValue, Nullable } from '../Shared/Types';
import { BooleanNumber, LocaleType } from '../Enum';
import { IStyleData } from './IStyleData';
import { IWorksheetConfig } from './IWorksheetData';
import { INamedRange } from './INamedRange';

/**
 * Properties of a workbook's configuration
 */
export interface IWorkbookConfig {
    createdTime: string;
    lastModifiedBy: string;
    id: string; // unit id
    locale: LocaleType;
    name: string;
    theme: string;
    skin: string;
    modifiedTime: string;
    timeZone: string;
    creator: string;
    appVersion: string;
    socketUrl: string; // 协同
    socketEnable: BooleanNumber; // 协同
    extensions: [];
    styles: IKeyType<Nullable<IStyleData>>;
    sheets: { [sheetId: string]: Partial<IWorksheetConfig> };
    sheetOrder: string[]; // sheet id order list ['xxxx-sheet3', 'xxxx-sheet1','xxxx-sheet2']
    pluginMeta: IKeyValue;
    namedRanges: INamedRange[];
}
