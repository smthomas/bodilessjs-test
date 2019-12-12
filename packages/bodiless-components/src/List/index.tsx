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

import React, {
  Fragment,
  ComponentType,
} from 'react';
import { observer } from 'mobx-react-lite';
import { withNode, WithNodeProps, withoutProps } from '@bodiless/core';
import { applyDesign } from '@bodiless/fclasses';
import { useItemsMutators, useItemsAccessors } from './model';
import { Props } from './types';

const NodeProvider = withNode(Fragment);

const getComponents = applyDesign({
  Wrapper: 'ul',
  Item: 'li',
  // For title we have to strip the props if not wrapped.
  Title: withoutProps(['onAdd', 'onDelete', 'canDelete'])(Fragment),
});

function List$({ design, unwrap, ...rest }: Props) {
  const components = getComponents(design);
  const {
    Wrapper,
    Item,
    Title,
  } = components;

  const { addItem, deleteItem } = useItemsMutators({ unwrap });
  const { getItems } = useItemsAccessors();
  const itemData = getItems();
  const canDelete = () => Boolean(getItems().length > 1 || unwrap);

  // Iterate over all items in the list creating list items.
  const items = itemData.map(item => (
    <NodeProvider key={item} nodeKey={item}>
      <Item>
        <Title
          onAdd={() => addItem(item)}
          onDelete={() => deleteItem(item)}
          canDelete={canDelete}
        />
      </Item>
    </NodeProvider>
  ));
  return (
    <Wrapper {...rest}>
      {items}
    </Wrapper>
  );
}

/**
 * A List component.
 */
const List = withNode(observer(List$)) as ComponentType<Props & WithNodeProps>;
List.displayName = 'List';

export default List;
