import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import {  Search, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function FieldShell({ label, children, className = '' }) {
    return (
        <label className={`block rounded-[16px] border border-[var(--color-border)] bg-[var(--color-lightgray)] px-3 py-2.5 sm:rounded-[20px] sm:px-4 sm:py-3 ${className}`}>
            <span className="block text-[12px] font-semibold text-[var(--color-text-secondary)]">{label}</span>
            {children}
        </label>
    )
}

export default function CreateReelPage() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [video, setVideo] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [tagSearch, setTagSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    const fileName = video?.name || ''
    const fileTypeHint = video?.type?.startsWith('video/') ? 'Video selected' : ''

    useEffect(() => {
        if (!video) {
            setPreviewUrl('')
            return
        }

        const objectUrl = URL.createObjectURL(video)
        setPreviewUrl(objectUrl)

        return () => {
            URL.revokeObjectURL(objectUrl)
        }
    }, [video])

    const handleFileSelect = (file) => {
        if (!file) {
            return
        }

        setVideo(file)
        setMessage('')
    }

    const handleFileChange = (event) => {
        handleFileSelect(event.target.files?.[0])
    }

    const handleDrop = (event) => {
        event.preventDefault()
        handleFileSelect(event.dataTransfer.files?.[0])
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!video) {
            setMessage('Please upload a video')
            return
        }

        try {
            setLoading(true)
            setMessage('')

            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('video', video)

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/reel`, formData, {
                withCredentials: true,
            })

            if (response.status === 201) {
                setMessage('Reel created successfully')
                setName('')
                setDescription('')
                setTagSearch('')
                setVideo(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
                navigate('/creator/reels')
            } else {
                setMessage(response.data?.message || 'Failed to create reel')
            }
        } catch (error) {
            console.error(error)
            setMessage('Server error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[100dvh] bg-[var(--color-bg)] px-3 py-3 pb-6 text-[var(--color-text-primary)] sm:px-4 sm:py-4 md:px-6 md:py-5">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-4 space-y-1 sm:mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                        Creator Studio
                    </p>
                    <h1 className="text-[22px] font-semibold tracking-[-0.02em] sm:text-[26px] md:text-[32px]">
                        Create Reel
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-5 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6 xl:grid-cols-[310px_minmax(0,1fr)] xl:gap-6"
                >
                    <div className="flex justify-center xl:justify-start">
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex aspect-[9/16] w-full max-w-[min(100%,280px)] cursor-pointer flex-col items-center justify-between rounded-[20px] border border-[var(--color-border)] bg-[var(--color-lightgray)] text-center transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-hover)] sm:max-w-[290px] sm:rounded-[24px] xl:max-w-[290px]"
                        >
                            {previewUrl ? (
                                <div className="relative h-full w-full overflow-hidden rounded-[24px]">
                                    <video
                                        src={previewUrl}
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="h-full w-full object-cover"
                                        onClick={(event) => event.stopPropagation()}
                                    />
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[var(--gradient-reel-overlay)] px-4 py-4 text-left">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {fileName}
                                        </p>
                                        <p className="mt-1 text-xs text-white/80">
                                            Tap anywhere to replace this video
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-1 flex-col items-center justify-center">
                                        <div className="mb-5 grid h-12 w-12 place-items-center rounded-full border-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)]">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <p className="max-w-[200px] px-3 text-[15px] font-semibold leading-6 text-[var(--color-text-primary)] sm:max-w-[230px] sm:text-[18px] sm:leading-8">
                                            {fileName ? fileName : 'Choose a file or drag and drop it here'}
                                        </p>
                                        <p className="mt-2 px-3 text-[12px] text-[var(--color-text-secondary)] sm:text-[13px]">
                                            {fileTypeHint || 'Your reel file will be uploaded securely.'}
                                        </p>
                                    </div>

                                   
                                </>
                            )}
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                    />

                    <section className="min-w-0 space-y-3">
                        <FieldShell label="Title">
                            <input
                                type="text"
                                placeholder="Tell everyone what your reel is about"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="mt-2 w-full bg-transparent text-[14px] font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] md:text-[16px]"
                                required
                            />
                        </FieldShell>

                        <FieldShell label="Description">
                            <textarea
                                placeholder="Describe your reel"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows="4"
                                className="mt-2 w-full resize-none bg-transparent text-[14px] leading-6 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] md:text-[17px] md:leading-8"
                                required
                            />
                        </FieldShell>

                        <FieldShell label="Tagged topics (0)">
                            <div className="mt-2 flex items-center gap-3">
                                <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search for a tag"
                                    value={tagSearch}
                                    onChange={(event) => setTagSearch(event.target.value)}
                                    className="w-full bg-transparent text-[14px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] md:text-[17px]"
                                />
                            </div>
                        </FieldShell>

                        

                        <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-lightgray)] p-4 sm:rounded-[24px] sm:bg-[var(--color-card)] sm:shadow-[var(--shadow-xs)]">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="min-w-0">
                                    <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">Ready to publish?</p>
                                    <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                                        Double-check your title, description, and selected video before uploading.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full shrink-0 rounded-[18px] bg-[var(--color-primary)] px-6 py-3 text-[15px] font-semibold text-[var(--color-text-on-primary)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                                >
                                    {loading ? 'Uploading...' : 'Create Reel'}
                                </button>
                            </div>

                            {message && (
                                <p className="mt-4 text-[13px] font-medium text-[var(--color-text-secondary)]">{message}</p>
                            )}
                        </div>
                    </section>
                </form>
            </div>
        </div>
    )
}
