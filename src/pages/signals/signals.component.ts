import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { QuizService, Question, QuizState } from './quiz.utilis';


@Component({
    selector: 'app-signal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './signals.component.html',
    styleUrls: ['./signals.component.scss']
})

export class SignalComponent implements OnInit, OnDestroy {
    questions: Question[] = [];
    state: QuizState;
    selectedAnswer = '';
    showFeedback = false;
    isCorrect = false;
    private timerSubscription?: Subscription;
    private stateSubscription?: Subscription;

    constructor(private quizService: QuizService) {
        this.questions = this.quizService.getQuestions();
        this.state = this.quizService.getCurrentState();
    }

    ngOnInit() {
        this.stateSubscription = this.quizService.getState().subscribe(state => {
            this.state = state;
        });
        this.startTimer();
    }

    ngOnDestroy() {
        this.timerSubscription?.unsubscribe();
        this.stateSubscription?.unsubscribe();
    }

    get currentQuestion(): Question {
        return this.questions[this.state.currentQuestionIndex];
    }

    get isAnswered(): boolean {
        return !!this.state.answers[this.currentQuestion.id];
    }

    get isLastQuestion(): boolean {
        return this.state.currentQuestionIndex === this.questions.length - 1;
    }

    get progressPercentage(): number {
        return ((this.state.currentQuestionIndex + 1) / this.questions.length) * 100;
    }

    get correctAnswers(): number {
        return Object.entries(this.state.answers).filter(([_, answer]) =>
            this.questions.find(q => q.id.toString() === _)?.correctAnswer === answer
        ).length;
    }

    get accuracy(): number {
        return Math.round((this.correctAnswers / this.questions.length) * 100);
    }

    checkAnswer(answer: string) {
        if (this.isAnswered) return;

        this.selectedAnswer = answer;
        this.isCorrect = this.quizService.checkAnswer(this.currentQuestion, answer);
        this.showFeedback = true;
    }

    nextQuestion() {
        this.quizService.nextQuestion();
        this.resetQuestion();
        this.startTimer();
    }

    restartQuiz() {
        this.quizService.restartQuiz();
        this.resetQuestion();
        this.startTimer();
    }

    private resetQuestion() {
        this.selectedAnswer = '';
        this.showFeedback = false;
        this.isCorrect = false;
    }

    private startTimer() {
        this.timerSubscription?.unsubscribe();
        this.timerSubscription = interval(1000)
            .pipe(takeWhile(() => this.state.timeRemaining > 0 && !this.isAnswered))
            .subscribe(() => {
                this.quizService.updateTimer(this.state.timeRemaining - 1);
                if (this.state.timeRemaining === 0) {
                    this.checkAnswer('');
                }
            });
    }
}