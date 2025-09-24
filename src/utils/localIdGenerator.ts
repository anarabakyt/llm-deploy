// Генератор уникальных localId для чатов
class LocalIdGenerator {
  private static counter = 1;

  // Генерирует следующий localId
  static generateLocalId(): string {
    const localId = `chat_${this.counter}`;
    this.counter++;
    return localId;
  }

  // Сбрасывает счетчик (для тестирования)
  static reset(): void {
    this.counter = 1;
  }

  // Устанавливает начальное значение счетчика
  static setCounter(value: number): void {
    this.counter = value;
  }

  // Получает текущее значение счетчика
  static getCounter(): number {
    return this.counter;
  }
}

export { LocalIdGenerator };
