"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Shadcn button component
import { SearchIcon } from "lucide-react"; // Shadcn-compatible icons
import { SearchModal } from "./search-modal";

export const SearchButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2"
            >
                <SearchIcon className="w-5 h-5" />
                <span>جستجو...</span>
            </Button>
            {isOpen && <SearchModal onClose={() => setIsOpen(false)} />}
        </>
    );
};
