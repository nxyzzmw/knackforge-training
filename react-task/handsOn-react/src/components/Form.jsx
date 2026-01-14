import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveForm, clearForm } from "../redux/formSlice";

function Form() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = "Age must be between 1 and 120";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    dispatch(saveForm(formData));
    alert("Saved!");

    setFormData({
      name: "",
      email: "",
      age: "",
      phone: "",
    });

    setErrors({});
  }

  function handleClear() {
    dispatch(clearForm());

    setFormData({
      name: "",
      email: "",
      age: "",
      phone: "",
    });

    setErrors({});
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>User Information</h3>

      <label>Name</label>
      <br />
      <input
        type="text"
        name="name"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <p className="error-text">{errors.name}</p>}
      <br />

      <label>Email</label>
      <br />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <p className="error-text">{errors.email}</p>}
      <br />

      <label>Age</label>
      <br />
      <input
        type="number"
        name="age"
        placeholder="Enter age"
        value={formData.age}
        onChange={handleChange}
      />
      {errors.age && <p className="error-text">{errors.age}</p>}
      <br />

      <label>Phone</label>
      <br />
      <input
        type="tel"
        name="phone"
        placeholder="Enter phone"
        value={formData.phone}
        onChange={handleChange}
      />
      {errors.phone && <p className="error-text">{errors.phone}</p>}
      <br />

      <button className="todo-btn" type="submit">
        Submit
      </button>

      <button
        className="todo-btn"
        type="button"
        onClick={handleClear}
        style={{ marginLeft: "10px" }}
      >
        Clear All
      </button>
    </form>
  );
}

export default Form;
