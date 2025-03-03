import { isAuthenticated } from '@lib/utils/auth';
import type { Image } from '@type/images';
import type { FastifyPluginCallback } from 'fastify';

const imagesPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.get<{ Params: { fileName: string } }>(
    '/:fileName',
    async (req, res) => {
      const { fileName } = req.params;
      const fileResponse = await fetch(
        new URL(`/images/${fileName}`, process.env.API_URL),
      );
      if (!fileResponse.ok) return res.code(fileResponse.status).send();
      const image: Image = (await fileResponse.json()) as Image;
      const buffer = Buffer.from(image.data, 'base64');
      return res.code(200).send(buffer);
    },
  );
  fastify.post('/', async (req, res) => {
    const { session_id, csrf_token } = req.cookies;
    if (!(await isAuthenticated(session_id, csrf_token))) {
      return res.code(403).send('Forbidden');
    }

    const file = await req.file();
    if (!file) return res.code(400).send('No file attached');
    const buffer = await file.toBuffer();
    const fileUploadResponse = await fetch(
      new URL('/images/', process.env.API_URL),
      {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrf_token ?? '',
          'X-Session-Id': session_id ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_name: file?.filename,
          mime_type: file?.mimetype,
          data: buffer.toString('base64'),
        }),
      },
    );
    const fileLocation = await fileUploadResponse.json();
    return res.code(200).send(fileLocation);
  });
  done();
};

export default imagesPlugin;
