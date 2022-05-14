import { getRandomInteger } from '../utils.js';

export const generateFilm = () => ({
  id: getRandomInteger(0, 5),
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
    date: '1933-12-15T00:00:00.000Z',
    releaseCountry: 'United States'
  },
  runtime: getRandomInteger(54, 180),
  genres: [
    'Western'
  ],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.'
});
