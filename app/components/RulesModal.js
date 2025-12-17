'use client';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function RulesModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            {/* FAB Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                title={t('rules.button')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div
                        className="bg-[var(--md-sys-color-surface)] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                                {t('rules.title')}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-[var(--md-sys-color-on-primary-container)]/10 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <section>
                                <h3 className="text-[var(--md-sys-color-primary)] font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="bg-[var(--md-sys-color-primary-container)] rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                                    {t('rules.general_title')}
                                </h3>
                                <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed pl-8">
                                    {t('rules.general_content')}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-[var(--md-sys-color-primary)] font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="bg-[var(--md-sys-color-primary-container)] rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                                    {t('rules.submission_title')}
                                </h3>
                                <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed pl-8">
                                    {t('rules.submission_content')}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-[var(--md-sys-color-primary)] font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="bg-[var(--md-sys-color-primary-container)] rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                                    {t('rules.bidding_title')}
                                </h3>
                                <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed pl-8">
                                    {t('rules.bidding_content')}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-[var(--md-sys-color-primary)] font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="bg-[var(--md-sys-color-primary-container)] rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                                    {t('rules.rating_title')}
                                </h3>
                                <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed pl-8 whitespace-pre-line">
                                    {t('rules.rating_content')}
                                </p>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[var(--md-sys-color-outline)]/20 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] rounded-lg font-medium hover:brightness-110 active:scale-95 transition-all"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
