import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import type { MDXComponents } from "mdx/types";
import type { TableOfContents } from "fumadocs-core/server";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";

/**
 * What an MDX page carries.
 *
 * Stated here because `lib/source.ts` has to cast around a shape disagreement
 * between fumadocs-core and fumadocs-mdx, and a cast that wide takes the page
 * data's type with it. Naming the four fields this route actually reads gets
 * the checking back where it matters, at the point of use.
 */
type DocData = {
  title: string;
  description?: string;
  full?: boolean;
  toc: TableOfContents;
  body: (props: { components: MDXComponents }) => React.ReactElement;
};

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const data = page.data as unknown as DocData;
  const MDX = data.body;

  return (
    <DocsPage
      toc={data.toc}
      full={data.full}
      // The two controls a reader of a long page actually uses: where they are
      // in it, and how to get to the next one.
      tableOfContent={{ style: "clerk" }}
      footer={{ enabled: true }}
    >
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const data = page.data as unknown as DocData;
  return {
    title: `${data.title} · FORGE docs`,
    description: data.description,
  };
}
