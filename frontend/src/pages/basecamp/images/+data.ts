import type { ImageLocation } from '@type/images';
import type { DataAsync } from 'vike/types';

export const data: DataAsync = async (context) => {
  const { session_id, csrf_token } = context.cookies;
  const imageLocationResponse = await fetch(
    new URL('/images/', process.env.API_URL),
    {
      headers: {
        'X-CSRF-Token': csrf_token ?? '',
        'X-Session-Id': session_id ?? '',
      },
    },
  );
  const imageLocations =
    (await imageLocationResponse.json()) as ImageLocation[];
  return {
    imageLocations,
  };
};
