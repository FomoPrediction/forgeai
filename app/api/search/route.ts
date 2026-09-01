import { createFromSource } from "fumadocs-core/search/server";

import { source } from "@/lib/source";

/**
 * Documentation search.
 *
 * Fumadocs ships the Ctrl+K dialog with its layout; the index is served from
 * here. Without this route the box opens, accepts typing and returns nothing.
 *
 * The default server handler, not `staticGET`. The static variant returns a
 * prebuilt index that the client has to be told to expect, and pairing it with
 * a default-configured provider threw `items.map is not a function` on every
 * docs page: the dialog was handed a document it could not read.
 */
export const { GET } = createFromSource(source, { language: "english" });
