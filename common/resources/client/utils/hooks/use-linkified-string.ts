import {useMemo} from 'react';
import linkifyStr from 'linkify-string';
import linkifyHtml from 'linkify-html';

export function useLinkifiedString(text: string | null | undefined) {
  return useMemo(() => {
    if (!text) {
      return text;
    }
    return linkifyHtml(text, {
      nl2br: true,
      attributes: {rel: 'nofollow'},
    });
  }, [text]);
}
