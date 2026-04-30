import type { ReactNode } from "react";

import { MDXRemote } from "next-mdx-remote/rsc";

import { slugifyText } from "@/lib/display";

function flattenText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return flattenText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

export async function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-card">
      <MDXRemote
        source={source}
        components={{
          h2: ({ children }) => {
            const id = slugifyText(flattenText(children));
            return <h2 id={id}>{children}</h2>;
          },
          h3: ({ children }) => {
            const id = slugifyText(flattenText(children));
            return <h3 id={id}>{children}</h3>;
          },
        }}
      />
    </div>
  );
}
