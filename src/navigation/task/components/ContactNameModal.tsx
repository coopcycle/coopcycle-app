import { Formik } from "formik";
import { View } from "react-native";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import ModalContent from "@/src/components/ModalContent";
import _ from 'lodash';

export const ContactNameModal = ({
  isVisible,
  onSwipeComplete,
  initialValues,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={['up', 'down']}>
      <ModalContent>
        <Box className="p-3">
          <Formik
            initialValues={initialValues}
            validate={values => {
              if (_.isEmpty(values.contactName)) {
                return {
                  contactName: t('STORE_NEW_DELIVERY_ERROR.EMPTY_CONTACT_NAME'),
                };
              }

              return {};
            }}
            onSubmit={onSubmit}
            validateOnBlur={false}
            validateOnChange={false}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <FormControl
                  error={touched.contactName && errors.contactName}
                  style={{ marginBottom: 15 }}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      {t('DELIVERY_DETAILS_RECIPIENT')}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      autoCorrect={false}
                      autoCapitalize="none"
                      autoCompleteType="off"
                      style={{ height: 40 }}
                      returnKeyType="done"
                      onChangeText={handleChange('contactName')}
                      onBlur={handleBlur('contactName')}
                      defaultValue={values.contactName}
                    />
                  </Input>
                </FormControl>
                <Button block onPress={handleSubmit}>
                  <ButtonText>{t('SUBMIT')}</ButtonText>
                </Button>
              </View>
            )}
          </Formik>
        </Box>
      </ModalContent>
    </Modal>
  );
};