import type { Post } from '@type/posts';
import type { User } from '@type/users';
import type { DataAsync } from 'vike/types';

export const data: DataAsync = async (context) => {
  const { slug } = context.routeParams;
  const postResponse = await fetch(
    new URL(`/posts/${slug}`, process.env.API_URL),
  );
  const post = (await postResponse.json()) as Post;
  const userResponse = await fetch(
    new URL(`/auth/${post.user_id}`, process.env.API_URL),
  );
  const user = (await userResponse.json()) as User;
  return {
    post: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      date_posted: new Date(post.date_posted),
      user: user.display_name,
    },
  };
};
