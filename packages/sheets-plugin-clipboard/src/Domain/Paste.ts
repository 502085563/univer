import { SelectionControl } from '@univerjs/base-sheets/src/Controller/Selection/SelectionController';
import { SheetContext, PLUGIN_NAMES } from '@univerjs/core';
import { RightMenuProps, SelectionModel, SheetPlugin } from '@univerjs/base-sheets';
import { handleTableMergeData } from '@univerjs/base-ui';

export interface PasteType {
    type: string;
    result: string | ArrayBuffer | null;
}

export abstract class Paste {
    private _context: SheetContext;

    constructor(context: SheetContext, pasteList: RightMenuProps[]) {
        this._context = context;
        const SheetPlugin = this._context.getPluginManager().getRequirePluginByName<SheetPlugin>(PLUGIN_NAMES.SPREADSHEET);
        SheetPlugin.addRightMenu(pasteList);

        // SheetPlugin.getCellEditorController().isEditMode
        // const manager = this._context.getObserverManager();
        // manager.requiredObserver<ClipboardEvent>('onSpreadsheetKeyPasteObservable', PLUGIN_NAMES.SPREADSHEET).add((e) => {
        //     this.paste(e);
        // });

        // TODO 注册机制 Paste， PasteManager.handle() 匹配 WpsPaste/GooglePaste/OfficePaste
    }

    getContext() {
        return this._context;
    }

    paste(e: Event) {}
}

export class UniverPaste extends Paste {
    constructor(context: SheetContext) {
        const pasteList = [
            {
                locale: ['rightClick.paste'],
                onClick: () => {
                    // this.pasteTo();
                },
            },
        ];
        super(context, pasteList);
    }

    // async pasteResolver(e?: ClipboardEvent) {
    //     const file: Array<PasteType | null> | null = await Clipboard.read(e);
    //     if (!file) return [];
    //     const HtmlIndex = file.findIndex((item: PasteType | null, index: number) => item && item.type === 'text/html');
    //     const PlainIndex = file.findIndex((item: PasteType | null, index: number) => item && item.type === 'text/plain');
    //     // let data: any[] = [];
    //     // const content = document.createElement('DIV');

    //     if (HtmlIndex > -1) {
    //         const html = file[HtmlIndex]?.result as string;

    //         // content.innerHTML = html;
    //         // data = new Array(content.querySelectorAll('table tr').length);
    //         // if (!data.length) return [];
    //         // let colLen = 0;
    //         // const trs = content.querySelectorAll('table tr');
    //         // const firstTds = trs[0].querySelectorAll('td');
    //         // firstTds.forEach((item: HTMLTableCellElement) => {
    //         //     let colSpan = 0;
    //         //     const attr = item.getAttribute('colSpan');
    //         //     if (attr !== null) {
    //         //         colSpan = +attr;
    //         //     } else {
    //         //         colSpan = 1;
    //         //     }
    //         //     colLen += colSpan;
    //         // });
    //         // for (let i = 0; i < data.length; i++) {
    //         //     data[i] = new Array(colLen);
    //         // }
    //         // let r = 0;
    //         // trs.forEach((item: any) => {
    //         //     let c = 0;
    //         //     item.querySelectorAll('td').forEach((td: HTMLTableCellElement) => {
    //         //         let cell: ICellData = {};
    //         //         if (td.querySelectorAll('span').length || td.querySelectorAll('font').length) {
    //         //             const spanStyle = handleDomToJson(td);
    //         //             if (typeof spanStyle !== 'string') {
    //         //                 cell.p = spanStyle;
    //         //             }
    //         //         }
    //         //         let txt = td.innerText;
    //         //         if (txt.trim().length === 0) {
    //         //             cell.v = null;
    //         //             cell.m = null;
    //         //         } else {
    //         //             // Todo,处理格式
    //         //             cell.v = txt;
    //         //             cell.m = txt;
    //         //         }
    //         //         const style = handleStringToStyle(td);
    //         //         if (Tools.isPlainObject(style)) {
    //         //             cell.s = style;
    //         //         }
    //         //         while (c < colLen && data[r][c] != null) {
    //         //             c++;
    //         //         }
    //         //         if (c === colLen) {
    //         //             return;
    //         //         }
    //         //         if (data[r][c] == null) {
    //         //             data[r][c] = cell;
    //         //             let rowSpan = Number(td.getAttribute('rowSpan'));
    //         //             let colSpan = Number(td.getAttribute('colSpan'));
    //         //             if (Number.isNaN(rowSpan)) {
    //         //                 rowSpan = 1;
    //         //             }
    //         //             if (Number.isNaN(colSpan)) {
    //         //                 colSpan = 1;
    //         //             }
    //         //             if (rowSpan > 1 || colSpan > 1) {
    //         //                 let first = { rs: rowSpan - 1, cs: colSpan - 1, r, c };
    //         //                 data[r][c].mc = first;
    //         //                 for (let rp = 0; rp < rowSpan; rp++) {
    //         //                     for (let cp = 0; cp < colSpan; cp++) {
    //         //                         if (rp === 0 && cp === 0) {
    //         //                             continue;
    //         //                         }
    //         //                         data[r + rp][c + cp] = { mc: null };
    //         //                     }
    //         //                 }
    //         //             }
    //         //         }
    //         //         c++;
    //         //     });
    //         //     r++;
    //         // });

