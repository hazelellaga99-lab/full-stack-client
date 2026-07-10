import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../helpers/AuthContext";

function Registration() {
  let navigate = useNavigate();
  // const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth").then((response) => {
      if (!response.data.error) {
        navigate("/");
      }
    });
  }, [navigate]);

  const initialValues = {
    username: "",
    password: "",
  };

  const onSubmit = (data) => {
    // console.log(data);
    axios.post("http://localhost:3001/auth", data).then((response) => {
      console.log(response);
      navigate("/");
    });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required("Username is required"),
    password: Yup.string().min(4).max(20).required("Password is required"),
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          <Form className="formContainer">
            <label htmlFor="inputCreateUsername">Username:</label>
            <ErrorMessage name="username" component="span" />
            <Field
              id="inputCreatePost"
              autoComplete="off"
              name="username"
              placeholder="Username"
            />
            <label htmlFor="inputCreatePassword">Password:</label>
            <ErrorMessage name="password" component="span" />
            <Field
              id="inputCreatePost"
              autoComplete="off"
              name="password"
              placeholder="Password"
              type="password"
            />
            <button type="submit">Register</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Registration;
