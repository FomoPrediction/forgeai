import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { AllocationChart } from "@/src/docs/AllocationChart";
import { Flow, Loop, Side, Split, Stats } from "@/src/docs/Diagram";
import { PageImage } from "@/src/docs/PageImage";
import { UnlockChart } from "@/src/docs/UnlockChart";

/**
 * What MDX can reach for.
 *
 * Fumadocs' defaults cover the prose furniture: headings with anchors, tables,
 * code blocks, links. The structural components are separate modules and are
 * not in that default set, so each one a page uses has to be named here or the
 * build fails at prerender with "Expected component `Step` to be defined".
 *
 * The two charts are added on the same footing, so a page writes
 * `<AllocationChart />` in the middle of a sentence rather than importing React
 * into content.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Callout,
    Card,
    Cards,
    Step,
    Steps,
    Tab,
    Tabs,
    AllocationChart,
    UnlockChart,
    Flow,
    PageImage,
    Loop,
    Split,
    Side,
    Stats,
    ...components,
  };
}
