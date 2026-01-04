export class InMemoryRepository<T extends { id: number }> {
  // private storage
  private items: T[] = [];

  add(entity: T): T {
    const existing = this.findById(entity.id);
    if (existing) {
      throw new Error(`Entity with id ${entity.id} already exists`);
    }
    
    this.items.push(entity);
    return entity;
  }

  update(id: number, patch: Partial<T>): T {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Entity with id ${id} not found`);
    }
    
    const updatedEntity = {
      ...this.items[index],
      ...patch
    };
    
    this.items[index] = updatedEntity;
    return updatedEntity;
  }

  remove(id: number): void {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Entity with id ${id} not found`);
    }
    
    this.items.splice(index, 1);
  }

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  findAll(): T[] {
    // Возвращаем копию массива, чтобы предотвратить модификацию извне
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}