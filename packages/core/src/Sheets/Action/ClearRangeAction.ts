import { SetRangeData, ClearRange } from '../Apply';
import { ICellData, IOptionsData, IRangeData } from '../../Interfaces';
import { ObjectMatrixPrimitiveType } from '../../Shared/ObjectMatrix';
import { SheetActionBase, ISheetActionData } from '../../Command/SheetActionBase';
import { ActionObservers, ActionType } from '../../Command/ActionObservers';
import { ISetRangeDataActionData, SetRangeDataAction } from './SetRangeDataAction';
import { CommandUnit } from '../../Command';

/**
 * @internal
 */
export interface IClearRangeActionData extends ISheetActionData {
    options: IOptionsData;
    rangeData: IRangeData;
}

/**
 * Clearly specify a range of styles, content, comments, validation, filtering
 *
 * @internal
 */
export class ClearRangeAction extends SheetActionBase<
    IClearRangeActionData,
    ISetRangeDataActionData,
    ObjectMatrixPrimitiveType<ICellData>
> {
    static NAME = 'ClearRangeAction';

    constructor(
        actionData: IClearRangeActionData,
        commandUnit: CommandUnit,
        observers: ActionObservers
    ) {
        super(actionData, commandUnit, observers);

        this._doActionData = {
            ...actionData,
        };
        this._oldActionData = {
            ...actionData,
            cellValue: this.do(),
        };
        this.validate();
    }

    do(): ObjectMatrixPrimitiveType<ICellData> {
        const worksheet = this.getWorkSheet();

        const result = ClearRange(
            worksheet.getCellMatrix(),
            this._doActionData.options,
            this._doActionData.rangeData
        );

        this._observers.notifyObservers({
            type: ActionType.REDO,
            data: this._doActionData,
            action: this,
        });

        return result;
    }

    redo(): void {
        // update pre data
        const { sheetId, rangeData } = this._doActionData;

        this._oldActionData = {
            // actionName: ACTION_NAMES.SET_RANGE_DATA_ACTION,
            actionName: SetRangeDataAction.NAME,
            sheetId,
            cellValue: this.do(),
        };
    }

    undo(): void {
        const worksheet = this.getWorkSheet();
        const { cellValue } = this._oldActionData;
        const styles = this._workbook.getStyles();

        if (worksheet) {
            SetRangeData(worksheet.getCellMatrix(), cellValue, styles);
            // no need update current data

            this._observers.notifyObservers({
                type: ActionType.UNDO,
                data: this._oldActionData,
                action: this,
            });
        }
    }

    validate(): boolean {
        return false;
    }
}
