import type { Player, Cell } from './App'

// Persisted map: key is serialized game state, value is { wins, losses }
const stateStats: Map<string, { wins: number; losses: number }> = new Map()

export function getAIMove(board: Cell[][], aiPlayer: Player): [number, number] | null {
  const opponent: Player = aiPlayer === 'X' ? 'O' : 'X'
  const moves: [number, number][] = []
  console.log('AI calculating move for player:', aiPlayer, 'on board:', board)

  function isWinningMove(b: Cell[][], player: Player, row: number, col: number): boolean {
    const testBoard = b.map(r => [...r])
    testBoard[row][col] = player
    // Check rows, columns, diagonals
    for (let i = 0; i < 3; i++) {
      if (testBoard[i][0] && testBoard[i][0] === testBoard[i][1] && testBoard[i][1] === testBoard[i][2]) {
        if (testBoard[i][0] === player) return true
      }
      if (testBoard[0][i] && testBoard[0][i] === testBoard[1][i] && testBoard[1][i] === testBoard[2][i]) {
        if (testBoard[0][i] === player) return true
      }
    }
    if (testBoard[0][0] && testBoard[0][0] === testBoard[1][1] && testBoard[1][1] === testBoard[2][2]) {
      if (testBoard[0][0] === player) return true
    }
    if (testBoard[0][2] && testBoard[0][2] === testBoard[1][1] && testBoard[1][1] === testBoard[2][0]) {
      if (testBoard[0][2] === player) return true
    }
    return false
  }

  // Collect all legal moves
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (!board[row][col]) moves.push([row, col])
    }
  }

  // 1. Try to win
  for (const [row, col] of moves) {
    if (isWinningMove(board, aiPlayer, row, col)) {
      console.log('AI found winning move at:', row, col)
      return [row, col]
    }
  }
  // 2. Try to block opponent's win
  for (const [row, col] of moves) {
    if (isWinningMove(board, opponent, row, col)) {
        console.log('AI found blocking move at:', row, col)
      return [row, col]
    }
  }

  // 3. Play random 5% of the time
  if (Math.random() < 0.05) {
    const idx = Math.floor(Math.random() * moves.length)
    console.log('AI playing random move at index:', idx, 'from moves:', moves)
    return moves[idx] ?? null
  }

  // 4. Look up each move in the map and pick the highest value
  let bestValue = -1
  let bestMoves: [number, number][] = []
  for (const [row, col] of moves) {
    const testBoard = board.map(r => [...r])
    testBoard[row][col] = aiPlayer
    const key = JSON.stringify(testBoard)
    const stats = stateStats.get(key)
    let value = 0.55
    if (stats && (stats.wins + stats.losses) > 0) {
      value = stats.wins / (stats.wins + stats.losses)
    }
    if (value > bestValue) {
      bestValue = value
      bestMoves = [[row, col]]
    } else if (value === bestValue) {
      bestMoves.push([row, col])
    }
  }
  console.log('AI bestMoves:', bestMoves, 'with value:', bestValue)
  if (bestMoves.length === 0) return null
  // Pick randomly among best moves if tied
  return bestMoves[Math.floor(Math.random() * bestMoves.length)]
}

/**
 * Called at the end of each game with the list of board states and the winner.
 * Records if the state led to a win or a loss, regardless of which player was the AI.
 */
export function recordGameResult(gameHistory: Cell[][][], winner: Player | null) {
    console.log('Recording game result:', winner, 'for history:', gameHistory)
  // If draw, all states are draws (+1 to both wins and losses)
  if (!winner) {
    for (const state of gameHistory) {
      const key = JSON.stringify(state)
      const stats = stateStats.get(key) ?? { wins: 4, losses: 4 }
      stats.wins += 1
      stats.losses += 1
      stateStats.set(key, stats)
    }
  } else {
    // If win, alternate win/loss starting from the end (last state is win)
    let isWin = true
    console.log('updating win/loss for ', winner, 'game history:', gameHistory)
    for (let i = gameHistory.length - 1; i >= 0; i--) {
      const state = gameHistory[i]
      const key = JSON.stringify(state)
      const stats = stateStats.get(key) ?? { wins: 10, losses: 10 }
      if (isWin) {
        stats.wins += 2
      } else {
        stats.losses += 2
      }
      stateStats.set(key, stats)
      isWin = !isWin
    }
  }
}