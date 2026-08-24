import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SignupFormData {
  name: string;
  email: string;
  password: "";
  confirmPassword: "";
  terms: boolean;
}

const initialState: SignupFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const signupFormSlice = createSlice({
  name: "signupForm",
  initialState,
  reducers: {
    setSignupFormData: (state, action: PayloadAction<Partial<SignupFormData>>) => {
      return { ...state, ...action.payload };
    },
    clearSignupFormData: () => {
      return initialState;
    },
  },
});

export const { setSignupFormData, clearSignupFormData } = signupFormSlice.actions;
export default signupFormSlice.reducer;
