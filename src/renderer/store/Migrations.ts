/*
Copyright 2020, Staffbase GmbH and contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { extractHashtags, extractMentions } from "../utils";
import { StoreState } from "./Types";
import Conf from "conf";

const Migrations = {
  "1.0.0": (store: Conf<{ state: StoreState }>) => {
    const state = store.get("state");

    for (const id in state.data) {
      state.data[id] = {
        ...state.data[id],
        hashtags: extractHashtags(state.data[id].label),
        mentions: extractMentions(state.data[id].label),
      };
    }

    store.set("state", state);
  },
};

export default Migrations;
