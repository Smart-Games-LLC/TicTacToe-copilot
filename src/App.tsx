import { useState, useRef, useEffect } from 'react'
import './App.css'
import { getAIMove, recordGameResult } from './ai.ts'

export type Player = 'X' | 'O'
export type Cell = Player | null

function calculateWinner(board: Cell[][]): Player | null {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0]
    if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i]
  }
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0]
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2]
  return null
}

function isBoardFull(board: Cell[][]): boolean {
  return board.every(row => row.every(cell => cell !== null))
}

const emptyBoard: Cell[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

function App() {
  const [board, setBoard] = useState<Cell[][]>(emptyBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [aiEnabled, setAiEnabled] = useState(false)
  const [aiPlayer, setAiPlayer] = useState<Player>('O')
  const [gameHistory, setGameHistory] = useState<Cell[][][]>([])
  const [gameOver, setGameOver] = useState(false)
  const winner = calculateWinner(board)
  const isDraw = !winner && isBoardFull(board)

  // Track previous winner and draw to detect game end
  const prevWinner = useRef<Player | null>(null)
  const prevIsDraw = useRef<boolean>(false)
  const lastMoveByAI = useRef(false)

  // Helper to record game state and check for game end
  function recordMove(newBoard: Cell[][]) {
    setGameHistory(history => {
      const updatedHistory = [...history, newBoard.map(row => [...row])]
      const newWinner = calculateWinner(newBoard)
      const newIsDraw = !newWinner && isBoardFull(newBoard)

      // Game finished
      if ((newWinner && prevWinner.current !== newWinner) || (newIsDraw && !prevIsDraw.current)) {
        recordGameResult([...updatedHistory], newWinner)
        setGameHistory([])
        setGameOver(true)
      } else {
        setGameOver(false)
      }
      prevWinner.current = newWinner
      prevIsDraw.current = newIsDraw

      return updatedHistory
    })
  }

  function handleClick(x: number, y: number, isAIMove = false) {
    if (board[x][y] || winner || gameOver || (aiEnabled && currentPlayer === aiPlayer && !isAIMove)) return
    const newBoard = board.map(row => [...row])
    newBoard[x][y] = currentPlayer
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X'
    setBoard(newBoard)
    setCurrentPlayer(nextPlayer)
    recordMove(newBoard)
    lastMoveByAI.current = isAIMove
  }

  useEffect(() => {
    if (
      aiEnabled &&
      currentPlayer === aiPlayer &&
      !winner &&
      !isDraw &&
      !gameOver
    ) {
      const move = getAIMove(board, aiPlayer)
      if (move) {
        const [aiX, aiY] = move
        setTimeout(() => handleClick(aiX, aiY, true), 400)
      }
    }
    // eslint-disable-next-line
  }, [board, currentPlayer, aiEnabled, aiPlayer, winner, isDraw, gameOver])

  function handleRestart() {
    setBoard(emptyBoard)
    setCurrentPlayer('X')
    setGameOver(false)
    prevWinner.current = null
    prevIsDraw.current = false
    lastMoveByAI.current = false
    if (aiEnabled) {
      setAiPlayer(prev => (prev === 'X' ? 'O' : 'X'))
    }
  }

  return (
    <div className="app">
      <h1>Tic Tac Toe</h1>
      <div className="settings">
        <label>
          <input
            type="checkbox"
            checked={aiEnabled}
            onChange={e => setAiEnabled(e.target.checked)}
          />
          Enable AI ({aiPlayer})
        </label>
        <button className="ttt-newgame" onClick={handleRestart}>New Game</button>
      </div>
      <div className="ttt-board">
        {board.map((row, x) => (
          <div key={x} className="ttt-row">
            {row.map((cell, y) => (
              <button
                key={y}
                className={`ttt-cell${cell ? ' ' + cell : ''}`}
                onClick={() => handleClick(x, y)}
                disabled={!!cell || !!winner || (aiEnabled && currentPlayer === aiPlayer)}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
        <div className="overlay">
          <div className="message">
            {winner
              ? `Player ${winner} wins!`
              : isDraw
                ? "It's a draw!"
                : ""}
          </div>
        </div>
    </div>
  )
}

export default App
