/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DEFAULT_STYLES, Disposable, UniverInstanceType } from '@univerjs/core';
import { type Observable, Subject } from 'rxjs';
import type { DocumentDataModel, ICommandService, IDocumentData, IDocumentStyle, IPosition, IUndoRedoService, IUniverInstanceService, Nullable } from '@univerjs/core';
import type { DocSelectionManagerService } from '@univerjs/docs';
import type { IDocSelectionInnerParam, IRender, ISuccinctDocRangeParam, ITextRangeWithStyle } from '@univerjs/engine-render';
import { ReplaceContentCommand } from '../../commands/commands/replace-content.command';
import { DocSelectionRenderService, type IEditorInputConfig } from '../selection/doc-selection-render.service';

interface IEditorEvent {
    target: IEditor;
    data: IDocumentData;
}

interface IEditorInputEvent extends IEditorEvent {
    content: string; // Returns a string with the inserted characters. This may be an empty string if the change doesn't insert text (for example, when deleting characters).
    // Returns a Boolean value indicating if the event is fired after compositionstart and before compositionend.
    isComposing: boolean;
}

interface IEditor {
    // Events.
    // Emit change event when editor lose focus.
    change$: Observable<IEditorEvent>;
    // The input event fires when the value of a editor has been changed as a direct result of a user action.
    input$: Observable<IEditorInputEvent>;
    // paste event.
    paste$: Observable<IEditorInputConfig>;
    // Editor get focus.
    focus$: Observable<IEditorInputConfig>;
    // Editor lose focus.
    blur$: Observable<IEditorInputConfig>;
    // Emit when doc selection changed.
    selectionChange$: Observable<IDocSelectionInnerParam>;

    // Methods
    // The focused editor is the editor that will receive keyboard and similar events by default.
    focus(): void;
    // The Editor.blur() method removes keyboard focus from the current editor.
    blur(): void;
    // has focus.
    isFocus(): boolean;
    // Selects the entire content of the editor.
    // Calling editor.select() will not necessarily focus the editor, so it is often used with Editor.focus
    select(): void;
    // Selects the specified range of characters within editor.
    setSelectionRanges(ranges: ISuccinctDocRangeParam[]): void;
    // Get current doc ranges. include text range and rect range.
    getSelectionRanges(): ITextRangeWithStyle[];
    // get editor id.
    getEditorId(): string;
    // get document data.
    getDocumentData(): IDocumentData;
    // Set the new document data.
    setDocumentData(data: IDocumentData): void;
    // Clear the undo redo history of this editor.
    clearUndoRedoHistory(): void;
}

export interface IEditorStateParams extends Partial<IPosition> {
    visible?: boolean;
}

export interface IEditorCanvasStyle {
    fontSize?: number;
}

export interface IEditorConfigParams {
    initialSnapshot?: IDocumentData;
    cancelDefaultResizeListener?: boolean;
    canvasStyle?: IEditorCanvasStyle;
    // A Boolean attribute which, if present, indicates that the editor should automatically have focus.
    // No more than one editor in the document may have the autofocus attribute.
    // If put on more than one editor, the first one with the attribute receives focus.
    autofocus?: boolean; // default false.
    // Boolean. The value is not editable
    readonly?: boolean;

    // The unique id of editor.
    editorUnitId: string;
    /**
     * @deprecated The implementer makes its own judgment.
     */
    isSheetEditor: boolean;
    /**
     * If the editor is for formula editing.
     * @deprecated this is a temp fix before refactoring editor.
     */
    isFormulaEditor: boolean;
    /**
     * @deprecated The implementer makes its own judgment.
     */
    isSingle: boolean;
    /**
     * @deprecated The implementer makes its own judgment.
     */
    onlyInputFormula: boolean;
    /**
     * @deprecated The implementer makes its own judgment.
     */
    onlyInputRange: boolean;
    /**
     * @deprecated The implementer makes its own judgment.
     */
    onlyInputContent: boolean;
    /**
     * @deprecated The implementer makes its own judgment.
     */
    isSingleChoice: boolean;
    /**
     * @deprecated The implementer makes its own judgment.
     */
    openForSheetUnitId: Nullable<string>;
    /**
     * @deprecated The implementer makes its own judgment.
     */
    openForSheetSubUnitId: Nullable<string>;
}

export interface IEditorOptions extends IEditorConfigParams, IEditorStateParams {
    render: IRender;
    documentDataModel: DocumentDataModel;
    editorDom: HTMLDivElement;
}

export class Editor extends Disposable implements IEditor {
    // Emit change event when editor lose focus.
    private readonly _change$ = new Subject<IEditorEvent>();
    change$: Observable<IEditorEvent> = this._change$.asObservable();

    // The input event fires when the value of a editor has been changed as a direct result of a user action.
    private readonly _input$ = new Subject<IEditorInputEvent>();
    input$: Observable<IEditorInputEvent> = this._input$.asObservable();

