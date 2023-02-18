import { InsertDataRow, RemoveRowData } from '../Apply';
import { ICellData } from '../../Interfaces';
import { ObjectMatrixPrimitiveType } from '../../Shared/ObjectMatrix';
import { SheetActionBase, ISheetActionData } from '../../Command/SheetActionBase';
import { ActionObservers, ActionType } from '../../Command/ActionObservers';
import { IInsertRowDataActionData } from './InsertRowDataAction';
import { CommandUnit } from '../../Command';

/**
 * @internal
 */
export interface IRemoveRowDataActionData extends ISheetActionData {
    rowIndex: number;
    rowCount: number;
}

/**
 * Remove the row data of the specified row index and row count
 *
 * @internal
 */
export class RemoveRowDataAction extends SheetActionBase<
    IRemoveRowDataActionData,
    IInsertRowDataActionData
> {
    static NAME = 'RemoveRowDataAction';

    constructor(
        actionData: IRemoveRowDataActionData,
        commandUnit: CommandUnit,
        observers: ActionObservers
    ) {
        super(actionData, commandUnit, observers);
        this._doActionData = {
            ...actionData,
        };
        this._oldActionData = {
            ...actionData,
            rowData: this.do(),
        };
        this.validate();
    }

    do(): ObjectMatrixPrimitiveType<ICellData> {
        const worksheet = this.getWorkSheet();

        const result = RemoveRowData(
            this._doActionData.rowIndex,
            this._doActionData.rowCount,
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

        InsertDataRow(
            this._oldActionData.rowIndex,
            this._oldActionData.rowData,
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
