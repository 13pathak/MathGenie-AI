import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChevronDown, ChevronUp, Lightbulb, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

const QuestionCard = ({ question, index, forceOpen }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Sync with forceOpen prop if it changes
    React.useEffect(() => {
        if (forceOpen !== undefined) {
            setIsOpen(forceOpen);
        }
    }, [forceOpen]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md print:break-inside-avoid print:shadow-none print:border-slate-300">
            {/* Question Header */}
            <div className="p-6 bg-slate-50/50">
                <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-lg text-sm font-mono">
                        Q{index + 1}
                    </span>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-slate-800 leading-relaxed">
                            {question.question}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Answer Toggle */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {isOpen ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Hide Solution
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show Answer & Explanation
                        </>
                    )}
                </button>
            </div>

            {/* Expanded Answer Content */}
            {isOpen && (
                <div className="p-6 bg-blue-50/30 border-t border-blue-100 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-6">

                        {/* Final Answer */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2 text-green-800 font-bold text-sm uppercase tracking-wide">
                                <CheckCubeIcon className="w-4 h-4" />
                                Final Answer
                            </div>
                            <div className="text-green-900 font-mono font-medium text-lg">
                                {question.answer}
                            </div>
                        </div>

                        {/* Logic / Step-by-Step */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                    Step-by-Step Logic
                                </h4>
                                <button
                                    className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                    title="Regenerate explanation (Coming soon)"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    Regenerate
                                </button>
                            </div>

                            <div className="prose prose-slate prose-sm max-w-none text-slate-700 bg-white p-6 rounded-xl border border-slate-200">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />
                                    }}
                                >
                                    {question.logic}
                                </ReactMarkdown>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

// Helper icon component
function CheckCubeIcon({ className }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m21 16-1.072-1.995a10 10 0 1 0-3.928 3.995" />
            <path d="M5 13L21 13" />
            <path d="M9 16l4-4 4 4" />
        </svg>
    );
}

export default QuestionCard;
