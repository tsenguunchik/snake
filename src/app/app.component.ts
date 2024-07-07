import { JsonPipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

enum KEY_CODE {
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

interface Coordinate {
  x: number;
  y: number;
}

const DELTA = 40;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const WIDTH = GRID_WIDTH * DELTA;
const HEIGHT = GRID_HEIGHT * DELTA;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'snake';

  apple: Coordinate = { x: 0, y: 0 };

  snake: Coordinate[] = [
    { x: 0, y: 280 },
    { x: 40, y: 280 },
    { x: 80, y: 280 },
    { x: 120, y: 280 },
  ];
  direction: Direction = Direction.RIGHT;
  playing = true;
  message = '';
  points = 0;

  constructor() {
    this.placeApple();
    setInterval(() => {
      if (!this.playing) {
        return;
      }
      const size = this.snake.length;
      for (let i = 0; i < size - 1; i++) {
        this.snake[i].x = this.snake[i + 1].x;
        this.snake[i].y = this.snake[i + 1].y;
      }
      switch (this.direction) {
        case Direction.RIGHT:
          this.snake[size - 1].x += DELTA;
          break;
        case Direction.LEFT:
          this.snake[size - 1].x -= DELTA;
          break;
        case Direction.UP:
          this.snake[size - 1].y -= DELTA;
          break;
        case Direction.DOWN:
          this.snake[size - 1].y += DELTA;
          break;
      }

      // outside of the grid
      this.checkBorder();

      // hit itself
      this.checkHit();

      // Hit apple
      this.checkApple();
    }, 200);
  }

  checkApple() {
    const last = this.snake[this.snake.length - 1];

    if (last.x === this.apple.x && last.y === this.apple.y) {
      this.snake.unshift({ x: this.snake[0].x, y: this.snake[0].y });
      this.points += 9;
      this.placeApple();
    }
  }

  checkHit() {
    const last = this.snake[this.snake.length - 1];

    if (
      this.snake.find((b) => last !== b && b.x === last.x && b.y === last.y)
    ) {
      this.message = 'You lost';
      this.playing = false;
    }
  }

  checkBorder() {
    const last = this.snake[this.snake.length - 1];

    if (last.x >= WIDTH || last.y >= HEIGHT || last.y < 0 || last.x < 0) {
      this.message = 'You lost';
      this.playing = false;
      return;
    }
  }

  placeApple() {
    console.log('adsfasf');
    while (true) {
      const x = Math.floor(Math.random() * GRID_WIDTH) * DELTA;
      const y = Math.floor(Math.random() * GRID_HEIGHT) * DELTA;

      if (this.snake.find((b) => b.x === x && b.y === y)) {
        continue;
      }
      console.log({ x, y });
      this.apple = { x, y };
      break;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.code) {
      case KEY_CODE.UP_ARROW:
        if (this.direction === Direction.DOWN) break;
        this.direction = Direction.UP;
        break;
      case KEY_CODE.DOWN_ARROW:
        if (this.direction === Direction.UP) break;
        this.direction = Direction.DOWN;
        break;
      case KEY_CODE.LEFT_ARROW:
        if (this.direction === Direction.RIGHT) break;
        this.direction = Direction.LEFT;
        break;
      case KEY_CODE.RIGHT_ARROW:
        if (this.direction === Direction.LEFT) break;
        this.direction = Direction.RIGHT;
        break;
      default:
        break;
    }
  }
}
