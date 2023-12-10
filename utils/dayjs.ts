import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isToday from 'dayjs/plugin/isToday';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.locale('ru');
dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

export default dayjs;
