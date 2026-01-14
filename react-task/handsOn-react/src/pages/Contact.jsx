import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import Form from "../components/Form";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../redux/formSlice";

function Contact() {
  const { theme } = useContext(ThemeContext);

  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.form.data);

  return (
    <div className="contact-page">
      <h2>Contact Page</h2>
      <p>Theme is: {theme}</p>

      <Form />

      <div className="saved-data">
        
        <h3>User Info List </h3>

        {savedData.length === 0 ? (
          <p>No users saved yet...</p>
        ) : (
          savedData.map((user, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Age:</b> {user.age}</p>
              <p><b>Phone:</b> {user.phone}</p>

              <button
                className="dec-btn"
                onClick={() => dispatch(deleteUser(index))}
              >
                Delete
              </button>

              <hr style={{ margin: "12px 0" }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Contact;
