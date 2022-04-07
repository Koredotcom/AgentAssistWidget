import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

export const fadeInOutAnimation = [trigger(
  'fadeInOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('0.5s ease-out',
          style({ opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('0.5s ease-in',
          style({ opacity: 0 }))
      ]
    )
  ]
)
];


export const fadeInAnimation = [trigger(
  'fadeInAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('0.5s ease-out',
          style({ opacity: 1 }))
      ]
    )
  ]
)
];

export const fadeOutAnimation = [trigger(
  'fadeOutAnimation',
  [
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('0.5s ease-in',
          style({ opacity: 0 }))
      ]
    )
  ]
)
];