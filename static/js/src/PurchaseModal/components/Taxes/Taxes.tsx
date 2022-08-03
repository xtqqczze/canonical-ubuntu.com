import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Field, Form, useFormikContext } from "formik";
import {
  Row,
  Col,
  Select,
  Input,
  ActionButton,
} from "@canonical/react-components";
import { FormValues, getLabel } from "advantage/subscribe/react/utils/utils";
import {
  caProvinces,
  countries,
  USStates,
  vatCountries,
} from "advantage/countries-and-states";

const Taxes = () => {
  const {
    errors,
    touched,
    values,
    setFieldValue,
  } = useFormikContext<FormValues>();

  const [isEditing, setIsEditing] = useState(!values.country);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const validateRequired = (value: string) => {
    let errorMessage;
    if (!value) {
      errorMessage = "This field is required.";
    }
    return errorMessage;
  };

  const validateUSState = (value: string) => {
    let errorMessage;
    if (!value && values.country === "US") {
      errorMessage = "This field is required.";
    }
    return errorMessage;
  };

  const validatecaProvince = (value: string) => {
    let errorMessage;
    if (!value && values.country === "CA") {
      errorMessage = "This field is required.";
    }
    return errorMessage;
  };

  const onCaptchaChange = (value: string | null) => {
    setFieldValue("captchaValue", value);
  };

  useEffect(() => {
    if (!vatCountries.includes(values.country ?? "")) {
      setFieldValue("VATNumber", "");
    }
    if (values.country !== "US") {
      setFieldValue("usState", "");
    }
    if (values.country !== "CA") {
      setFieldValue("caProvince", "");
    }
  }, [values.country]);

  const displayMode = (
    <>
      <Col size={4}>
        <p>Your country:</p>
      </Col>
      <Col size={8}>
        <p>
          <strong>{getLabel(values.country ?? "", countries)}</strong>
        </p>
      </Col>
      {values.usState ? (
        <>
          <Col size={4}>
            <p>Your state:</p>
          </Col>
          <Col size={8}>
            <p>
              <strong>{getLabel(values.usState, USStates)}</strong>
            </p>
          </Col>
        </>
      ) : null}
      {values.caProvince ? (
        <>
          <Col size={4}>
            <p>Your province:</p>
          </Col>
          <Col size={8}>
            <p>
              <strong>{getLabel(values.caProvince, caProvinces)}</strong>
            </p>
          </Col>
        </>
      ) : null}
      <Col size={4}>
        <p>VAT number:</p>
      </Col>
      <Col size={8}>
        <p>
          <strong>{values.VATNumber ? values.VATNumber : "None"}</strong>
        </p>
      </Col>
    </>
  );

  const editMode = (
    <>
      <Field
        as={Select}
        id="country"
        name="country"
        options={countries}
        label="Country/Region:"
        stacked
        required
        validate={validateRequired}
        error={touched?.country && errors?.country}
      />
      {values.country === "US" && (
        <Field
          as={Select}
          id="usStates"
          name="usState"
          options={USStates}
          label="State:"
          stacked
          required
          validate={validateUSState}
          error={touched?.usState && errors?.usState}
        />
      )}
      {values.country === "CA" && (
        <Field
          as={Select}
          id="caProvinces"
          name="caProvince"
          options={caProvinces}
          label="Province:"
          stacked
          required
          validate={validatecaProvince}
          error={touched?.caProvince && errors?.caProvince}
        />
      )}
      {vatCountries.includes(values.country ?? "") && (
        <Field
          as={Input}
          type="text"
          id="VATNumber"
          name="VATNumber"
          label="VAT number:"
          stacked
          help="e.g. GB 123 1234 12 123 or GB 123 4567 89 1234"
          error={touched?.VATNumber && errors?.VATNumber}
        />
      )}
    </>
  );

  return (
    <Row>
      {isEditing ? editMode : displayMode}
      <div className="u-align--right">
        <ActionButton onClick={toggleEditing}>
          {isEditing ? "Save" : "Edit"}
        </ActionButton>
      </div>
      <ReCAPTCHA
        sitekey={process.env.CAPTCHA_TESTING_API_KEY ?? ""}
        onChange={onCaptchaChange}
      />
    </Row>
  );
};

export default Taxes;