    //         return handelTableToJson(html);
    //     }
    //     if (PlainIndex > -1) {
    //         const html = file[PlainIndex]?.result as string;

    //         // content.innerHTML = html;
    //         // let dataChe = html.replace(/\r/g, '');
    //         // let che = dataChe.split('\n');
    //         // let colCheLen = che[0].split('\t').length;
    //         // for (let i = 0; i < che.length; i++) {
    //         //     if (che[i].split('\t').length < colCheLen) {
    //         //         continue;
    //         //     }
    //         //     data.push(che[i].split('\t'));
    //         // }
    //         // for (let i = 0; i < data.length; i++) {
    //         //     for (let j = 0; j < data[i].length; j++) {
    //         //         if (data[i][j].length) {
    //         //             data[i][j] = {
    //         //                 v: data[i][j],
    //         //                 m: data[i][j],
    //         //             };
    //         //         } else {
    //         //             data[i][j] = null;
    //         //         }
    //         //     }
    //         // }

    //         return handlePlainToJson(html);
    //     }

    //     // return data;
    // }

    pasteTo(data) {
        // const data = await this.pasteResolver(e);
        // if (data.length === 0) return;

        if (!data || data?.length === 0) return;
        const sheet = this.getContext().getWorkBook().getActiveSheet();
        if (!sheet) return;
        const SheetPlugin = this.getContext().getPluginManager().getPluginByName<SheetPlugin>(PLUGIN_NAMES.SPREADSHEET);
        if (!SheetPlugin) return;
        const spreadsheet = SheetPlugin?.getMainComponent();
        if (!spreadsheet) return;
        const controls = SheetPlugin?.getSelectionManager().getCurrentControls();
        const selections: any = controls?.map((control: SelectionControl) => {
            const model: SelectionModel = control.model;
            return {
                startRow: model.startRow,
                startColumn: model.startColumn,
                endRow: model.endRow,
                endColumn: model.endColumn,
            };
        });

        if (!selections.length) {
            return;
        }

        if (selections.length > 1) {
            return;
        }

        const selection = selections[0];

        // let copyH = data.length;
        // let copyC = data[0].length;

        // let minH = selection.startRow; //应用范围首尾行
        // let maxH = minH + copyH - 1;
        // let minC = selection.startColumn; //应用范围首尾列
        // let maxC = minC + copyC - 1;

        // const isMerge = sheet.getMerges().getByRowColumn(minH, maxH, minC, maxC);
        // if (isMerge) {
        //     return;
        // }

        // // Todo: 若应用范围超过最大行或最大列，增加行列
        // for (let i = 0; i < data.length; i++) {
        //     for (let j = 0; j < data[i].length; j++) {
        //         if (data[i][j] && typeof data[i][j] === 'object' && 'mc' in data[i][j]) {
        //             if (data[i][j].mc) {
        //                 const mc = data[i][j].mc;
        //                 const startRow = mc.r + minH;
        //                 const endRow = startRow + mc.rs;
        //                 const startColumn = mc.c + minC;
        //                 const endColumn = startColumn + mc.cs;

        //                 sheet.getMerges().add({ startRow, endRow, startColumn, endColumn });
        //                 delete data[i][j].mc;
        //             } else {
        //                 data[i][j] = null;
        //             }
        //         }
        //     }
        // }

        // sheet.getRange(minH, minC, maxH, maxC).setRangeDatas(data);

        let copyH = data.length;
        let copyC = data[0].length;

        let minH = selection.startRow; //应用范围首尾行
        let maxH = minH + copyH - 1;
        let minC = selection.startColumn; //应用范围首尾列
        let maxC = minC + copyC - 1;
        const isMerge = sheet.getMerges().getByRowColumn(minH, maxH, minC, maxC);
        if (isMerge) {
            return;
        }
        // 最终渲染数据
        const tableData = handleTableMergeData(data, selection);
        const mergeData = tableData.mergeData;
        for (let i = 0; i < mergeData.length; i++) {
            sheet.getMerges().add(mergeData[i]);
        }
        sheet.getRange(minH, minC, maxH, maxC).setRangeDatas(tableData.data);
    }

    paste(e: ClipboardEvent) {
        this.pasteTo(e);
    }
}
