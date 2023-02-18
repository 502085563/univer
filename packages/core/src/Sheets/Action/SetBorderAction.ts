import { ObjectMatrixPrimitiveType } from '../../Shared';
import { SheetActionBase, ISheetActionData } from '../../Command/SheetActionBase';
import { SetBorder } from '../Apply';
import { IStyleData } from '../../Interfaces';
import { ActionObservers, ActionType } from '../../Command/ActionObservers';
import { CommandUnit } from '../../Command';

/**
 * @internal
 * Border style format
 */
export interface BorderStyleData extends ISheetActionData {
    styles: ObjectMatrixPrimitiveType<IStyleData>;
}

/**
 * set border style
 *
 * @internal
 */
export class SetBorderAction extends SheetActionBase<
    BorderStyleData,
    BorderStyleData
> {
    static NAME = 'SetBorderAction';

    constructor(
        actionData: BorderStyleData,
        commandUnit: CommandUnit,
        observers: ActionObservers
    ) {
        super(actionData, commandUnit, observers);
        this._doActionData = {
            ...actionData,
        };
        this._oldActionData = {
            ...actionData,
            styles: this.do(),
        };
        this.validate();
    }

    do(): ObjectMatrixPrimitiveType<IStyleData> {
        const workSheet = this.getWorkSheet();
        const matrix = workSheet.getCellMatrix();
        const context = workSheet.getContext();
        const workBook = context.getWorkBook();
        const styles = workBook.getStyles();

        const result = SetBorder(matrix, styles, this._doActionData.styles);

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
        const wokSheet = this.getWorkSheet();
        const matrix = wokSheet.getCellMatrix();
        const context = wokSheet.getContext();
        const workBook = context.getWorkBook();
        const styles = workBook.getStyles();

        SetBorder(matrix, styles, this._oldActionData.styles);

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
