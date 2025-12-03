import React from 'react';
import { Image } from 'react-native';
import { Box } from '@/components/ui/box';
import { Icon, createIcon } from '@/components/ui/icon';
import Svg, { Path } from 'react-native-svg';
import ConecsIcon from './PaymentMethodIcon/ConecsIcon';
import { CreditCard, Banknote } from 'lucide-react-native';
import { FontAwesome5Brands } from 'react-native-vector-icons/FontAwesome5Brands';

const icons = {
  card: CreditCard,
  cash_on_delivery: Banknote,
};

const PaymentMethodIcon = ({ type }) => {
  if (Object.keys(icons).includes(type)) {
    return <Icon as={icons[type]} className="mr-2" />;
  }

  if (type === 'conecs') {
    return (
      <Icon as={ConecsIcon} size="xl" className="mr-2"/>
    );
  }

  if (type === 'restoflash') {
    return (
      <Box className="mr-2">
        <Image
          resizeMode="contain"
          source={require('../../../../assets/images/restoflash.png')}
          style={{ width: 30, height: 30 }}
        />
      </Box>
    );
  }

  if (type === 'swile') {
    return (
      <Box className="mr-2">
        <Image
          resizeMode="contain"
          source={require('../../../../assets/images/Swile_black.png')}
          style={{ width: 40, height: 40 }}
        />
      </Box>
    );
  }

  if (type === 'edenred' || type === 'edenred+card') {

    const EdenredIcon = createIcon({
      viewBox: '0 0 413.24 265.47',
      x: 0,
      y: 0,
      path: (
        <>
          <Path
            d="M160.43 117.34c-6.79 0-11.1 4.42-12.44 10.28h24.16c-.82-6.47-5.35-10.28-11.72-10.28zM95.86 119.91c-8.64 0-14.09 5.96-14.09 14.29 0 8.23 5.55 14.39 14.09 14.39s14.29-5.86 14.29-14.39c0-8.53-5.76-14.29-14.29-14.29z"
            fill="currentColor"
          />
          <Path
            d="M270.22 106.24c-12.97 0-23.07 5.18-24.72 18.63-.12.01.08 0-.04 0-4.08-60.95-52.16-109.14-114.14-109.14-48.98 0-90.91 30.11-108.35 72.82H64.5l-2.16 13.98H29.75v14.81h29.51L57 130.81H29.75v8.64c0 5.24 2.26 7.71 6.58 7.71h27.86l-2.26 13.98H31.08c-1.5 0-2.93-.14-4.29-.38v.01s-5.34-.58-8.65-4.88c-.08-.1-1.43-1.7-2.09-4.33-.17-.69-.19-.73-.32-1.27.22 1.74.59 4.08.76 4.94.94 4.88 2.13 9.01 2.24 9.3 13.86 49.16 59 85.21 112.59 85.21 54.82 0 101.13-37.71 113.82-88.59h-15.73v-28.58c0-7.71-2.98-12.65-10.59-12.65-7.61 0-10.59 4.94-10.59 12.65v28.58H192.5v-32.49c0-15.53 11.31-22.41 26.32-22.41s26.32 6.89 26.32 22.41l-.01 32.49h15.83v-28.58c0-7.71 2.06-12.65 9.56-12.65 2.37 0 5.24.72 6.27 1.23l2.98-13.78c-1.73-.21-6.15-1.13-9.55-1.13zm-144.24 24.78c0 19.64-11.62 31.15-30.85 31.15-17.79 0-29.82-11.93-29.82-27.97 0-16.76 11.41-27.97 28.48-27.97 7.81 0 13.57 3.08 16.45 6.17V88.55h15.73v42.47zm39.69 19.33c4.63 0 8.91-1.34 12.93-3.19l-1.31 12.44c-4.52 1.85-9.97 2.57-15.42 2.57-18.1 0-30.85-10.59-30.85-28.58 0-15.63 11.41-27.35 28.89-27.35 19.74 0 29.61 12.54 29.2 31.87H148.4c1.54 8.85 9.97 12.24 17.27 12.24zM305.9 106.24c-17.48 0-28.89 11.72-28.89 27.35 0 17.99 12.75 28.58 30.85 28.58 5.45 0 10.9-.72 15.42-2.57l1.31-12.44c-4.01 1.85-8.3 3.19-12.92 3.19-7.3 0-15.73-3.39-17.27-12.24h40.72c.39-19.33-9.48-31.87-29.22-31.87zm-11.93 21.39c1.34-5.86 5.66-10.28 12.44-10.28 6.38 0 10.9 3.8 11.72 10.28h-24.16zM381.78 88.55v23.85c-2.88-3.08-8.64-6.17-16.45-6.17-17.07 0-28.48 11.21-28.48 27.97 0 16.04 12.03 27.97 29.82 27.97 19.23 0 30.85-11.52 30.85-31.15V88.55h-15.74zm-14.4 60.05c-8.53 0-14.09-6.17-14.09-14.39 0-8.33 5.45-14.29 14.09-14.29 8.53 0 14.29 5.76 14.29 14.29.01 8.53-5.75 14.39-14.29 14.39z"
            fill="currentColor"
          />
        </>
      ),
    });

    return (
      <Icon as={EdenredIcon} size="xl" />
    );
  }

  if (type === 'apple_pay') {
    return (
      <Box className="mr-2">
        <Image
          resizeMode="contain"
          source={require('../../../../assets/images/apple-pay.png')}
          style={{ width: 40, height: 40 }}
        />
      </Box>
    );
  }

  if (type === 'google_pay') {
    return (
      <Box className="mr-2">
        <Image
          resizeMode="contain"
          source={require('../../../../assets/images/google-pay.png')}
          style={{ width: 40, height: 40 }}
        />
      </Box>
    );
  }

  return null;
};

export default PaymentMethodIcon;
