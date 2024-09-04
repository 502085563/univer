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

import type { IMenu2Item } from '@univerjs/ui';
import { ContextMenuGroup, ContextMenuPosition, RibbonStartGroup } from '@univerjs/ui';
import { InsertHyperLinkToolbarOperation } from '../commands/operations/sidebar.operations';
import { insertLinkMenuFactory, insertLinkMenuToolbarFactory } from './menu';

export const menuSchema: IMenu2Item = {
    [RibbonStartGroup.OTHERS]: {
        [InsertHyperLinkToolbarOperation.id]: {
            order: 2,
            menuItemFactory: insertLinkMenuToolbarFactory,
        },
    },
    [ContextMenuPosition.MAIN_AREA]: {
        [ContextMenuGroup.OTHERS]: {
            order: 1,
            [InsertHyperLinkToolbarOperation.id]: {
                order: 0,
                menuItemFactory: insertLinkMenuFactory,
            },
        },
    },
};