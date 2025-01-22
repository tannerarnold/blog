import { hydrate, type Component } from 'svelte';
import type { OnRenderClientSync, PageContext } from 'vike/types';

export function onRenderClient(
  pageContext: PageContext<{} | undefined>
): ReturnType<OnRenderClientSync> {
  const { Page, data, abortReason, abortStatusCode } = pageContext;
  const appElement = document.getElementById('app');

  if (!Page) console.error("We don't have a page. That's not good. :(");
  if (!appElement)
    throw new Error('Technically this should not happen, but just to be safe.');

  hydrate(Page as Component, {
    target: appElement,
    props: { abortStatusCode, abortReason, ...data },
  });
}
