import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Функция из dayjs для преобразования даты
const humanizeDate = (date, format) => dayjs(date).format(format);

// Функция для преобразования минут в часы-минуты
const formatRuntime = (runtime) => {
  const minutes = runtime % 60;
  const hours = (runtime - minutes) / 60;
  const output = runtime >= 60 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return output;
};


export {getRandomInteger, humanizeDate, formatRuntime};
