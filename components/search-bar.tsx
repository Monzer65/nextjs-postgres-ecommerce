"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
import { SearchIcon } from "lucide-react";

export default function SearchBar({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
        console.log(`Searching... ${term}`);

        const params = new URLSearchParams(searchParams);

        params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="mt-4 flex flex-col space-y-4">
            <div className="relative flex items-center space-x-2 rtl:space-x-reverse">
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <Input
                    placeholder={placeholder}
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                    defaultValue={searchParams.get('query')?.toString()}
                    className="flex-1 peer pr-10 text-sm placeholder:text-gray-500"
                />
                <SearchIcon className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
        </div>
    );
};
