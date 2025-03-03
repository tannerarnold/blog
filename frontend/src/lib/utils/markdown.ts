import js from '@shikijs/langs/javascript';
import yaml from '@shikijs/langs/yaml';
import bash from '@shikijs/langs/bash';
import json from '@shikijs/langs/json';
import onelight from '@shikijs/themes/one-light';
import onedark from '@shikijs/themes/one-dark-pro';
import { marked, type Tokens } from 'marked';
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki';

const shiki = createHighlighterCoreSync({
  langs: [js, yaml, bash, json],
  themes: [onelight, onedark],
  engine: createJavaScriptRegexEngine(),
});

const codeRenderer = {
  code(token: Tokens.Code) {
    const html = shiki.codeToHtml(token.text, {
      lang: token.lang ?? 'plain',
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
      theme: 'dark',
    });
    return `<div class="code-block">
        ${html}
    </div>`;
  },
};

const renderer = marked.use({ renderer: codeRenderer });
function renderMarkdown(content: string): string {
  const parsedContent = content
    .replaceAll('\r', '')
    .replaceAll('\n\n', '\n')
    .replaceAll('\n---', '\n\n---');
  return renderer.parse(parsedContent, { breaks: true }) as string;
}

export default renderMarkdown;
