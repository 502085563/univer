import { InsertDataColumn, RemoveColumnData } from '../Apply';
import { ICellData } from '../../Interfaces';
import { ObjectMatrixPrimitiveType } from '../../Shared/ObjectMatrix';
import { SheetActionBase, ISheetActionData } from '../../Command/SheetActionBase';
import { ActionObservers, ActionType } from '../../Command/ActionObservers';
import { IInsertColumnDataActionData } from './InsertColumnDataAction';
import { CommandUnit } from '../../Command';

/**
 * @internal
 */
export interface IRemoveColumnDataAction extends ISheetActionData {
    columnIndex: number;
    columnCount: number;
}

/**
 * Remove the column data of the specified column index and column count
 *
 * @internal
 */
export class RemoveColumnDataAction extends SheetActionBase<
    IRemoveColumnDataAction,
    IInsertColumnDataActionData
> {
    static NAME = 'RemoveColumnDataAction';

    constructor(
        actionData: IRemoveColumnDataAction,
        commandUnit: CommandUnit,
        observers: ActionObservers
    ) {
        super(actionData, commandUnit, observers);
        this._doActionData = {
            ...actionData,
        };
        this._oldActionData = {
            ...actionData,
            columnData: this.do(),
        };
        this.validate();
    }

    do(): ObjectMatrixPrimitiveType<ICellData> {
        const worksheet = this.getWorkSheet();

        const result = RemoveColumnData(
            this._doActionData.columnIndex,
            this._doActionData.columnCount,
            worksheet.getCellMatrix().toJSON()
        );

        this._observers.notifyObservers({
            type: ActionType.REDO,
            data: this._doActionData,
            action: this,
        });

        return result;
    }

    redo(): void {
        this.do();
    }

    undo(): void {
        const worksheet = this.getWorkSheet();

        InsertDataColumn(
            this._oldActionData.columnIndex,
            this._oldActionData.columnData,
            worksheet.getCellMatrix().toJSON()
        );

        this._observers.notifyObservers({
            type: ActionType.UNDO,
            data: this._oldActionData,
            action: this,
        });
    }

    validate(): boolean {
        return false;
    }
}
