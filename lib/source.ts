import { loader, type Source } from "fumadocs-core/source";

import { docs } from "@/.source";

/**
 * The page tree, built from content/docs.
 *
 * `files` is invoked rather than handed over. fumadocs-mdx returns a lazy
 * `{ files: () => [...] }` while this line of fumadocs-core declares `files` as
 * the array itself, so passing the object straight through produced
 * "a.map is not a function" from several frames inside the tree builder with
 * nothing in the stack naming this file.
 *
 * The cast is the honest shape of that disagreement: the runtime value is a
 * function, the published type says it is not, and the two packages are a major
 * version apart on this one field.
 */
const mdx = docs.toFumadocsSource() as unknown as {
  files: () => Parameters<typeof loader>[0]["source"] extends Source<infer _>
    ? unknown[]
    : unknown[];
};

export const source = loader({
  baseUrl: "/docs",
  source: { files: mdx.files() } as never,
});
