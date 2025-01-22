import type { PageContext } from "vike/types";
import { eq } from "drizzle-orm";
import { db } from "@lib/db/db";
import { posts } from "@lib/db/schema/posts";
import { render } from "vike/abort";

export async function data(pageContext: PageContext) {
  const { routeParams } = pageContext;
  const { slug } = routeParams;
  const post = await db.select().from(posts).where(eq(posts.slug, slug)).get();

  if (!post) throw render(404);

  return {
    post,
  };
}
