import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Trophy, User } from 'lucide-react';

const Card = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);

  // Card symbols/emojis
  const cardSymbols = ['💸', '🏠', '✨', '💪', '⏳', '🏆', '💚', '🌿', '💖', '♻️', '🏆', '🏅', '🪅', '💎', '🌹'];

  // Initialize game
  const initializeGame = () => {
    const shuffledSymbols = [...cardSymbols].sort(() => Math.random() - 0.5).slice(0, 15);
    const gameCards = [...shuffledSymbols, ...shuffledSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setGameOver(false);
    setMoves(0);
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || gameOver) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setTimeout(() => checkForMatch(newFlippedCards), 1000);
    }
  };

  // Check if two flipped cards match
  const checkForMatch = (flippedCardIds) => {
    const [firstCard, secondCard] = flippedCardIds.map(id => 
      cards.find(c => c.id === id)
    );

    if (firstCard.symbol === secondCard.symbol) {
      // Match found
      setMatchedCards(prev => [...prev, ...flippedCardIds]);
      setCards(prev => prev.map(c => 
        flippedCardIds.includes(c.id) 
          ? { ...c, isMatched: true }
          : c
      ));
      
      // Award point to current player
      setScores(prev => ({
        ...prev,
        [`player${currentPlayer}`]: prev[`player${currentPlayer}`] + 1
      }));
    } else {
      // No match - flip cards back
      setCards(prev => prev.map(c => 
        flippedCardIds.includes(c.id) 
          ? { ...c, isFlipped: false }
          : c
      ));
      
      // Switch to next player
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
    }
    
    setFlippedCards([]);
  };

  // Check if game is over
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matchedCards, cards]);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  const winner = gameOver ? 
    (scores.player1 > scores.player2 ? 'Player 1' : 
     scores.player2 > scores.player1 ? 'Player 2' : 'Tie') : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Trophy className="text-yellow-400" />
            Memory Card Game
          </h1>
          <p className="text-blue-200">Find matching pairs to score points!</p>
        </div>

        {/* Game Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-6">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                currentPlayer === 1 ? 'bg-blue-500 text-white' : 'bg-white/20 text-blue-200'
              }`}>
                <User size={20} />
                <span>Player 1: {scores.player1}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                currentPlayer === 2 ? 'bg-red-500 text-white' : 'bg-white/20 text-red-200'
              }`}>
                <User size={20} />
                <span>Player 2: {scores.player2}</span>
              </div>
            </div>
            <div className="text-white">
              <span>Moves: {moves}</span>
            </div>
          </div>
        </div>

        {/* Game Over Message */}
        {gameOver && (
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg mb-6 text-center">
            <Trophy className="mx-auto mb-2" size={32} />
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p className="text-lg">
              {winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}
            </p>
            <p className="text-sm opacity-90">
              Final Score - Player 1: {scores.player1}, Player 2: {scores.player2}
            </p>
          </div>
        )}

        {/* Game Board */}
        <div className="grid grid-cols-6 gap-3 mb-6 max-w-2xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square flex items-center justify-center text-2xl font-bold
                rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105
                ${card.isFlipped || card.isMatched
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-transparent hover:from-indigo-400 hover:to-purple-500'
                }
                ${card.isMatched ? 'ring-4 ring-green-400' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </div>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={initializeGame}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RotateCcw size={20} />
            New Game
          </button>
          <button
            onClick={() => {
              setCards(prev => [...prev].sort(() => Math.random() - 0.5));
              setFlippedCards([]);
              setMatchedCards([]);
              setCurrentPlayer(1);
              setScores({ player1: 0, player2: 0 });
              setGameOver(false);
              setMoves(0);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Shuffle size={20} />
            Shuffle
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-blue-100">
          <h3 className="font-semibold mb-2">How to Play:</h3>
          <ul className="text-sm space-y-1">
            <li>• Click on cards to flip them and reveal the symbol</li>
            <li>• Find matching pairs to score points</li>
            <li>• If you find a match, you get another turn</li>
            <li>• If no match, play passes to the other player</li>
            <li>• The player with the most matches wins!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;