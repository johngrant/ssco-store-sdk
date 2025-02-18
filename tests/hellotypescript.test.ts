import { greet } from '../src/hellotypescript';

describe('greet function', () => {
    it('should return a greeting message with the provided name', () => {
        const name = "joe";
        const expectedGreeting = `Hello, ${name}!`;
        expect(greet(name)).toBe(expectedGreeting);
    });

    it('should return a greeting message with "World" when no name is provided', () => {
        const expectedGreeting = 'Hello, World!';
        expect(greet('World')).toBe(expectedGreeting);
    });
});