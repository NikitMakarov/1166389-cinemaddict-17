import dayjs from 'dayjs';

// Функция из dayjs для преобразования даты
const humanizeDate = (date, format) => (date && format) ? dayjs(date).format(format) : '';

// Функция для преобразования минут в часы-минуты
const formatRuntime = (runtime) => {
  const minutes = runtime % 60;
  const hours = (runtime - minutes) / 60;
  const output = runtime >= 60 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return output;
};

// Функция сортировки фильмов по дате выпуска
const sortFilmDate = (filmA, filmB) => humanizeDate(filmA.release.date, 'YYYY') - humanizeDate(filmB.release.date, 'YYYY');

// Функция сортировки фильмов по пользовательскому рейтингу
const sortFilmRating = (filmA, filmB) => filmB.totalRating - filmA.totalRating;

export {humanizeDate, formatRuntime, sortFilmDate, sortFilmRating};