    // paste event.
    private readonly _paste$ = new Subject<IEditorInputConfig>();
    paste$: Observable<IEditorInputConfig> = this._paste$.asObservable();

    // Editor get focus.
    private _focus = false;
    private readonly _focus$ = new Subject<IEditorInputConfig>();
    focus$: Observable<IEditorInputConfig> = this._focus$.asObservable();

    // Editor lose focus.
    private readonly _blur$ = new Subject<IEditorInputConfig>();
    blur$: Observable<IEditorInputConfig> = this._blur$.asObservable();

    // Emit when doc selection changed.
    private readonly _selectionChange$ = new Subject<IDocSelectionInnerParam>();
    selectionChange$: Observable<IDocSelectionInnerParam> = this._selectionChange$.asObservable();

    private _valueLegality = true;

    private _openForSheetUnitId: Nullable<string>;

    private _openForSheetSubUnitId: Nullable<string>;

    constructor(
        private _param: IEditorOptions,
        private _univerInstanceService: IUniverInstanceService,
        private _docSelectionManagerService: DocSelectionManagerService,
        private _commandService: ICommandService,
        private _undoRedoService: IUndoRedoService
    ) {
        super();
        this._openForSheetUnitId = this._param.openForSheetUnitId;
        this._openForSheetSubUnitId = this._param.openForSheetSubUnitId;

        this._listenSelection();
    }

    private _listenSelection() {
        const docSelectionRenderService = this._param.render.with(DocSelectionRenderService);

        this.disposeWithMe(
            docSelectionRenderService.onBlur$.subscribe((e) => {
                this._blur$.next(e);

                const data = this.getDocumentData();

                this._change$.next({
                    target: this,
                    data,
                });
            })
        );

        this.disposeWithMe(
            docSelectionRenderService.onFocus$.subscribe((e) => {
                this._focus$.next(e);
            })
        );

        this.disposeWithMe(
            docSelectionRenderService.onPaste$.subscribe((e) => {
                this._paste$.next(e);
            })
        );

        this.disposeWithMe(
            docSelectionRenderService.onInput$.subscribe((e) => {
                const { content = '' } = e;
                const data = this.getDocumentData();

                this._input$.next({
                    target: this,
                    content,
                    data,
                    isComposing: false,
                });
            })
        );

        this.disposeWithMe(
            this._docSelectionManagerService.textSelection$.subscribe((e) => {
                if (e == null) {
                    return;
                }

                const { unitId, subUnitId, ...params } = e;
                const editorId = this.getEditorId();

                if (unitId === editorId) {
                    this._selectionChange$.next(params);
                }
            })
        );
    }

    focus() {
        const curDoc = this._univerInstanceService.getCurrentUnitForType(UniverInstanceType.UNIVER_DOC);
        const editorUnitId = this.getEditorId();
        // Step 1: set current editor to currentDocUnit.
        if (curDoc == null || curDoc.getUnitId() !== editorUnitId) {
            this._univerInstanceService.setCurrentUnitForType(editorUnitId);
        }

        // Step 2: Focus this input element.
        const docSelectionRenderService = this._param.render.with(DocSelectionRenderService);
        docSelectionRenderService.focus();

        // Step 3: Sets the selection of the last selection, and if not, to the beginning of the document.
        const lastSelectionInfo = this._docSelectionManagerService.getDocRanges({
            unitId: editorUnitId,
            subUnitId: editorUnitId,
        });

        if (lastSelectionInfo) {
            this._docSelectionManagerService.replaceDocRanges(lastSelectionInfo, {
                unitId: editorUnitId,
                subUnitId: editorUnitId,
            }, false);
        }

        this._focus = true;
    }

    blur(): void {
        const docSelectionRenderService = this._param.render.with(DocSelectionRenderService);

        docSelectionRenderService.blur();

        this._focus = false;
    }

    // Selects the entire content of the editor.
    // Calling editor.select() will not necessarily focus the editor, so it is often used with Editor.focus
    select(): void {
        const documentData = this.getDocumentData();

        return this.setSelectionRanges([{
            startOffset: 0,
            endOffset: documentData.body ? documentData.body.dataStream.length - 2 : 0,
        }]);
    }

    // Selects the specified range of characters within editor.
    setSelectionRanges(ranges: ISuccinctDocRangeParam[]): void {
        const editorUnitId = this.getEditorId();
        const params = {
            unitId: editorUnitId,
            subUnitId: editorUnitId,
        };

        return this._docSelectionManagerService.replaceDocRanges(ranges, params, false);
    }

    // Get current doc ranges. include text range and rect range.
    getSelectionRanges(): ITextRangeWithStyle[] {
        const editorUnitId = this.getEditorId();
        const params = {
            unitId: editorUnitId,
            subUnitId: editorUnitId,
        };

        return this._docSelectionManagerService.getDocRanges(params);
    }

    // get editor id.
    getEditorId(): string {
        return this._param.editorUnitId;
    }

