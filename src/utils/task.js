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

// Функция добавляющая ноль если число однозначное
const getLeadingZero = (number) => (`0${number}`).slice(-2);

// Функция сортировки фильмов по дате выпуска
const sortFilmDate = (filmA, filmB) => new Date(humanizeDate(filmA.release.date, 'YYYY-MM-DD')) - new Date(humanizeDate(filmB.release.date, 'YYYY-MM-DD'));

// Функция сортировки фильмов по пользовательскому рейтингу
const sortFilmRating = (filmA, filmB) => filmB.totalRating - filmA.totalRating;

export {humanizeDate, formatRuntime, getLeadingZero, sortFilmDate, sortFilmRating};
