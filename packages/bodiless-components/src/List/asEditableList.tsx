/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ComponentType, PropsWithChildren } from 'react';
import { DesignElement } from '@bodiless/fclasses';
import {
  withMenuOptions, useEditContext, withLocalContextMenu, withContextActivator, withoutProps,
} from '@bodiless/core';
import { flow, identity } from 'lodash';

import { TitleProps, FinalProps, Design } from './types';

const useGetMenuOptions = (props: TitleProps) => {
  const {
    onAdd, onDelete, canDelete,
  } = props;
  const context = useEditContext();

  const asHandler = (action: Function) => () => {
    action();
    context.refresh();
  };

  return () => {
    const options = [];
    options.push({
      name: 'Add',
      icon: 'add',
      handler: asHandler(onAdd),
      isActive: () => true,
      global: false,
      local: true,
    });
    // TODO: Disable rather than hide this button when delete is not allowed.
    if (canDelete()) {
      options.push({
        name: 'Remove',
        icon: 'delete',
        handler: asHandler(onDelete),
        isActive: () => true,
        global: false,
        local: true,
      });
    }
    return options;
  };
};

type EditableDesign = Design & {
  ItemMenuOptionsProvider: DesignElement<PropsWithChildren<{}>>,
}

// TODO: Maybe generalize this as an "alterDesign()" method.
const asEditableList = (List: ComponentType<FinalProps>) => (
  ({ design, ...rest }: FinalProps) => {
    const { isEdit } = useEditContext();
    if (!isEdit) return <List design={design} {...rest} />;
    const { Title, ItemMenuOptionsProvider } = (design || {}) as EditableDesign;
    const newDesign = {
      ...(design || {}),
      Title: flow(
        Title || identity,
        withContextActivator('onClick'),
        withLocalContextMenu,
        withoutProps(['onAdd', 'onDelete', 'canDelete']),
        ItemMenuOptionsProvider || identity,
        withMenuOptions({ useGetMenuOptions, name: 'list-item' }),
      ),
    };
    return <List design={newDesign} {...rest} />;
  }
);

export default asEditableList;