    // get document data.
    getDocumentData(): IDocumentData {
        const editorUnitId = this.getEditorId();
        const docDataModel = this._univerInstanceService.getUnit<DocumentDataModel>(editorUnitId, UniverInstanceType.UNIVER_DOC)!;

        return docDataModel.getSnapshot();
    }

    // Set the new document data.
    setDocumentData(data: IDocumentData, textRanges: Nullable<ITextRangeWithStyle[]>) {
        const { id, body } = data;

        this._commandService.executeCommand(ReplaceContentCommand.id, {
            unitId: id,
            body: {
                ...body,
                dataStream: body?.dataStream.endsWith('\r\n')
                    ? body.dataStream.substring(0, body.dataStream.length - 2)
                    : body!.dataStream,
            },
            textRanges,
        });
    }

    // Clear the undo redo history of this editor.
    clearUndoRedoHistory(): void {
        const editorUnitId = this.getEditorId();

        return this._undoRedoService.clearUndoRedo(editorUnitId);
    }

    /**
     * @deprecated use getDocumentData.
     */
    get documentDataModel() {
        return this._param.documentDataModel;
    }

    /**
     * @deprecated use getEditorId.
     */
    get editorUnitId() {
        return this._param.editorUnitId;
    }

    get cancelDefaultResizeListener() {
        return this._param.cancelDefaultResizeListener;
    }

    get render() {
        return this._param.render;
    }

    isSingleChoice() {
        return this._param.isSingleChoice;
    }

    /** @deprecated */
    setOpenForSheetUnitId(unitId: Nullable<string>) {
        this._openForSheetUnitId = unitId;
    }

    /** @deprecated */
    getOpenForSheetUnitId() {
        return this._openForSheetUnitId;
    }

    /** @deprecated */
    setOpenForSheetSubUnitId(subUnitId: Nullable<string>) {
        this._openForSheetSubUnitId = subUnitId;
    }

    /** @deprecated */
    getOpenForSheetSubUnitId() {
        return this._openForSheetSubUnitId;
    }

    /** @deprecated */
    isValueLegality() {
        return this._valueLegality === true;
    }

    /** @deprecated */
    setValueLegality(state = true) {
        this._valueLegality = state;
    }

    isFocus() {
        return this._focus;
    }

    /** @deprecated */
    setFocus(state = false) {
        this._focus = state;
    }

    /** @deprecated */
    isSingle() {
        return this._param.isSingle === true || this.onlyInputRange();
    }

    isReadOnly() {
        return this._param.readonly === true;
    }

    /** @deprecated */
    onlyInputContent() {
        return this._param.onlyInputContent === true;
    }

    /** @deprecated */
    onlyInputFormula() {
        return this._param.onlyInputFormula === true;
    }

    /** @deprecated */
    onlyInputRange() {
        return this._param.onlyInputRange === true;
    }

    getBoundingClientRect() {
        return this._param.editorDom.getBoundingClientRect();
    }

    isVisible() {
        return this._param.visible;
    }

    /** @deprecated */
    isSheetEditor() {
        return this._param.isSheetEditor === true;
    }

    /** @deprecated */
    isFormulaEditor() {
        return this._param.isFormulaEditor === true;
    }

    /**
     * @deprecated use getDocumentData.
     */
    getValue() {
        const value = this._param.documentDataModel.getBody()?.dataStream || '';
        return value.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\n/g, '');
    }

    /**
     * @deprecated use getDocumentData.
     */
    getBody() {
        return this._param.documentDataModel.getBody();
    }

    /**
     * @deprecated.
     */
    update(param: Partial<IEditorOptions>) {
        this._param = {
            ...this._param,
            ...param,
        };
    }

    verticalAlign() {
        const documentDataModel = this._param?.documentDataModel;

        if (documentDataModel == null) {
            return;
        }

        const { width, height } = this._param.editorDom.getBoundingClientRect();

        if (height === 0 || width === 0) {
            return;
        }

        if (!this.isSingle()) {
            documentDataModel.updateDocumentDataPageSize(width, undefined);
            return;
        }

        let fontSize = DEFAULT_STYLES.fs;

        if (this._param.canvasStyle?.fontSize) {
            fontSize = this._param.canvasStyle.fontSize;
        }

        const top = (height - (fontSize * 4 / 3)) / 2 - 2;

        documentDataModel.updateDocumentDataMargin({
            t: top < 0 ? 0 : top,
        });

        documentDataModel.updateDocumentDataPageSize(undefined, undefined);
    }

    updateCanvasStyle() {
        const documentDataModel = this._param.documentDataModel;
        if (documentDataModel == null) {
            return;
        }

        const documentStyle: IDocumentStyle = {};

        if (this._param.canvasStyle?.fontSize) {
            if (documentStyle.textStyle == null) {
                documentStyle.textStyle = {};
            }

            documentStyle.textStyle.fs = this._param.canvasStyle.fontSize;
        }

        documentDataModel.updateDocumentStyle(documentStyle);
    }
}