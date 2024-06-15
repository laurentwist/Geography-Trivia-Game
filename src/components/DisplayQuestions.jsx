import React, { useState } from 'react'
import { css } from '@emotion/react'

export default function DisplayQuestion({ question, onNextQuestion, questionNumber, totalQuestions }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    onNextQuestion(selectedAnswer)
    setSelectedAnswer('')
  }

  //Shuffle questions so the last question isn't always the correct one
  const questionList = [...question.incorrectAnswers, question.correctAnswer].sort((a, b) => {
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  });

  console.log(questionList)
  return (
    <div css={questionContainerStyles}>
      <h3 css={questionHeaderStyles}>
        Question {questionNumber} out of {totalQuestions}
      </h3>
      <h3 css={questionHeaderStyles}>{question.question}</h3>
      <ul css={answerListStyles}>
        {questionList.map((answer, index) => (
          <li
            key={index}
            css={[
              answerItemStyles,
              selectedAnswer === answer && selectedAnswerStyles,
            ]}
            onClick={() => handleAnswerSelection(answer)}
          >
            {answer}
          </li>
        ))}
      </ul>
      <button css={nextButtonStyles} onClick={handleNextQuestion} disabled={!selectedAnswer}>
        Next Question
      </button>
    </div>
  )
}

const questionContainerStyles = css`
  margin-bottom: 20px;
`;

const questionHeaderStyles = css`
  margin-bottom: 10px;
`;

const answerListStyles = css`
  list-style-type: none;
  padding: 0;
`;

const answerItemStyles = css`
  cursor: pointer;
  margin-bottom: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const selectedAnswerStyles = css`
  background-color: #007bff;
  color: #fff;
`;

const nextButtonStyles = css`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-family: 'Merriweather', serif;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;