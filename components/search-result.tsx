import React, { FC } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface SearchResultProps {
    results: { id: string; name: string; category: string; image: string }[];
}

export const SearchResult: FC<SearchResultProps> = ({ results }) => (
    <div className="mt-4 space-y-2">
        {results.map((item) => (
            <Card key={item.id} className="p-4 flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded" />
                <div className="flex-1">
                    <Link href={`/product/${item.id}`} className="font-medium">
                        {item.name}
                    </Link>
                    <p className="text-sm text-muted">{item.category}</p>
                </div>
            </Card>
        ))}
    </div>
);
