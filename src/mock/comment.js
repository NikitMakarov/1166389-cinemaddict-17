import {getRandomInteger} from '../utils/common.js';

export const generateComment = () => (
  {
    filmId: getRandomInteger(0, 5),
    author: 'Stan Lee',
    comment: 'Best film ever',
    date: '2021-02-11T11:12:32.554Z',
    emotion: 'smile'
  }
);
