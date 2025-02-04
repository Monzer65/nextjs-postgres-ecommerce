"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface Entity {
  id: string | number;
  name: string;
}

interface AutoCompleteProps<T extends Entity> {
  value?: string;
  onChangeAction: (value: T["id"]) => void;
  onCreate?: (name: string) => void;
  fetchSuggestionsAction: (query: string) => Promise<T[]>;
  placeholder?: string;
}

export default function Autocomplete<T extends Entity>({
  value = "",
  onChangeAction,
  onCreate,
  fetchSuggestionsAction,
  placeholder = "Search...",
}: AutoCompleteProps<T>) {
  const [query, setQuery] = useState(value);
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fetchSuggestionsActionCallback = useCallback(
    async (q: string) => {
      setIsLoading(true);
      try {
        const results = await fetchSuggestionsAction(q);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchSuggestionsAction],
  );

  useEffect(() => {
    if (debouncedQuery && isFocused) {
      fetchSuggestionsActionCallback(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, fetchSuggestionsActionCallback, isFocused]);

  const showCreateOption =
    onCreate &&
    debouncedQuery &&
    !suggestions.some(
      (s) => s.name.toLowerCase() === debouncedQuery.toLowerCase(),
    );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChangeAction(newValue);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        Math.min(prev + 1, suggestions.length + (showCreateOption ? 1 : 0) - 1),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelection(selectedIndex);
    }
  };

  const handleSelection = (index: number) => {
    if (showCreateOption && index === suggestions.length) {
      onCreate(query);
      setQuery("");
      onChangeAction("");
    } else {
      const selected = suggestions[index];
      setQuery(selected.name);
      onChangeAction(selected.id);
    }
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className="pr-10"
      />

      <Button
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-full"
        type="button"
      >
        <Search className="h-4 w-4" />
      </Button>

      {isFocused && (
        <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50">
          {isLoading ? (
            <div className="p-2 text-muted-foreground">Loading...</div>
          ) : (
            <>
              {suggestions.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-2 cursor-pointer hover:bg-muted ${index === selectedIndex ? "bg-muted" : ""
                    }`}
                  onMouseDown={() => handleSelection(index)}
                >
                  {item.name}
                </div>
              ))}
              {showCreateOption && (
                <div
                  className={`p-2 cursor-pointer hover:bg-muted flex items-center gap-2 text-primary ${selectedIndex === suggestions.length ? "bg-muted" : ""
                    }`}
                  onMouseDown={() => handleSelection(suggestions.length)}
                >
                  <Plus className="h-4 w-4" />
                  جدید بساز <span className="text-blue-500">"{query}"</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
