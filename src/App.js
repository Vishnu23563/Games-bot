import React, { useState, useEffect, useMemo } from 'react';

// Rock Paper Scissors Game Component
function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState('');
  const [botChoice, setBotChoice] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const choices = useMemo(() => ['Rock', 'Paper', 'Scissors'], []);
  const emoji = {
    Rock: '✊',
    Paper: '🖐',
    Scissors: '✌️'
  };

  function predictUserMove() {
    if (history.length === 0) return choices[Math.floor(Math.random() * 3)];
    const freq = { Rock: 0, Paper: 0, Scissors: 0 };
    history.forEach(move => freq[move]++);
    let predicted = 'Rock';
    if (freq.Paper > freq.Rock && freq.Paper >= freq.Scissors) predicted = 'Paper';
    if (freq.Scissors > freq.Rock && freq.Scissors > freq.Paper) predicted = 'Scissors';
    return predicted;
  }

  function getBotMove() {
    const predicted = predictUserMove();
    if (predicted === 'Rock') return 'Paper';
    if (predicted === 'Paper') return 'Scissors';
    return 'Rock';
  }

  const playGame = (choice) => {
    setUserChoice(choice);
    setHistory(prev => [...prev, choice]);
    const bot = getBotMove();
    setBotChoice(bot);

    if (choice === bot) {
      setResult('Draw!');
    } else if (
      (choice === 'Rock' && bot === 'Scissors') ||
      (choice === 'Paper' && bot === 'Rock') ||
      (choice === 'Scissors' && bot === 'Paper')
    ) {
      setResult('You win!');
    } else {
      setResult('Bot wins!');
    }
  };

  // This effect is not really necessary here, but if you have any side effects related to history/choices, add dependencies:
  useEffect(() => {
    // No side effect needed currently
  }, [history, choices, userChoice]); // Added dependencies as per ESLint warning

  return (
    <div style={{ background: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.17)', padding: '40px', margin: '40px auto', maxWidth: '400px', color: 'white', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '2px 2px 8px #222' }}>
        ✊🖐✌ Rock Paper Scissors (with ML)
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        {choices.map(choice => (
          <button
            key={choice}
            onClick={() => playGame(choice)}
            style={{ padding: '1.2rem 2rem', fontSize: '2rem', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', transition: 'transform 0.1s' }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {emoji[choice]}
            <div style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{choice}</div>
          </button>
        ))}
      </div>
      {userChoice && (
        <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '12px', padding: '1rem', marginTop: '1rem', fontSize: '1.3rem' }}>
          <div><strong>You:</strong> {emoji[userChoice]} {userChoice}</div>
          <div><strong>Bot:</strong> {emoji[botChoice]} {botChoice}</div>
          <div style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '1.5rem', color: result === 'You win!' ? '#43cea2' : result === 'Bot wins!' ? '#ffd200' : '#fff' }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// Tic Tac Toe with Basic ML
function TicTacToe() {
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = (brd) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of lines) {
      if (brd[a] && brd[a] === brd[b] && brd[a] === brd[c]) return brd[a];
    }
    if (brd.every(cell => cell)) return 'Draw';
    return null;
  };

  const handleClick = (idx) => {
    if (!isUserTurn || board[idx] || winner) return;
    const newBoard = board.slice();
    newBoard[idx] = 'X';
    const win = checkWinner(newBoard);
    setBoard(newBoard);
    setWinner(win);
    setIsUserTurn(false);
  };

  useEffect(() => {
    // Move findBestMove inside useEffect to avoid dependency warning
    const findBestMove = (brd) => {
      const empty = brd.map((val, idx) => val ? null : idx).filter(i => i !== null);

      // Try to win
      for (let idx of empty) {
        const newBrd = [...brd];
        newBrd[idx] = 'O';
        if (checkWinner(newBrd) === 'O') return idx;
      }

      // Block user win
      for (let idx of empty) {
        const newBrd = [...brd];
        newBrd[idx] = 'X';
        if (checkWinner(newBrd) === 'X') return idx;
      }

      // Otherwise, random move
      return empty[Math.floor(Math.random() * empty.length)];
    };

    if (!isUserTurn && !winner) {
      const move = findBestMove(board);
      const newBoard = board.slice();
      newBoard[move] = 'O';
      const win = checkWinner(newBoard);
      setTimeout(() => {
        setBoard(newBoard);
        setWinner(win);
        setIsUserTurn(true);
      }, 500);
    }
  }, [isUserTurn, board, winner]); // dependencies are complete here

  const reset = () => {
    setBoard(emptyBoard);
    setIsUserTurn(true);
    setWinner(null);
  };

  return (
    <div>
      <h2>Tic Tac Toe (with ML)</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 60px)',
        gap: '8px',
        margin: '20px auto'
      }}>
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            style={{
              width: '60px',
              height: '60px',
              fontSize: '2rem',
              background: '#fff',
              border: '2px solid #764ba2',
              borderRadius: '8px',
              cursor: cell || winner ? 'not-allowed' : 'pointer'
            }}
          >
            {cell}
          </button>
        ))}
      </div>
      <p>
        {winner
          ? winner === 'Draw'
            ? "It's a draw!"
            : winner === 'X'
              ? 'You win!'
              : 'Bot wins!'
          : isUserTurn
            ? 'Your turn (X)'
            : "Bot's turn (O)"}
      </p>
      <button onClick={reset} style={{
        padding: '0.5rem 1.5rem',
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px'
      }}>
        Restart
      </button>
    </div>
  );
}

// Home Component
function Home({ onSelectGame }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
      padding: '40px',
      margin: '40px'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 8px #222' }}>
        🤖 AI Game Bot
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        Welcome! Challenge yourself or the AI in fun games.<br />
        Choose a game to get started:
      </p>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <button
          onClick={() => onSelectGame('ttt')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
            color: '#222',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
          }}
        >
          ⭕❌ Tic Tac Toe
        </button>
        <button
          onClick={() => onSelectGame('rps')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
          }}
        >
          ✊🖐✌️ Rock Paper Scissors
        </button>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [selectedGame, setSelectedGame] = useState('');

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: '100vh', background: '#f4f6fb' }}>
      {selectedGame === '' && <Home onSelectGame={setSelectedGame} />}
      {selectedGame === 'rps' && <RockPaperScissors />}
      {selectedGame === 'ttt' && <TicTacToe />}
      {selectedGame !== '' && (
        <div style={{ position: 'fixed', top: 20, right: 20 }}>
          <button
            onClick={() => setSelectedGame('')}
            style={{
              background: '#222',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            ⬅ Home
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
