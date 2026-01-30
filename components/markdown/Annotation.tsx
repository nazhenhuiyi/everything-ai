"use client"

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Annotation as AnnotationType } from '@/lib/docs'

interface AnnotationProps {
    annotation: AnnotationType
    children: React.ReactNode
}

export default function Annotation({ annotation, children }: AnnotationProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                    <span
                        onClick={() => setIsOpen(true)}
                        className="cursor-pointer border-b-2 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors rounded-sm px-0.5"
                    >
                        {children}
                    </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                    <div className="space-y-2 font-sans">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Knowledge Card</div>
                        <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                            {annotation.question}
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                            <ReactMarkdown>{annotation.answer}</ReactMarkdown>
                        </div>
                        <div className="text-[10px] text-zinc-400 pt-1">
                            Click to view full details
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>

            <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
                <SheetContent className="w-full sm:max-w-xl p-0 dark:border-zinc-800 border-zinc-200">
                    <ScrollArea className="h-full">
                        <div className="p-6">
                            <SheetHeader className="mb-6">
                                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Knowledge Card</div>
                                <SheetTitle className="text-2xl font-serif">{annotation.question}</SheetTitle>
                                {annotation.tags && (
                                    <SheetDescription>
                                        <div className="flex gap-2 pt-2">
                                            {annotation.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">#{tag}</span>
                                            ))}
                                        </div>
                                    </SheetDescription>
                                )}
                            </SheetHeader>

                            <div className="prose prose-zinc dark:prose-invert max-w-none
                                prose-headings:font-serif
                                prose-p:leading-7 prose-p:text-zinc-700 dark:prose-p:text-zinc-300
                                prose-li:text-zinc-700 dark:prose-li:text-zinc-300">
                                <ReactMarkdown>{annotation.answer}</ReactMarkdown>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </>
    )
}
