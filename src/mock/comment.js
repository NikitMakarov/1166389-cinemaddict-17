import { getRandomInteger } from '../utils.js';

export const generateComment = () => (
  {
    id: `${getRandomInteger(0, 5)}`,
    author: 'Stan Lee',
    comment: 'Best film ever',
    date: '2021-02-11T11:12:32.554Z',
    emotion: 'smile'
  }
);
