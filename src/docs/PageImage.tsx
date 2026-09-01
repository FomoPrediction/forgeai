import Image from "next/image";

/**
 * The painted plate at the head of a page.
 *
 * Gouache in the brand's palette, the same medium as the receipt artwork, so a
 * page of documentation and a minted receipt look like they came out of the
 * same studio.
 *
 * `next/image` rather than a bare tag: these are 1600px wide originals and the
 * column they sit in is about 700, so on Vercel this serves an AVIF a third of
 * the size and reserves the space before it arrives. A docs page that reflows
 * when its header loads is worse than one with no header.
 */
export function PageImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="not-prose mb-9 overflow-hidden rounded-xl border border-fd-border">
      <Image
        src={`/docs/${src}.jpg`}
        alt={alt}
        width={1600}
        height={686}
        // Above the fold on every page it appears on, so it is never lazy.
        priority
        sizes="(max-width: 768px) 100vw, 720px"
        className="block h-auto w-full"
      />
      {caption ? (
        <figcaption className="border-t border-fd-border bg-fd-card px-4 py-2.5 text-[12.5px] leading-snug text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
