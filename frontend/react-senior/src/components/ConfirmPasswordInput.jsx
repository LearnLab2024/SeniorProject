// src/components/ConfirmPasswordInput.js
import React from 'react';

const ConfirmPasswordInput = ({ value, onChange, placeholder = "Confirm Password" }) => {
  return (
    <div>
      <input
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full mt-2 px-3 py-2 bg-white text-black font-pregular rounded-full border-2 border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:outline-4"
        required
      />
    </div>
  );
};

export default ConfirmPasswordInput;
