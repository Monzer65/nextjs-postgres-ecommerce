"use client"

import { Button } from "@/components/ui/button"
import { useSearchModal } from "@/hooks/search-modal-context"
import { Search } from "lucide-react"

export const SearchButton = () => {
    const { openModal } = useSearchModal()

    return (
        <Button
            variant="outline"
            onClick={openModal}
            className="flex items-center gap-2 h-10 px-4 border-muted-foreground/20 hover:bg-accent"
        >
            <Search className="w-4 h-4" />
            <span>جستجو...</span>
        </Button>
    )
}


