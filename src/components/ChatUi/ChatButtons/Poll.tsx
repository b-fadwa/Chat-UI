import React, { useState, useEffect } from 'react';

interface PollModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (poll: { pollID: number; question: string; options: string[]; allowMultiple: boolean; selectedOptions: object }) => void;
    pollID: number;
}

const PollModal: React.FC<PollModalProps> = ({ isOpen, onClose, onSubmit, pollID: existingPollID }) => {
    const [pollID, setPollID] = useState(existingPollID ?? 0);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // Reset form state when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setPollID(existingPollID ?? ((prev) => prev + 1));
            setQuestion('');
            setOptions(['', '']);
            setAllowMultiple(false);
            setSelectedOptions([]);
        }
    }, [isOpen]);
    console.log('From Poll : ', pollID)
    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (question.trim() && options.some((option) => option.trim())) {
            onSubmit({ pollID, question, options: options.filter((opt) => opt.trim()), allowMultiple, selectedOptions });
            onClose();
        } else {
            alert('Please provide a question and at least one option.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-1/3">
                <h2 className="text-xl font-bold mb-4">Create a Poll</h2>
                <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full border rounded-lg p-2 mb-4"
                        placeholder="Enter your question"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-grow border rounded-lg p-2"
                                placeholder={`Option ${index + 1}`}
                            />
                            <button
                                onClick={() => removeOption(index)}
                                className="ml-2 text-red-500 font-bold"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addOption}
                        className="text-blue-500 font-medium mt-2"
                    >
                        + Add Option
                    </button>
                </div>
                <div className="mt-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={allowMultiple}
                            onChange={(e) => setAllowMultiple(e.target.checked)}
                            className="rounded"
                        />
                        <span>Allow multiple responses</span>
                    </label>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="mr-4 bg-gray-300 rounded-lg px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white rounded-lg px-4 py-2"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PollModal;
