"use client";

import { useEffect } from "react";
import { updateViewCount } from "@/lib/updateViewCount";

export function UpdateViewCount({ slug }: { slug: string }) {
  useEffect(() => {
    if (slug) {
      updateViewCount(slug);
    }
  }, [slug]);

  return null;
}
