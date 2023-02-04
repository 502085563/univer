import { FormatType } from '@univerjs/core';

export type IConfig = {};

export type FindType = FormatType | 'null' | 'text' | 'condition' | 'intervalRow' | 'intervalColumn';

// Types for props
export type IProps = { config: IConfig };
