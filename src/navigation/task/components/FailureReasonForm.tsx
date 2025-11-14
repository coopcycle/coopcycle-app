import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Formik } from "formik";
import { FlatList } from "react-native";

export const FailureReasonForm = ({ data, onChange, parseInitialData }) => {
  return (
    <Formik
      initialValues={parseInitialData(data)}
      // We use validate as a change handler
      validate={values => {
        onChange(values);
      }}
      validateOnBlur={true}
      validateOnChange={true}>
      {({ handleChange, handleBlur, values, errors, setFieldValue }) => (
        <FlatList
          data={_.filter(data, item => item.type !== 'hidden')}
          keyExtractor={item => item.name}
          scrollEnabled={false}
          renderItem={({ item }) => {
            return (
              <FormControl mb="2" key={item.name}>
                <FormControlLabel>
                  <FormControlLabelText>{item.label}</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    defaultValue={item.value.toString()}
                    keyboardType={
                      item.type === 'number' ? 'number-pad' : 'default'
                    }
                    onChangeText={handleChange(item.name)}
                    onBlur={handleBlur(item.name)}
                  />
                </Input>
              </FormControl>
            );
          }}
        />
      )}
    </Formik>
  );
};