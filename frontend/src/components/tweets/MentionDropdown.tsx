import { useMemo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { AuthUser } from '@/stores/auth.store';

import { useHandleClickOutside } from '@/hooks/useHandleClickOutside';
import { useDebounce } from '@/hooks/useDebounce';

import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
} from '@/components/ui/command';
import { Spinner } from '@/components/ui/spinner';

type Hashtag = {
  tag: string;
  count: number;
};

type MentionDropdownProps = {
  trigger: '@' | '#';
  query: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
};

const MentionDropdown = ({
  trigger,
  query,
  onSelect,
  onClose,
  position,
}: MentionDropdownProps) => {
  const [activeValue, setActiveValue] = useState('');
  const containerRef = useHandleClickOutside(onClose);
  const itemRefsByValue = useRef<Record<string, HTMLDivElement | null>>({});
  const debouncedQuery = useDebounce(query);

  // Fetch hashtags suggestions
  const { data: hashtagsSuggestions, isFetching: isFetchingHashtags } =
    useQuery<Hashtag[]>({
      queryKey: [
        API_ENDPOINTS.TRENDING_HASHTAGS,
        {
          q: debouncedQuery.length > 0 ? debouncedQuery : undefined,
        },
      ],
      enabled: trigger === '#',
      placeholderData: keepPreviousData,
    });

  // Fetch user suggestions
  const { data: userSuggestions, isFetching: isFetchingUsers } = useQuery<
    AuthUser[]
  >({
    queryKey: [API_ENDPOINTS.USER_SUGGESTIONS, { q: debouncedQuery }],
    enabled: trigger === '@' && debouncedQuery.length > 0,
    placeholderData: keepPreviousData,
  });

  // Filter data based on query
  const filteredItems = useMemo(() => {
    if (trigger === '@') {
      return (userSuggestions ?? []).slice(0, 8);
    } else {
      return (hashtagsSuggestions ?? []).slice(0, 8);
    }
  }, [trigger, hashtagsSuggestions, userSuggestions]);

  const values = useMemo(() => {
    if (trigger === '@') {
      return (filteredItems as AuthUser[]).map((u) => u.username);
    }
    return (filteredItems as Hashtag[]).map((t) => t.tag);
  }, [filteredItems, trigger]);

  const effectiveValue = values.includes(activeValue)
    ? activeValue
    : (values[0] ?? '');

  useEffect(() => {
    const options: AddEventListenerOptions = { capture: true };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key !== 'ArrowDown' &&
        e.key !== 'ArrowUp' &&
        e.key !== 'Enter' &&
        e.key !== 'Escape'
      ) {
        return;
      }

      if (values.length === 0) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (effectiveValue) onSelect(effectiveValue);
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = Math.max(0, values.indexOf(effectiveValue));
        const nextIndex =
          e.key === 'ArrowDown'
            ? Math.min(values.length - 1, currentIndex + 1)
            : Math.max(0, currentIndex - 1);
        setActiveValue(values[nextIndex] ?? '');
      }
    };

    window.addEventListener('keydown', handleKeyDown, options);
    return () => window.removeEventListener('keydown', handleKeyDown, options);
  }, [effectiveValue, onClose, onSelect, values]);

  useLayoutEffect(() => {
    // Keep the controlled selection visible.
    if (!effectiveValue) return;
    const el = itemRefsByValue.current[effectiveValue];
    if (!el) return;
    el.scrollIntoView({ block: 'nearest' });
  }, [effectiveValue, filteredItems.length]);

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-50"
      style={{
        top: `${position.y}px`,
        left: `${Math.max(0, position.x)}px`,
      }}
    >
      <div>
        <Command
          className="w-64 border shadow"
          value={effectiveValue}
          onValueChange={setActiveValue}
        >
          <CommandList className="max-h-75">
            {trigger === '@' ? (
              <CommandGroup
                heading={
                  <div className="flex items-center justify-between gap-2">
                    <span>Users</span>
                    {isFetchingUsers && <Spinner />}
                  </div>
                }
              >
                {filteredItems.map((item) => {
                  const user = item as AuthUser;
                  return (
                    <CommandItem
                      key={user.id}
                      value={user.username}
                      className="cursor-pointer"
                      ref={(el) => {
                        itemRefsByValue.current[user.username] = el;
                      }}
                      onSelect={() => onSelect(user.username)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold">
                          @{user.username}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : (
              <CommandGroup
                heading={
                  <div className="flex items-center justify-between gap-2">
                    <span>Hashtags</span>
                    {isFetchingHashtags && <Spinner />}
                  </div>
                }
              >
                {filteredItems.map((item) => {
                  const tag = item as Hashtag;
                  return (
                    <CommandItem
                      key={tag.tag}
                      value={tag.tag}
                      className="cursor-pointer"
                      ref={(el) => {
                        itemRefsByValue.current[tag.tag] = el;
                      }}
                      onSelect={() => onSelect(tag.tag)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold">
                          #{tag.tag}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {tag.count} posts
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default MentionDropdown;
