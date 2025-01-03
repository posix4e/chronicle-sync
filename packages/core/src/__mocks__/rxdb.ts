export const createRxDatabase = jest.fn().mockImplementation(() => ({
  addCollections: jest.fn().mockResolvedValue({
    history: {
      insert: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([])
      })
    }
  })
}));

export const addRxPlugin = jest.fn();