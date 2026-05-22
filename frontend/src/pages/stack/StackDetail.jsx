import { Bookmark, Eye, Headphones, PenLine, Share2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStackById } from './stackData'
import axios from "axios"
import { useEffect, useState } from 'react'

function BookCover({ title, author, cover }) {
    return (
        <div className="relative h-[18rem] w-[13rem] overflow-hidden rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-lg)]">
            <div className="absolute inset-y-0 left-0 w-3 bg-[var(--color-text-primary)]/80" />
            <img
                src={cover}
                alt={`${title} cover`}
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pb-4 pt-10 text-white">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/70">
                    by {author}
                </p>
                <h2 className="mt-1 text-lg font-bold leading-tight">{title}</h2>
            </div>
        </div>
    )
}

export default function StackDetail() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [stack, setStack] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        axios.get(`${import.meta.env.VITE_API_URL}/api/stack/${id}`, {
            withCredentials: true
        })
            .then(response => {
                setStack(response.data.stackDetail)
            })
            .catch(error => {
                console.log("err in fetching stackDetail", error)
                setStack(getStackById(id))
            })
            .finally(() => {
                setLoading(false)
            })
    }, [id])

    if (loading) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--color-bg)] px-6 md:h-[100vh]">
                <div className="w-full max-w-md">
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--color-primary)]" />
                    </div>
                    <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
                        Loading stack...
                    </p>
                </div>
            </div>
        )
    }

    if (!stack) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)] px-6 py-10">
                <div className="w-full max-w-md rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-card)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                        Stack not found
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-[var(--color-text-primary)]">
                        No stack exists for id "{id}"
                    </h1>
                    <button
                        type="button"
                        onClick={() => navigate('/stack')}
                        className="mt-6 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-text-on-primary)] transition hover:bg-[var(--color-primary-hover)]"
                    >
                        Back to stack
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
                <header className="w-full max-w-xl text-center">
                    <div className="flex justify-center">
                        <BookCover
                            title={stack.title}
                            author={stack.creator}
                            cover={stack.coverImage}
                        />
                    </div>

                    <div className="mt-6 space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                            {stack.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
                            <PenLine className="h-4 w-4" />
                            <span>{stack.creator}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                        <button
                            type="button"
                            className="inline-flex items-center gap-3 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-text-on-primary)] shadow-[var(--shadow-primary)] transition hover:bg-[var(--color-primary-hover)]"
                        >
                            <span>Read</span>
                            <span className="h-4 w-px bg-white/30" />
                            <Headphones className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                <div className="mt-10 w-full max-w-xl flex flex-col gap-4">
                    {
                        (stack.cards ?? []).map(card => (
                            <article className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-md)] sm:p-8">
                                <header>
                                    <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                                        {card.head}
                                    </h2>
                                </header>

                                <section className="mt-5 space-y-5 font-serif text-[1rem] leading-7 text-[var(--color-text-primary)] sm:text-[1.05rem]">

                                    <p >
                                        {card.content}
                                    </p>

                                </section>

                                <footer className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--color-divider)] pt-5 text-[var(--color-text-muted)]">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <Eye className="h-5 w-5" />
                                        <span>{stack.views}</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            className="transition hover:text-[var(--color-text-primary)]"
                                            aria-label="Share stack"
                                        >
                                            <Share2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1.5 transition hover:text-[var(--color-text-primary)]"
                                            aria-label="Saved count"
                                        >
                                            <Bookmark className="h-5 w-5" />
                                            <span className="text-sm font-semibold">{stack.saves}</span>
                                        </button>
                                    </div>
                                </footer>
                            </article>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
