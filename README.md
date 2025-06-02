# Tic-Tac-Toe with Self-Learning AI

This is a React-based Tic-Tac-Toe game featuring an AI opponent that learns to play better over time using a simple form of Q-learning. The project was built entirely by GitHub Copilot, in less than a day, with about 50 prompts. There were several bugs that required console logging to debug, and one major refactor.

(Copilot generated everything below.)

## Features

- **Classic Tic-Tac-Toe gameplay**: Play as X or O against a friend or the computer.
- **Self-learning AI**: The AI uses a Q-learning-inspired approach, updating its strategy based on wins and losses from previous games.
- **AI alternates sides**: After each game, the AI switches between playing as X and O.
- **Modern UI**: Responsive, accessible, and visually appealing interface.
- **Persistent learning**: The AI improves as you play more games in the same session.

## How the AI Works

- The AI evaluates all possible moves and assigns a value to each based on its experience (stored as wins and losses for each board state).
- If a board state is new, it is given a default value that encourages exploration.
- The AI chooses the move with the highest value most of the time, but occasionally makes a random move to encourage exploration.
- After each game, the AI updates its knowledge base, rewarding moves that led to wins and penalizing those that led to losses.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm start
   ```

3. **Build for production:**
   ```sh
   npm run build
   ```

4. **Lint the code:**
   ```sh
   npm run lint
   ```

## Deployment

You can deploy the production build (`dist` or `build` folder) to any static hosting service, such as Vercel, Netlify, or GitHub Pages.

## Project Structure

- `src/App.tsx` — Main React component and game logic
- `src/ai.ts` — AI logic and Q-learning implementation
- `src/App.css` — Styles

## License

MIT

---

*Built with ❤️ and GitHub Copilot*
