import type { ComponentProps } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4;

/** A heading whose level depends on where the block is placed (its own page or the home page). */
export function Heading({ level, ...props }: { level: HeadingLevel } & ComponentProps<"h2">) {
  const Tag = `h${level}` as const;
  return <Tag {...props} />;
}
