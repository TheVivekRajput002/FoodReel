import { useMemo, useState } from 'react'
import { BookOpenText, Bookmark, Eye, Headphones, ImagePlus, PenLine, Plus, Share2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { useToast } from '../../context/ToastContext'

const DEFAULT_COVER =
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80'

const EMPTY_CARD = {
    insightTitle: '',
    insightOne: '',
}

const INITIAL_FORM = {
    title: '',
    author: '',
    cover: DEFAULT_COVER,
    cards: [{ ...EMPTY_CARD }],
}

function BookCover({ cover }) {
    return (
        <div className="relative h-[18rem] w-[13rem] overflow-hidden rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-lg)]">
            <div className="absolute inset-y-0 left-0 w-3 bg-[var(--color-text-primary)]/80" />
            <img
                src={cover}
                alt={`cover`}
                className="h-full w-full object-cover"
            />
        </div>
    )
}

function FormField({ label, children, hint }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
                {label}
            </span>
            {children}
            {hint ? (
                <span className="mt-2 block text-xs text-[var(--color-text-secondary)]">
                    {hint}
                </span>
            ) : null}
        </label>
    )
}

function formatPreviewParagraph(content) {
    if (!content) {
        return null
    }

    const firstSentenceEnd = content.indexOf('. ')

    if (firstSentenceEnd === -1) {
        return content
    }

    const firstSentence = content.slice(0, firstSentenceEnd + 1)
    const rest = content.slice(firstSentenceEnd + 2)

    return (
        <>
            <strong className="font-semibold">{firstSentence}</strong>
            {rest ? ` ${rest}` : null}
        </>
    )
}

