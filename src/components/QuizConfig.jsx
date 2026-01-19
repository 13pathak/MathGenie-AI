import React, { useState } from 'react';
import { Calculator, Zap, PieChart, Shapes, Ruler, percent, Clock, Brain, Check, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

const TOPICS = [
    { id: 'number_system', label: 'Number System', icon: Calculator },
    { id: 'lcm_hcf', label: 'LCM / HCF', icon: Zap },
    { id: 'profit_loss', label: 'Profit & Loss', icon: PieChart },
    { id: 'geometry', label: 'Geometry', icon: Shapes },
    { id: 'algebra', label: 'Algebra', icon: Ruler },
    { id: 'percentage', label: 'Percentage', icon: PieChart }, // Reusing PieChart as placeholder
    { id: 'time_work', label: 'Time & Work', icon: Clock },
];

const DIFFICULTIES = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'advanced', label: 'Advanced', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'olympiad', label: 'Olympiad', color: 'bg-amber-100 text-amber-700 border-amber-200' },
];

const QuizConfig = ({ onGenerate, isLoading }) => {
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [difficulty, setDifficulty] = useState('beginner');
    const [questionCount, setQuestionCount] = useState(5);

    const toggleTopic = (topicId) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(t => t !== topicId)
                : [...prev, topicId]
        );
    };

    const handleGenerate = () => {
        if (selectedTopics.length === 0) return;
        onGenerate({
            topics: selectedTopics,
            difficulty,
            count: questionCount
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Topics */}
                <div className="flex-1 space-y-4">
                    <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Shapes className="w-5 h-5 text-blue-500" />
                        Select Topics
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {TOPICS.map((topic) => {
                            const Icon = topic.icon;
                            const isSelected = selectedTopics.includes(topic.id);
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => toggleTopic(topic.id)}
                                    className={clsx(
                                        "p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 text-left relative overflow-hidden group",
                                        isSelected
                                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={clsx(
                                        "p-2 rounded-lg transition-colors",
                                        isSelected ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-500 group-hover:bg-white"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-sm">{topic.label}</span>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <Check className="w-4 h-4 text-blue-600" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {selectedTopics.length === 0 && (
                        <p className="text-sm text-red-500 animate-pulse font-medium px-2">
                            * Please select at least one topic
                        </p>
                    )}
                </div>

                {/* Right Column: Settings */}
                <div className="w-full md:w-80 space-y-6">
                    {/* Difficulty */}
                    <div className="space-y-3">
                        <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-500" />
                            Difficulty Level
                        </label>
                        <div className="space-y-2">
                            {DIFFICULTIES.map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => setDifficulty(level.value)}
                                    className={clsx(
                                        "w-full p-3 rounded-lg border-2 text-left transition-all font-medium text-sm flex items-center justify-between",
                                        difficulty === level.value
                                            ? level.color + " border-current shadow-sm"
                                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    {level.label}
                                    {difficulty === level.value && <div className="w-2 h-2 rounded-full bg-current" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question Count */}
                    <div className="space-y-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-slate-700">Question Count</label>
                            <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-mono font-bold">
                                {questionCount}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                            <span>1</span>
                            <span>10</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generate Button */}
            <div className="pt-8">
                <button
                    onClick={handleGenerate}
                    disabled={selectedTopics.length === 0 || isLoading}
                    className={clsx(
                        "w-full py-4 rounded-xl text-lg font-black tracking-wide text-white shadow-xl transition-all flex items-center justify-center gap-3",
                        selectedTopics.length === 0 || isLoading
                            ? "bg-slate-300 cursor-not-allowed opacity-70"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] shadow-blue-200"
                    )}
                >
                    {isLoading ? (
                        <>
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating Quiz...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-6 h-6 fill-white/20" />
                            GENERATE QUIZ
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default QuizConfig;
