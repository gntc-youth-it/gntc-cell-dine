import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, MessageCircle, SkipForward, PointerIcon, Users } from 'lucide-react'
import questions from './questions'
import './App.css'

const ICON_MAP = {
  'message-circle': MessageCircle,
}

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function App() {
  const [shuffledQuestions] = useState(() => shuffleArray(questions))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const timerRef = useRef(null)
  const total = shuffledQuestions.length

  if (total === 0) {
    return (
      <div className="app">
        <div className="header">
          <div className="title-block">
            <span className="game-title">질문 카드</span>
            <span className="game-subtitle">구역회식</span>
          </div>
        </div>
        <div className="card-deck-area">
          <p className="question-text">준비된 질문이 없습니다.</p>
        </div>
      </div>
    )
  }

  const question = shuffledQuestions[currentIndex]
  const CategoryIcon = ICON_MAP[question.icon] || MessageCircle

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCardClick = useCallback(() => {
    if (!isFlipped) {
      setIsFlipped(true)
    }
  }, [isFlipped])

  const handleNextCard = useCallback(() => {
    setIsFlipped(false)
    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, 300)
  }, [total])

  const cardNumber = currentIndex + 1
  const progressWidth = (cardNumber / total) * 100

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="title-block">
          <span className="game-title">질문 카드</span>
          <span className="game-subtitle">구역회식</span>
        </div>
        <div className="deck-counter">
          <Search className="icon" />
          <span className="deck-text">{cardNumber} / {total}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressWidth}%` }} />
        <div className="progress-empty" />
      </div>

      {/* Card Deck Area */}
      <div className="card-deck-area">
        <div className="shadow-card shadow-card-3" />
        <div className="shadow-card shadow-card-2" />
        <div className="shadow-card shadow-card-1" />

        <div className="card-flip-container" onClick={handleCardClick}>
          <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`}>
            {/* Card Back */}
            <div className="card-back">
              <div className="card-back-inner">
                <span className="question-mark">?</span>
                <span className="card-label">터치해서 확인하세요</span>
              </div>
            </div>

            {/* Card Front */}
            <div className="card-front">
              <div className="category-badge">
                <CategoryIcon className="icon" />
                <span className="cat-text">{question.category}</span>
              </div>
              <p className="question-text">{question.text}</p>
              <span className="card-number">{cardNumber} / {total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {!isFlipped ? (
          <div className="tap-hint fade-in" key="hint">
            <PointerIcon className="icon" />
            <span className="tap-text">카드를 터치해서 질문을 확인하세요</span>
          </div>
        ) : (
          <>
            <button className="next-card-button fade-in" onClick={handleNextCard}>
              <SkipForward className="icon" />
              <span className="next-text">다음 카드</span>
            </button>
          </>
        )}
        <span className="copyright">gntc-youth-it</span>
      </div>
    </div>
  )
}

export default App
