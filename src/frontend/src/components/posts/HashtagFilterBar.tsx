import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Hash } from 'lucide-react';
import { useState } from 'react';
import { normalizeHashtag } from '@/lib/hashtags';

interface HashtagFilterBarProps {
    selectedHashtag: string | null;
    onHashtagChange: (hashtag: string | null) => void;
}

export default function HashtagFilterBar({
    selectedHashtag,
    onHashtagChange,
}: HashtagFilterBarProps) {
    const [inputValue, setInputValue] = useState('');

    const handleFilter = () => {
        if (!inputValue.trim()) return;
        const normalized = normalizeHashtag(inputValue);
        if (normalized) {
            onHashtagChange(normalized);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleFilter();
        }
    };

    return (
        <div className="mb-6 space-y-3">
            {/* Filter Input */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10" />
                    <Input
                        placeholder="Filter by hashtag..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 retro-input font-mono text-base"
                    />
                </div>
                <Button 
                    onClick={handleFilter} 
                    disabled={!inputValue.trim()}
                    className="retro-button bg-primary text-primary-foreground"
                >
                    Filter
                </Button>
            </div>

            {/* Active Filter */}
            {selectedHashtag && (
                <div className="retro-panel bg-secondary text-secondary-foreground p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold uppercase tracking-wide">
                            Filtering by: <span className="text-lg">#{selectedHashtag}</span>
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onHashtagChange(null)}
                            className="ml-auto retro-button bg-destructive text-destructive-foreground"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
