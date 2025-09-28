// Генератор уникальных localId для чатов
class LocalIdGenerator {
    private static counter = 1;

    static generateLocalId(): string {
        const localId = `chat_${this.counter}`;
        this.counter++;
        return localId;
    }
}

export {LocalIdGenerator};
