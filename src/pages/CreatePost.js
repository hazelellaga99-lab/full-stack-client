import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  let navigate = useNavigate();
  // const { authState } = useContext(AuthContext);

  useEffect(() => {
    // if (authState.status === false) {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [navigate]);

  const initialValues = {
    title: "",
    postText: "",
    // username: "",
  };

  const onSubmit = (data) => {
    // console.log(data);
    // data.username = authState.username; // Set the username to the logged-in user's username
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        // console.log(response);
        navigate("/");
      });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    postText: Yup.string().required("Post text is required"),
    // username: Yup.string().min(3).max(15).required("Username is required"),
  });

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          <Form className="formContainer">
            <label htmlFor="inputCreatePost">Title:</label>
            <ErrorMessage name="title" component="span" />
            <Field
              id="inputCreatePost"
              autoComplete="off"
              name="title"
              placeholder="Title"
            />
            <label htmlFor="inputCreatePostText">Post:</label>
            <ErrorMessage name="postText" component="span" />
            <Field
              id="inputCreatePost"
              autoComplete="off"
              name="postText"
              placeholder="Post Text"
            />
            {/* <label htmlFor="inputCreateUsername">Username:</label>
            <ErrorMessage name="username" component="span" />
            <Field
              id="inputCreatePost"
              autoComplete="off"
              name="username"
              placeholder="Username"
            /> */}
            <button type="submit">Create Post</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreatePost;
