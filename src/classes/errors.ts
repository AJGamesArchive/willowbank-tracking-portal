// Creating a function not implemented error
class NotImplementedError extends Error {
  constructor(message: string = 'This function is not implemented yet.') {
    super(message);
    this.name = 'NotImplementedError';
  };
};
