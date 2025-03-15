export interface HistoryEntry {
    id: string;
    timestamp: number;
    description: string;
    fileName: string;
    curlCommand: any;
    tags?: string[];
}

const HISTORY_STORAGE_KEY = "har-analyzer-history";

const MAX_HISTORY_ENTRIES = 50;

export const historyService = {
    getEntries(): HistoryEntry[] {
        try {
            const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
            const history: HistoryEntry[] = storedHistory
                ? JSON.parse(storedHistory)
                : [];

            return history.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error("Error retrieving history:", error);
            return [];
        }
    },

    addEntry(entry: Omit<HistoryEntry, "id" | "timestamp">): HistoryEntry {
        try {
            const history = this.getEntries();

            const newEntry: HistoryEntry = {
                ...entry,
                id: this.generateId(),
                timestamp: Date.now(),
            };

            history.unshift(newEntry);

            const limitedHistory = history.slice(0, MAX_HISTORY_ENTRIES);

            localStorage.setItem(
                HISTORY_STORAGE_KEY,
                JSON.stringify(limitedHistory)
            );

            return newEntry;
        } catch (error) {
            console.error("Error adding history entry:", error);
            throw error;
        }
    },

    deleteEntry(id: string): boolean {
        try {
            const history = this.getEntries();
            const initialLength = history.length;

            const updatedHistory = history.filter((entry) => entry.id !== id);

            if (updatedHistory.length === initialLength) {
                return false;
            }

            localStorage.setItem(
                HISTORY_STORAGE_KEY,
                JSON.stringify(updatedHistory)
            );
            return true;
        } catch (error) {
            console.error("Error deleting history entry:", error);
            return false;
        }
    },

    clearHistory(): void {
        try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
        } catch (error) {
            console.error("Error clearing history:", error);
        }
    },

    getEntryById(id: string): HistoryEntry | undefined {
        const history = this.getEntries();
        return history.find((entry) => entry.id === id);
    },

    generateId(): string {
        return (
            Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        );
    },
};

export default historyService;
