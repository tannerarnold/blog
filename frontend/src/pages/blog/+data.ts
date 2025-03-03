import type { Post } from '@type/posts';

export async function data() {
  const postsResponse = await fetch(new URL('/posts/', process.env.API_URL));
  const posts = (await postsResponse.json()) as Post[];
  return {
    posts: posts.map((post) => {
      const { id, title, slug, summary, date_posted } = post;
      return {
        id,
        title,
        summary,
        date_posted: new Date(date_posted),
        href: `/blog/${slug}`,
      };
    }),
  };
}
