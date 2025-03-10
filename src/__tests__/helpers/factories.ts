// Example factory for generating test data
export const createTestUser = (overrides = {}) => ({
  id: 'test-id',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

export const createTestTodo = (overrides = {}) => ({
  id: 'todo-1',
  title: 'Test Todo',
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides,
}); 