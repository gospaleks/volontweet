import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, ImageUploadIcon } from '@hugeicons/core-free-icons';

import type { Mention, TweetData } from '@/types/tweet.type';

import { Button } from '@/components/ui/button';

import {
  getMentionQueryAtCursor,
  getTextareaCaretCoordinates,
  parseMentions,
  shouldOpenMentionDropdown,
  type MentionTrigger,
} from './mentionUtils';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import MentionDropdown from './MentionDropdown';

const MAX_TWEET_LENGTH = 280;

type TweetEditorProps = {
  onSubmit: (data: TweetData) => Promise<void>;
  isPending: boolean;
  placeholder?: string;
};

const TweetEditor = ({
  onSubmit,
  placeholder = "What's happening?",
  isPending,
}: TweetEditorProps) => {
  const [content, setContent] = useState('');
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [selectedMentionUsernames, setSelectedMentionUsernames] = useState<
    string[]
  >([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionTrigger, setMentionTrigger] = useState<MentionTrigger | null>(
    null,
  );
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.currentTarget.value;
    const cursorPos = e.currentTarget.selectionStart;

    setContent(newContent);

    const openResult = shouldOpenMentionDropdown(newContent, cursorPos);

    if (openResult.open && openResult.trigger) {
      setMentionTrigger(openResult.trigger);
      setMentionQuery('');
      setShowMentionDropdown(true);
      setCursorPosition(
        getTextareaCaretCoordinates(e.currentTarget, newContent, cursorPos),
      );
    } else if (
      newContent[cursorPos - 1] === ' ' ||
      newContent[cursorPos - 1] === undefined
    ) {
      // Close dropdown if we hit space
      setShowMentionDropdown(false);
      setMentionTrigger(null);
    } else if (showMentionDropdown && mentionTrigger) {
      // Update query while dropdown is open
      setMentionQuery(
        getMentionQueryAtCursor(newContent, mentionTrigger, cursorPos),
      );
      setCursorPosition(
        getTextareaCaretCoordinates(e.currentTarget, newContent, cursorPos),
      );
    }

    // Parse mentions and hashtags
    const foundMentions = parseMentions(newContent);
    setMentions(foundMentions);

    // Keep only selected mentions that still exist in the text
    const usernamesInText = new Set(
      foundMentions.filter((m) => m.type === '@').map((m) => m.value),
    );
    setSelectedMentionUsernames((prev) =>
      prev.filter((username) => usernamesInText.has(username)),
    );
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectMention = (selectedValue: string) => {
    if (!textareaRef.current || !mentionTrigger) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const triggerIndex = content.lastIndexOf(mentionTrigger, cursorPos - 1);

    // Replace from trigger to cursor with selected mention
    const before = content.substring(0, triggerIndex);
    const after = content.substring(cursorPos);
    const newContent = `${before}${mentionTrigger}${selectedValue} ${after}`;

    setContent(newContent);
    setShowMentionDropdown(false);
    setMentionTrigger(null);
    setMentionQuery('');

    if (mentionTrigger === '@') {
      setSelectedMentionUsernames((prev) =>
        prev.includes(selectedValue) ? prev : [...prev, selectedValue],
      );
    }

    // Parse new mentions
    const foundMentions = parseMentions(newContent);
    setMentions(foundMentions);

    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos =
          triggerIndex + mentionTrigger.length + selectedValue.length + 1;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const filteredMentions = mentions.filter(
      (m) => m.type !== '@' || selectedMentionUsernames.includes(m.value),
    );

    const tweetData: TweetData = {
      raw: content,
      mentions: filteredMentions,
      image: selectedImage || undefined,
    };

    await onSubmit?.(tweetData);
    setContent('');
    setMentions([]);
    handleRemoveImage();
  };

  const isSubmitDisabled =
    !content.trim() || content.length > MAX_TWEET_LENGTH || isPending;

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <InputGroup>
        <InputGroupTextarea
          ref={textareaRef}
          value={content}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="min-h-16 resize-none text-base"
          maxLength={MAX_TWEET_LENGTH}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground text-xs">
            {content.length}/{MAX_TWEET_LENGTH}
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        hidden
      />

      {imagePreview && (
        <div className="relative w-fit">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-96 w-fit rounded-4xl object-cover"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Tooltip delay={400}>
          <TooltipTrigger
            render={
              <Button
                size="icon"
                variant="secondary"
                onClick={handleImageButtonClick}
                type="button"
              >
                <HugeiconsIcon icon={ImageUploadIcon} />
              </Button>
            }
          />
          <TooltipContent side="bottom">Upload image</TooltipContent>
        </Tooltip>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-20"
        >
          {isPending ? <Spinner /> : 'Post'}
        </Button>
      </div>

      {showMentionDropdown && mentionTrigger && (
        <MentionDropdown
          trigger={mentionTrigger}
          query={mentionQuery}
          onSelect={handleSelectMention}
          onClose={() => {
            setShowMentionDropdown(false);
            setMentionTrigger(null);
          }}
          position={cursorPosition}
        />
      )}
    </div>
  );
};

export default TweetEditor;
