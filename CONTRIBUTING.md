# Contributing to Quiz App

Thank you for your interest in contributing to the Quiz App! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/utasar/Quiz-app/issues)
2. If not, create a new issue with:
   - Clear descriptive title
   - Detailed description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear descriptive title
   - Detailed description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Quiz-app.git
   cd Quiz-app
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Backend tests
   cd backend
   npm test
   npm run build

   # Frontend build
   cd ../frontend
   npm run build
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Provide clear description of changes
   - Link related issues

## Development Guidelines

### Code Style

#### TypeScript/JavaScript
- Use TypeScript for type safety
- Use meaningful variable and function names
- Keep functions small and focused
- Use async/await instead of callbacks
- Use const/let, never var

#### React
- Use functional components with hooks
- Keep components small and reusable
- Use proper prop types
- Handle errors gracefully

#### Backend
- Use proper error handling
- Validate all inputs
- Use proper HTTP status codes
- Add logging for important operations

### File Organization

```
backend/
  src/
    config/       # Configuration files
    controllers/  # Request handlers
    models/       # Database models
    routes/       # API routes
    services/     # Business logic
    middlewares/  # Custom middleware
    __tests__/    # Test files

frontend/
  src/
    components/   # Reusable components
    pages/        # Page components
    services/     # API services
    types/        # TypeScript types
    hooks/        # Custom hooks
    utils/        # Utility functions
```

### Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases

### Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update API documentation
- Add inline comments for complex logic

## Getting Help

- Join our [Discussions](https://github.com/utasar/Quiz-app/discussions)
- Check existing [Issues](https://github.com/utasar/Quiz-app/issues)
- Read the [Documentation](./README.md)

## Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- Project documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Quiz App! 🎉
