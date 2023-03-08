import { IFormulaConfig } from '../Interfaces/IFormula';

export const DEFAULT_FORMULA_DATA: IFormulaConfig = {
    formulaData: {
        'workbook-01': {
            'sheet-01': {
                '12': {
                    '3': {
                        formula: '=SUM(F1, G8)',
                        row: 12,
                        column: 3,
                        sheetId: 'sheet-01',
                    },
                },
                '13': {
                    '3': {
                        formula: '=SUM(A3:G4)',
                        row: 13,
                        column: 3,
                        sheetId: 'sheet-01',
                    },
                },
                '14': {
                    '3': {
                        formula: '=SUM(D14, D13)',
                        row: 14,
                        column: 3,
                        sheetId: 'sheet-01',
                    },
                },
            },
        },
    },
};
export const DEFAULT_FORMULA_DATA_DOWN: IFormulaConfig = {
    formulaData: {
        'workbook-02': {
            'sheet-0001': {
                '12': {
                    '3': {
                        formula: '=SUM(F1, G8)',
                        row: 12,
                        column: 3,
                        sheetId: 'sheet-0001',
                    },
                },
                '13': {
                    '3': {
                        formula: '=SUM(A3:G4)',
                        row: 13,
                        column: 3,
                        sheetId: 'sheet-0001',
                    },
                },
                '14': {
                    '3': {
                        formula: '=SUM(D14, D13)',
                        row: 14,
                        column: 3,
                        sheetId: 'sheet-0001',
                    },
                },
            },
        },
    },
};

export const DEFAULT_FORMULA_DATA_DEMO: IFormulaConfig = {
    formulaData: {
        'workbook-01': {
            'sheet-0003': {
                '11': {
                    '6': {
                        formula: '=E12*F12',
                        row: 11,
                        column: 6,
                        sheetId: 'sheet-0003',
                    },
                },
                '12': {
                    '6': {
                        formula: '=E13*F13',
                        row: 12,
                        column: 6,
                        sheetId: 'sheet-0003',
                    },
                },
                '13': {
                    '6': {
                        formula: '=LAMBDA(x,x+2)(E14)',
                        row: 13,
                        column: 6,
                        sheetId: 'sheet-0003',
                    },
                },
                '19': {
                    '6': {
                        formula: '=SUM(G12:G19)',
                        row: 19,
                        column: 6,
                        sheetId: 'sheet-0003',
                    },
                },
            },
        },
    },
};

export const DEFAULT_FORMULA_DATA_DEMO1: IFormulaConfig = {
    formulaData: {
        'workbook-01': {
            'sheet-0003': {
                '11': {
                    '6': {
                        formula: '=E12*F12',
                        row: 11,
                        column: 6,
                        sheetId: 'sheet-0003',
                    },
                },
                '12': {
                    '6': {
                        formula: '=E13*F13',
                        row: 12,
                        column: 6,
                        sheetId: 'sheet-0003',
                    },
                },
                '13': {
                    '6': {
                        formula: '=LAMBDA(x,x+2)(E14)',
                        row: 13,
                        column: 6,
                        sheetId: 'sheet-0003',
                    },
                },
                '19': {
                    '6': {
                        formula: '=SUM(G12:G19)',
                        row: 19,
                        column: 6,
                        sheetId: 'sheet-0003',
                    },
                },
            },
        },
    },
};
