import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid2, Box, MenuItem, Typography } from "@mui/material";
import { getStateAbbreviation, states, formatBirthDate, getStateName } from "../../utils";
import { createClaimantContactInfo } from "../../api/claimantApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { setContactInfo } from "../../redux/slices/claimantSlice";

const ContactInfoForm = () => {
  const dispatch = useDispatch();
  const contactInfo = useSelector((state) => state.claimant.contactInfo);
  const matterNumber = useSelector((state) => state.claimant.matterNumber);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: contactInfo.email || "",
      mobile: contactInfo.mobile || "",
      street: contactInfo.street || "",
      city: contactInfo.city || "",
      state: getStateName(contactInfo.state) || "",
      zip: contactInfo.zip || "",
      DOB: formatBirthDate(contactInfo.DOB) || "",
      matter: matterNumber,
    },
  });

  const submitForm = async (data) => {
    let stateAbbreviation = getStateAbbreviation(data.state);
    data.state = stateAbbreviation;
    dispatch(setContactInfo(data));
    let contactInfoResponse = await createClaimantContactInfo(data);
    console.log(contactInfoResponse);
  };

  return (
    <Box className="breakpoint-main-container">
      <Typography variant="h4" sx={{mb: "0.5em"}}>Contact Info</Typography>
      <form onSubmit={handleSubmit(submitForm)}>
        <Grid2 container spacing={2}>
          {/* Email Field */}
          <Grid2 item xs={12}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: "Email is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid2>

          {/* Mobile Field */}
          <Grid2 item xs={12}>
            <Controller
              name="mobile"
              control={control}
              defaultValue=""
              rules={{ required: "Mobile number is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Mobile"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid2>

          {/* Street Field */}
          <Grid2 item xs={12}>
            <Controller
              name="street"
              control={control}
              defaultValue=""
              rules={{ required: "Street address is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Street"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid2>

          {/* City Field */}
          <Grid2 item xs={12} sm={6}>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{ required: "City is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid2>

          {/* State Dropdown Field */}
          <Grid2 item xs={12} sm={3}>
            <Controller
              name="state"
              control={control}
              defaultValue=""
              rules={{ required: "State is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  label="State"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                >
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid2>

          {/* ZIP Code Field */}
          <Grid2 item xs={12} sm={3}>
            <Controller
              name="zip"
              control={control}
              defaultValue=""
              rules={{ required: "ZIP code is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="ZIP Code"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid2>

          {/* Date of Birth Field */}
          <Grid2 item xs={12}>
            <Controller
              name="DOB"
              control={control}
              defaultValue=""
              rules={{ required: "Date of Birth is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid2>

          {/* Submit Button */}
          <Grid2 item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
};

export default ContactInfoForm;
