"use client"

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface CustomDropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  width?: number
}

export function CustomDropdown({ 
  trigger, 
  children, 
  align = 'end', 
  side = 'bottom',
  className = '',
  width = 320
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const calculatePosition = () => {
    if (!triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    let top = triggerRect.bottom + scrollY + 8
    let left = triggerRect.left + scrollX

    // Ajuste para alinhamento
    if (align === 'end') {
      left = triggerRect.right + scrollX - width // usar largura passada como prop
    } else if (align === 'center') {
      left = triggerRect.left + scrollX + (triggerRect.width / 2) - (width / 2)
    }

    // Ajuste para lado
    if (side === 'top') {
      top = triggerRect.top + scrollY - 8
    }

    setPosition({ top, left })
  }

  useEffect(() => {
    if (isOpen) {
      calculatePosition()
      
      const handleResize = () => calculatePosition()
      const handleScroll = () => calculatePosition()
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current && 
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const content = isOpen ? (
    <div
      ref={contentRef}
      className={`fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-lg ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: '200px'
      }}
    >
      {children}
    </div>
  ) : null

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      {typeof window !== 'undefined' && content && createPortal(content, document.body)}
    </>
  )
}

export function CustomDropdownItem({ 
  children, 
  onClick, 
  className = '' 
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string 
}) {
  return (
    <div 
      className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CustomDropdownSeparator() {
  return <div className="border-t border-gray-200 my-1" />
}
