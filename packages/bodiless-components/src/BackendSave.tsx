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

import axios from 'axios';

const source = axios.CancelToken.source();

export default class BackendSave {
  private root: string;

  private prefix: string;

  constructor(baseUrl?: string, prefix?: string) {
    let host = 'http://localhost:8005';
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      const loc = window.location;
      host = `${loc.protocol}//${loc.hostname}:${loc.port}`;
    }
    this.root = baseUrl || process.env.BODILESS_BACKEND_URL || host;
    this.prefix = prefix || process.env.BODILESS_BACKEND_PREFIX || '/___backend';
  }

  post(resourcePath: string, data: any, config: any) {
    return axios.post(this.root + resourcePath, data, config);
  }

  saveFile(file: string) {
    // eslint-disable-next-line no-undef
    const payload = new FormData();
    payload.append('file', file);

    return this.post(`${this.prefix}/asset/`, payload, {
      cancelToken: source.token,
    });
  }

  static cancel(reason: string) {
    source.cancel(reason);
  }
}
