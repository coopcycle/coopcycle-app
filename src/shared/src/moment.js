// moment-timezone re-exports moment itself, augmented with the `tz` API
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export default moment;
