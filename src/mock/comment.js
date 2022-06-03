import {getRandomInteger} from '../utils/common.js';
import {getLeadingZero} from '../utils/task.js';

export const generateComment = () => (
  {
    filmId: getRandomInteger(0, 5),
    author: 'Stan Lee',
    comment: 'Best film ever',
    date: `${getRandomInteger(2019, 2021)}-${getLeadingZero(getRandomInteger(1, 12))}-${getLeadingZero(getRandomInteger(1, 31))}T11:12:32.554Z`,
    emotion: 'smile'
  }
);
