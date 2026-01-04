import type { Mention } from '@/types/tweet.type';

export type MentionTrigger = '@' | '#';

export const parseMentions = (text: string): Mention[] => {
  const mentions: Mention[] = [];

  // Match @mention or #hashtag patterns
  const pattern = /[@#]\w+/g;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const mentionText = match[0];
    mentions.push({
      type: mentionText[0] as MentionTrigger,
      value: mentionText.slice(1),
      start: match.index,
      end: match.index + mentionText.length,
    });
  }

  return mentions;
};

export const shouldOpenMentionDropdown = (
  text: string,
  cursorPos: number,
): { open: boolean; trigger: MentionTrigger | null } => {
  const charBeforeCursor = text[cursorPos - 1];
  const charBeforeThat = text[cursorPos - 2];

  const isTrigger = charBeforeCursor === '@' || charBeforeCursor === '#';
  const isWordBoundary =
    charBeforeThat === undefined ||
    charBeforeThat === ' ' ||
    charBeforeThat === '\n';

  if (isTrigger && isWordBoundary) {
    return { open: true, trigger: charBeforeCursor as MentionTrigger };
  }

  return { open: false, trigger: null };
};

export const getMentionQueryAtCursor = (
  text: string,
  trigger: MentionTrigger,
  cursorPos: number,
) => {
  const triggerIndex = text.lastIndexOf(trigger, cursorPos - 1);
  if (triggerIndex === -1) return '';
  return text.substring(triggerIndex + 1, cursorPos);
};

export const getTextareaCaretCoordinates = (
  textarea: HTMLTextAreaElement,
  text: string,
  caretIndex: number,
) => {
  // Measure caret position using a hidden mirror element (accurate for wrapping)
  const style = window.getComputedStyle(textarea);

  const mirror = document.createElement('div');
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  mirror.style.overflow = 'hidden';
  mirror.style.top = '0';
  mirror.style.left = '-9999px';

  // Copy text/box styles that affect layout
  mirror.style.boxSizing = style.boxSizing;
  mirror.style.width = style.width;
  mirror.style.padding = style.padding;
  mirror.style.border = style.border;
  mirror.style.fontFamily = style.fontFamily;
  mirror.style.fontSize = style.fontSize;
  mirror.style.fontWeight = style.fontWeight;
  mirror.style.fontStyle = style.fontStyle;
  mirror.style.letterSpacing = style.letterSpacing;
  mirror.style.textTransform = style.textTransform;
  mirror.style.lineHeight = style.lineHeight;
  mirror.style.textAlign = style.textAlign;
  mirror.style.tabSize =
    (style as unknown as { tabSize?: string }).tabSize ?? '';

  const before = document.createTextNode(text.slice(0, caretIndex));
  const marker = document.createElement('span');
  // marker must have some content to have dimensions
  marker.textContent = text.slice(caretIndex) || '.';

  mirror.appendChild(before);
  mirror.appendChild(marker);
  document.body.appendChild(mirror);

  const mirrorRect = mirror.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();
  const textareaRect = textarea.getBoundingClientRect();

  const lineHeightRaw = parseFloat(style.lineHeight);
  const fontSizeRaw = parseFloat(style.fontSize);
  const lineHeight = Number.isFinite(lineHeightRaw)
    ? lineHeightRaw
    : Number.isFinite(fontSizeRaw)
      ? fontSizeRaw * 1.2
      : 24;

  // Caret position relative to mirror box
  const caretLeft = markerRect.left - mirrorRect.left;
  const caretTop = markerRect.top - mirrorRect.top;

  document.body.removeChild(mirror);

  // Convert to viewport coords and place dropdown *below* caret.
  // Adjust for textarea scroll.
  const x = textareaRect.left + caretLeft - textarea.scrollLeft;
  const y = textareaRect.top + caretTop - textarea.scrollTop + lineHeight;

  return { x, y };
};
