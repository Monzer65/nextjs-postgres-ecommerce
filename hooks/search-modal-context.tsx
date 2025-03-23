"use client"

import { SearchModal } from "@/components/search-modal"
import type React from "react"
import { createContext, useContext, useState } from "react"

interface SearchModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const SearchModalContext = createContext<SearchModalContextType>({
  isOpen: false,
  openModal: () => { },
  closeModal: () => { },
})

export const useSearchModal = () => useContext(SearchModalContext)

export const SearchModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <SearchModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && <SearchModal />}
    </SearchModalContext.Provider>
  )
}


