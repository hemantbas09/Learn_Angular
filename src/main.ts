import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { SignalComponent } from './pages/signals/signals.component';
import { HighlightDirective } from './pages/directive/tooltip.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SignalComponent, HighlightDirective],
  template: `
    <div class="app">
      <h1 class="app__title">Advanced Quiz App</h1>
      <app-signal></app-signal>
    </div>
    <div highlight>
This is Learnign phase;
    </div>
  `,
  styles: [`
    .app {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;

      &__title {
        text-align: center;
        color: #333;
        margin-bottom: 30px;
        font-size: 2.5em;
      }
    }
  `]
})
export class App {

}

bootstrapApplication(App);