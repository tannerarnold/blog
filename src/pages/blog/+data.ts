import { db } from "@lib/db/db";
import { posts } from "@lib/db/schema/posts";
import type { PageContext } from "vike/types";

export async function data(pageContext: PageContext) {
  const postsFromDb = await db
    .select({
      id: posts.id,
      title: posts.title,
      datePosted: posts.date_posted,
      slug: posts.slug,
    })
    .from(posts)
    .all();

  return {
    posts: postsFromDb.map(({ id, title, slug, datePosted }) => {
      return { id, title, datePosted, href: `/blog/${slug}` };
    }),
  };
}
