"use client";

import { SearchIcon, X } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchProps {
  placeholder: string;
  className?: string;
}

export default function Search({ placeholder, className }: SearchProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query")?.toString() || "",
  );

  // Initialize search term from URL on component mount
  useEffect(() => {
    setSearchTerm(searchParams.get("query")?.toString() || "");
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    //console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  const handleClear = () => {
    setSearchTerm("");
    handleSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          className="w-full pr-10 pl-10 transition-all focus-visible:ring-offset-2"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
          aria-label="Search"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