function StackDetailPreview({ stack }) {
    return (
        <div className="flex w-full flex-col items-center px-4 py-8 text-[var(--color-text-primary)] sm:px-6 sm:py-10">
            <header className="w-full max-w-xl text-center">
                <div className="flex justify-center">
                    <BookCover
                        cover={stack.cover}
                    />
                </div>

                <div className="mt-6 space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        {stack.title}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <PenLine className="h-4 w-4" />
                        <span>{stack.author}</span>
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

            <div className="mt-10 w-full max-w-xl space-y-6">
                {stack.cards.map((card, index) => (
                    <article
                        key={`preview-card-${index}`}
                        className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-md)] sm:p-8"
                    >
                        <header>
                            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                                {card.insightTitle}
                            </h2>
                        </header>

                        <section className="mt-5 space-y-5 font-serif text-[1rem] leading-7 text-[var(--color-text-primary)] sm:text-[1.05rem]">
                            <p>{formatPreviewParagraph(card.content)}</p>
                        </section>

                        <footer className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--color-divider)] pt-5 text-[var(--color-text-muted)]">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Eye className="h-5 w-5" />
                                <span>Preview</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    className="transition hover:text-[var(--color-text-primary)]"
                                    aria-label="Share stack preview"
                                >
                                    <Share2 className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 transition hover:text-[var(--color-text-primary)]"
                                    aria-label="Saved count preview"
                                >
                                    <Bookmark className="h-5 w-5" />
                                    <span className="text-sm font-semibold">Draft</span>
                                </button>
                            </div>
                        </footer>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default function StackCreate() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const isCreator = localStorage.getItem('scs_role') === 'creator'
    const [form, setForm] = useState(INITIAL_FORM)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const payload = {
            title: form.title,
            author: form.author,
            cover: form.cover,
            cards: form.cards.map((card) => ({
                head: card.insightTitle,
                content: card.insightOne,
            })),
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/stack/create`, payload, {
                withCredentials: true,
            })

            setForm({
                ...INITIAL_FORM,
                cards: [{ ...EMPTY_CARD }],
            })
            showToast('Stack created successfully.', 'success')
        } catch (error) {
            console.log("error in sending stack data", error)
            showToast('Unable to create stack right now.', 'error')
        }
    }

    const preview = useMemo(() => {
        const title = form.title.trim() || 'Your next stack title'
        const author = form.author.trim() || 'Your name'
        const cover = form.cover.trim() || DEFAULT_COVER

        const cards = form.cards.map((card, index) => {
            const insightTitle = card.insightTitle.trim() || `Insight ${index + 1}`
            const content = card.insightOne.trim()

            return {
                insightTitle,
                content: content || 'Start by capturing the main lesson readers should remember after opening this stack.',
            }
        })

        return { title, author, cover, cards }
    }, [form])

    if (!isCreator) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)] px-6 py-10">
                <div className="w-full max-w-md rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-card)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                        Creator access only
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-[var(--color-text-primary)]">
                        Stack creation is available for creator accounts.
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

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({
            ...current,
            [name]: value,
        }))
    }

    const handleCardChange = (index, field, value) => {
        setForm((current) => ({
            ...current,
            cards: current.cards.map((card, cardIndex) =>
                cardIndex === index ? { ...card, [field]: value } : card
            ),
        }))
    }

    const addCard = () => {
        setForm((current) => ({
            ...current,
            cards: [...current.cards, { ...EMPTY_CARD }],
        }))
    }

    const removeCard = (index) => {
        setForm((current) => ({
            ...current,
            cards: current.cards.filter((_, cardIndex) => cardIndex !== index),
        }))
    }

    return (
        <div className="min-h-[100dvh] bg-[var(--color-bg)] px-4 py-4 text-[var(--color-text-primary)] md:px-6 md:py-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-5 ml-2 space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                        Creator Studio
                    </p>
                    <h1 className="text-[26px] font-semibold tracking-[-0.02em] md:text-[32px]">
                        Create Stack
                    </h1>
                    <p className="max-w-2xl text-sm text-[var(--color-text-secondary)]">
                        Build the book cover, headline, and insight blocks together. The live preview mirrors the current stack detail presentation.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                    <section className="overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-card)] lg:sticky lg:top-6">
                        <div className="border-b border-[var(--color-divider)] px-5 py-4 sm:px-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                                Stack Preview
                            </p>
                        </div>
                        <StackDetailPreview stack={preview} />
                    </section>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)] sm:p-6 lg:min-h-[calc(100dvh-5rem)]"
                    >
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                            <BookOpenText className="h-4 w-4" />
                            <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                                Stack Details
                            </p>
                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <FormField label="Book title">
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Atomic Habits"
                                    className="w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-input-focus)] focus:ring-4 focus:ring-[var(--color-focus-ring)]"
                                    required
                                />
                            </FormField>

                            <FormField label="Author">
                                <input
                                    type="text"
                                    name="author"
                                    value={form.author}
                                    onChange={handleChange}
                                    placeholder="James Clear"
                                    className="w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-input-focus)] focus:ring-4 focus:ring-[var(--color-focus-ring)]"
                                    required
                                />
                            </FormField>
                        </div>

                        <div className="mt-5">
                            <FormField
                                label="Cover image URL"
                                hint="Paste a book cover image link to update the preview instantly."
                            >
                                <div className="relative">
                                    <ImagePlus className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                    <input
                                        type="url"
                                        name="cover"
                                        value={form.cover}
                                        onChange={handleChange}
                                        placeholder="https://example.com/book-cover.jpg"
                                        className="w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--color-input-focus)] focus:ring-4 focus:ring-[var(--color-focus-ring)]"
                                    />
                                </div>
                            </FormField>
                        </div>

                        <div className="mt-8 space-y-5">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                                    Insight Cards
                                </p>
                                <button
                                    type="button"
                                    onClick={addCard}
                                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add card
                                </button>
                            </div>

                            {form.cards.map((card, index) => (
                                <div
                                    key={`card-form-${index}`}
                                    className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5"
                                >
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                            Card {index + 1}
                                        </p>
                                        {form.cards.length > 1 ? (
                                            <button
                                                type="button"
                                                onClick={() => removeCard(index)}
                                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-card)] hover:text-[var(--color-text-primary)]"
                                                aria-label={`Remove card ${index + 1}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </button>
                                        ) : null}
                                    </div>

                                    <div className="space-y-5">
                                        <FormField label="Insight headline">
                                            <input
                                                type="text"
                                                value={card.insightTitle}
                                                onChange={(event) =>
                                                    handleCardChange(index, 'insightTitle', event.target.value)
                                                }
                                                placeholder="Identity Drives Behavior"
                                                className="w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-input-focus)] focus:ring-4 focus:ring-[var(--color-focus-ring)]"
                                                required
                                            />
                                        </FormField>

                                        <FormField
                                            label="Insight paragraph"
                                            hint={
                                                index === 0
                                                    ? 'The first sentence is highlighted in the preview, just like the current stack detail page.'
                                                    : undefined
                                            }
                                        >
                                            <textarea
                                                value={card.insightOne}
                                                onChange={(event) =>
                                                    handleCardChange(index, 'insightOne', event.target.value)
                                                }
                                                rows="4"
                                                placeholder="Lasting change gets easier when habits become evidence for the kind of person you believe you are."
                                                className="w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 py-3 text-sm leading-7 outline-none transition focus:border-[var(--color-input-focus)] focus:ring-4 focus:ring-[var(--color-focus-ring)]"
                                                required
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-xs)]">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                                        Ready to publish this stack?
                                    </p>
                                    <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                                        {form.cards.length} insight card{form.cards.length === 1 ? '' : 's'} will be published with this stack.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-[18px] bg-[var(--color-primary)] px-6 py-3 text-[15px] font-semibold text-[var(--color-text-on-primary)] transition hover:bg-[var(--color-primary-hover)]"
                                >
                                    Create Stack
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
