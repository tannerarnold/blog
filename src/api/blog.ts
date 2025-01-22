import { posts, type Post } from "@lib/db/schema/posts.js";
import type { FastifyInstance } from "fastify";
import type { FastifyPluginCallback } from "fastify";

export const blog: FastifyPluginCallback = (
  fastify: FastifyInstance,
  opts,
  done
) => {
  fastify.post<{ Body: Omit<Post, "id" | "date_posted"> }>(
    "/",
    async (req, res) => {
      const { title, slug, content } = req.body;
      await fastify.db.insert(posts).values({
        date_posted: new Date(),
        title,
        slug,
        content,
      });
      return res.redirect(`/blog/${slug}`);
    }
  );

  done();
};
