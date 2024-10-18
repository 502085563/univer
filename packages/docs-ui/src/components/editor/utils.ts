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

import type { IDocumentData } from '@univerjs/core';
import { DEFAULT_EMPTY_DOCUMENT_VALUE, DocumentFlavor } from '@univerjs/core';

/**
 *
 * @param value The initial value of the editor.
 * @returns snapshot generated by value.
 */
export function genSnapShotByValue(id = '', value = '') {
    const dataStream = `${value}${DEFAULT_EMPTY_DOCUMENT_VALUE}`;
    const paragraphs = [];
    const sectionBreaks = [];

    for (let i = 0; i < dataStream.length; i++) {
        if (dataStream[i] === '\r') {
            paragraphs.push({
                startIndex: i,
            });
        }

        if (dataStream[i] === '\n') {
            sectionBreaks.push({
                startIndex: i,
            });
        }
    }

    const snapshot: IDocumentData = {
        id,
        body: {
            dataStream,
            tables: [],
            textRuns: [],
            paragraphs,
            sectionBreaks,
        },
        tableSource: {},
        documentStyle: {
            documentFlavor: DocumentFlavor.UNSPECIFIED,
        },
    };

    return snapshot;
}