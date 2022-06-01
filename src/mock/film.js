import {getRandomInteger} from '../utils/common.js';
import {getLeadingZero} from '../utils/task.js';
import {nanoid} from 'nanoid';

export const generateFilm = () => ({
  id: nanoid(),
  comments: [1, 2, 4],
  title: 'Sagebrush Trail',
  alternativeTitle: 'An Innocent Man',
  totalRating: `${getRandomInteger(1, 9)}.${getRandomInteger(1, 9)}`,
  poster: 'images/posters/sagebrush-trail.jpg',
  ageRating: 14,
  director: 'Armand Schaefer',
  writers: [
    'Paul Malvern',
    'Trem Carr'
  ],
  actors: [
    'John Wayne'
  ],
  release: {
    date: `${getRandomInteger(1920, 1960)}-${getLeadingZero(getRandomInteger(1, 12))}-${getLeadingZero(getRandomInteger(1, 31))}T00:00:00.000Z`,
    releaseCountry: 'United States'
  },
  runtime: getRandomInteger(54, 180),
  genres: [
    'Western'
  ],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  isWatchList: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1)),
});
