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

import DOMPurify from "dompurify";

export const HASHTAG_REGEX = /#[a-zA-Z0-9-]+/g;
export const MENTION_REGEX = /@[a-zA-Z0-9-]+/g;

export function flatten(str: string): string {
  return DOMPurify.sanitize(str || "", {
    ALLOWED_TAGS: ["#text"],
    KEEP_CONTENT: true,
    FORBID_TAGS: ["script", "style"],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
  });
}

export function extractHashtags(str: string): string[] {
  return Array.from(str.match(HASHTAG_REGEX) || []).map(hashtag =>
    hashtag.toLowerCase().replace("#", "")
  );
}

export function extractMentions(str: string): string[] {
  return Array.from(str.match(MENTION_REGEX) || []).map(mention =>
    mention.toLowerCase().replace("@", "")
  );
}
