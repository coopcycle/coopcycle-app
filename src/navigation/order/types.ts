import { DateOnlyString } from '../../utils/date-types';

export interface RouteType {
  route: {
    params: {
      orderNumber: string | number;
      isFromCourier: boolean;
      orderDate?: DateOnlyString;
      taskIds?: Array<number>;
    }
  };
}
