import type { Component } from 'svelte';
import { render } from 'svelte/server';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import type { PageContext, OnRenderHtmlAsync } from 'vike/types';
import './styles/main.css';

export async function onRenderHtml(
  pageContext: PageContext
): ReturnType<OnRenderHtmlAsync> {
  const { Page, data } = pageContext;
  const { head, body } = render(Page as Component, { props: data as {} });

  let template: string = `<!DOCTYPE html>
      <html>
        </head>
          <!--head-outlet-->
        <head>
        <body>
          <div id="app"><!--ssr-outlet--></div>
        </body>
      </html>
  `;

  template = template.replace('<!--head-outlet-->', head);
  template = template.replace('<!--ssr-outlet-->', body);

  return {
    documentHtml: escapeInject`${dangerouslySkipEscape(template)}`,
  };
}
