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
  const [position, setPosition] = useState({ top: -9999, left: -9999 }) // Posição inicial fora da tela
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const calculatePosition = () => {
    if (!triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    
    // Use viewport-relative positioning with fixed positioning
    let top = triggerRect.bottom + 8
    let left = triggerRect.left

    // Ajuste para alinhamento
    if (align === 'end') {
      left = triggerRect.right - width
    } else if (align === 'center') {
      left = triggerRect.left + (triggerRect.width / 2) - (width / 2)
    }

    // Verificar se o dropdown sai da tela à direita
    const viewportWidth = window.innerWidth
    if (left + width > viewportWidth) {
      left = viewportWidth - width - 16
    }

    // Verificar se o dropdown sai da tela à esquerda
    if (left < 16) {
      left = 16
    }

    // Ajuste para lado e verificar se sai da tela na parte inferior
    const viewportHeight = window.innerHeight
    if (side === 'top' || (side === 'bottom' && top + 200 > viewportHeight)) {
      top = triggerRect.top - 8
    }

    setPosition({ top, left })
  }

  useEffect(() => {
    if (isOpen) {
      // Usar requestAnimationFrame para garantir que a posição seja calculada na próxima frame
      const frame = requestAnimationFrame(() => {
        calculatePosition()
      })
      
      const handleResize = () => calculatePosition()
      const handleScroll = () => calculatePosition()
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, true)
      
      return () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [isOpen, width, align, side])

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
      className={`fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-lg transition-none ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${width}px`,
        opacity: position.top === -9999 ? 0 : 1 // Esconder até a posição ser calculada
      }}
    >
      {children}
    </div>
  ) : null

  const handleToggle = () => {
    if (!isOpen) {
      // Calcular posição ANTES de abrir o dropdown
      calculatePosition()
    }
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
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
