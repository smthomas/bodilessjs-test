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

import { flow } from 'lodash';
import { asEditableList } from '@bodiless/components';
import asMenu from './asMenu';
import withEditableTitle from './withEditableTitle';
import AsEditable from './types/AsEditable';

/**
 * HOC, produces *editable* menu
 */
const asEditableMenu = (editable: AsEditable) => flow(
  asEditableList,
  asMenu,
  withEditableTitle(editable),
);

export default asEditableMenu;
