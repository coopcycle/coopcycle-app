import { HeaderBackButton } from '@react-navigation/elements';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

const HeaderBackButtonWrapper = props => {
  const { t } = useTranslation();

  let { title, currentRoute, ...otherProps } = props;

  if (currentRoute === 'StoreNewDeliveryAddress') {
    title = t('CANCEL');
  } else {
    title = 'Back';
  }

  return <HeaderBackButton {...otherProps} title={title} />;
};

function mapStateToProps(state) {
  return {
    currentRoute: state.app.currentRoute,
  };
}

export default connect(mapStateToProps)(HeaderBackButtonWrapper);
