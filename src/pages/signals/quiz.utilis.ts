import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
}

export interface QuizState {
    currentQuestionIndex: number;
    score: number;
    timeRemaining: number;
    answers: { [key: number]: string };
    isCompleted: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private readonly INITIAL_TIME = 30;
    private questions: Question[] = [
        {
            id: 1,
            text: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            correctAnswer: 'Paris',
            explanation: 'Paris is the capital and largest city of France.',
            category: 'Geography',
            difficulty: 'easy',
            points: 10
        },
        {
            id: 2,
            text: 'Which programming language was created by Brendan Eich?',
            options: ['Python', 'JavaScript', 'Java', 'C++'],
            correctAnswer: 'JavaScript',
            explanation: 'JavaScript was created by Brendan Eich while working at Netscape in 1995.',
            category: 'Programming',
            difficulty: 'medium',
            points: 20
        },
        {
            id: 3,
            text: 'What is the time complexity of binary search?',
            options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 'O(log n)',
            explanation: 'Binary search has a logarithmic time complexity as it divides the search space in half with each step.',
            category: 'Algorithms',
            difficulty: 'hard',
            points: 30
        }
    ];

    private state = new BehaviorSubject<QuizState>({
        currentQuestionIndex: 0,
        score: 0,
        timeRemaining: this.INITIAL_TIME,
        answers: {},
        isCompleted: false
    });

    getQuestions(): Question[] {
        return this.questions;
    }

    getState(): Observable<QuizState> {
        return this.state.asObservable();
    }

    getCurrentState(): QuizState {
        return this.state.value;
    }

    checkAnswer(question: Question, answer: string): boolean {
        const isCorrect = question.correctAnswer === answer;
        const currentState = this.getCurrentState();

        if (!currentState.answers[question.id]) {
            const timeBonus = Math.floor(currentState.timeRemaining / 2);
            const points = isCorrect ? question.points + timeBonus : 0;

            this.state.next({
                ...currentState,
                score: currentState.score + points,
                answers: { ...currentState.answers, [question.id]: answer }
            });
        }

        return isCorrect;
    }

    nextQuestion() {
        const currentState = this.getCurrentState();
        if (currentState.currentQuestionIndex < this.questions.length - 1) {
            this.state.next({
                ...currentState,
                currentQuestionIndex: currentState.currentQuestionIndex + 1,
                timeRemaining: this.INITIAL_TIME
            });
        } else {
            this.state.next({
                ...currentState,
                isCompleted: true
            });
        }
    }

    restartQuiz() {
        this.state.next({
            currentQuestionIndex: 0,
            score: 0,
            timeRemaining: this.INITIAL_TIME,
            answers: {},
            isCompleted: false
        });
    }

    updateTimer(time: number) {
        const currentState = this.getCurrentState();
        if (!currentState.answers[this.questions[currentState.currentQuestionIndex].id]) {
            this.state.next({
                ...currentState,
                timeRemaining: time
            });
        }
    }
}