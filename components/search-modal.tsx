'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Search, ArrowUp, ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'

interface SearchModalProps {
    onClose: () => void
}

interface SearchResult {
    id: string
    name: string
    category: string
    image: string
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const { replace, push } = useRouter();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = useDebouncedCallback((term: string) => {
        setIsLoading(true)
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 500)

    useEffect(() => {
        const query = searchParams.get('query')
        if (query) {
            fetch(`/api/search?q=${query}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data.slice(0, 5)) // Limit results to top 5
                    setIsLoading(false)
                })
                .catch(() => {
                    setIsLoading(false)
                })
        } else {
            setResults([])
            setIsLoading(false)
        }
    }, [searchParams])

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const query = searchParams.get('query');

        if (e.key === 'ArrowDown') {
            setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0) {
                push(`/product/${results[selectedIndex].id}`)
            } else if (query) {
                push(`/search?query=${query}`)
            }
        }
    }, [results, selectedIndex, searchParams, push])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])



    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <div className="space-y-4">
                    <DialogTitle className='sr-only'>دیالوگ جستجو</DialogTitle>
                    <DialogDescription className='sr-only'>در این دیالوگ می‌توانید به جستجوی محصولات و دسته‌بندی‌ها بپردازید</DialogDescription>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            <Input
                                ref={inputRef}
                                placeholder="جستجوی محصول..."
                                onChange={(e) => handleSearch(e.target.value)}
                                defaultValue={searchParams.get('query')?.toString()}
                                className="pr-9 text-right"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="text-center py-4 text-muted-foreground">در حال جستجو...</div>
                        ) : results.length > 0 ? (
                            results.map((item, index) => (
                                <Card
                                    key={item.id}
                                    className={`p-3 flex items-center space-x-3 rtl:space-x-reverse transition-colors ${index === selectedIndex ? 'bg-primary/10' : ''
                                        }`}
                                >
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/product/${item.id}`} className="font-medium block truncate">
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-muted-foreground truncate">{item.category}</p>
                                    </div>
                                    {index === selectedIndex && (
                                        <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-muted-foreground">
                                            <span>Enter</span>
                                            <ArrowUp className="h-3 w-3" />
                                            <ArrowDown className="h-3 w-3" />
                                        </div>
                                    )}
                                </Card>
                            ))
                        ) : (
                            searchParams.get('query') && (
                                <div className="text-center py-4 text-muted-foreground">نتیجه‌ای یافت نشد.</div>
                            )
                        )}
                    </div>
                    {searchParams.get('query') && (
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => push(`/search?query=${searchParams.get('query')}`)}
                                className="btn btn-primary"
                            >
                                مشاهده همه نتایج
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}


