import { SheetActionBase, ActionObservers, ISheetActionData, Nullable, Workbook } from '@univerjs/core';
import { IFilter } from '../Domain';
import { ACTION_NAMES, FILTER_PLUGIN_NAME } from '../Const';
import { AddFilter, RemoveFilter } from '../Apply';
import { IRemoveFilterActionData } from './RemoveFilterAction';

export interface IAddFilterActionData extends ISheetActionData {
    filter: Nullable<IFilter>;
}

export class AddFilterAction extends SheetActionBase<IAddFilterActionData, IRemoveFilterActionData> {
    constructor(actionData: IAddFilterActionData, workbook: Workbook, observers: ActionObservers) {
        super(actionData, workbook, observers);
        this._doActionData = {
            ...actionData,
        };
        this._oldActionData = {
            sheetId: this._doActionData.sheetId,
            actionName: ACTION_NAMES.ADD_FILTER_ACTION,
        };
        this.do();
        this.validate();
    }

    redo(): void {
        const worksheet = this.getWorkSheet();
        const context = worksheet.getContext();
        const manager = context.getPluginManager();
        AddFilter(manager.getRequirePluginByName(FILTER_PLUGIN_NAME), this._doActionData.sheetId, this._doActionData.filter);
    }

    undo(): void {
        const worksheet = this.getWorkSheet();
        const context = worksheet.getContext();
        const manager = context.getPluginManager();
        RemoveFilter(manager.getRequirePluginByName(FILTER_PLUGIN_NAME), this._oldActionData.sheetId);
    }

    do(): void {
        this.redo();
    }

    validate(): boolean {
        throw new Error('Method not implemented.');
    }
}
