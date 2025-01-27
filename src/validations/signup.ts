import * as Yup from 'yup'

export const signUpValidataionSchema = Yup.object({
  fullname: Yup.string().required("Required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Required"),
  password: Yup.string()
    .required("Required")
    .min(8, "Password must be more than 8")
    .max(15, "Password should be atleast 15 characters"),
});