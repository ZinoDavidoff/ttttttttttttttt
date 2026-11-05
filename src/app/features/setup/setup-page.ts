import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { oppositeMark } from '../../core/game/game-engine';
import { GAME_COUNT_OPTIONS, GameCount, Mark, MARKS } from '../../core/models/tournament';
import { TournamentSandbox } from '../../core/sandbox/tournament';
import { distinctNamesValidator } from './validators/distinct-names';
import { notBlankValidator } from './validators/not-blank';

const NAME_MAX_LENGTH = 16;

@Component({
  selector: 'app-setup-page',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './setup-page.html',
  styleUrl: './setup-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupPage {
  readonly sandbox = inject(TournamentSandbox);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly marks = MARKS;
  protected readonly gameCounts = GAME_COUNT_OPTIONS;
  protected readonly nameMaxLength = NAME_MAX_LENGTH;

  protected readonly form = this.fb.group(
    {
      playerOneName: ['', [notBlankValidator, Validators.maxLength(NAME_MAX_LENGTH)]],
      playerOneMark: this.fb.control<Mark>('X'),
      playerTwoName: ['', [notBlankValidator, Validators.maxLength(NAME_MAX_LENGTH)]],
      totalGames: this.fb.control<GameCount>(3, Validators.required),
    },
    { validators: distinctNamesValidator('playerOneName', 'playerTwoName') },
  );

  protected readonly controls = this.form.controls;

  /** Player 2 always gets the mark Player 1 did not choose. */
  protected readonly playerTwoMark$ = this.controls.playerOneMark.valueChanges.pipe(
    startWith(this.controls.playerOneMark.value),
    map(oppositeMark),
  );

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { playerOneName, playerOneMark, playerTwoName, totalGames } = this.form.getRawValue();
    this.sandbox.startTournament({
      players: [
        { name: playerOneName.trim(), mark: playerOneMark },
        { name: playerTwoName.trim(), mark: oppositeMark(playerOneMark) },
      ],
      totalGames,
    });
  }
}
