import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const MiamiPhoneRegex = /^\+?1?(305|786)\d{7}$/;

const PhoneInput = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setPhoneNumber(inputValue);
    setIsValid(MiamiPhoneRegex.test(inputValue));
  };

  return (
    <TextField
      label="Miami Phone Number"
      value={phoneNumber}
      onChange={handleChange}
      error={!isValid && phoneNumber !== ""}
      helperText={
        isValid ? (
          <span style={{ color: "green" }}>Valid Miami number</span>
        ) : (
          phoneNumber !== "" && (
            <span style={{ color: "red" }}>Invalid Miami number</span>
          )
        )
      }
      fullWidth
    />
  );
};

export default PhoneInput;
