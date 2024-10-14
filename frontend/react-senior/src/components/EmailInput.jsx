// src/components/EmailInput.js
import React, { useState, useEffect } from 'react';

const EmailInput = ({ value, onChange, disabled }) => {
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

//   const validateEmail = (email) => {
//     const regex = /^(19[8-9]\d|20[0-3]\d|2040)\d{0,5}(@stu\.uob\.edu\.bh)?$/;
//     const finalRegex = /^(19[8-9]\d|20[0-3]\d|2040)\d{1,5}@stu\.uob\.edu\.bh$/;

//     if (email === '') {
//       setError('');
//     } else if (!regex.test(email)) {
//       setError('Invalid email format');
//     } else if (finalRegex.test(email)) {
//       setError('');
//     } else {
//       setError('');
//     }
//   };

//   useEffect(() => {
//     if (isTouched) {
//       validateEmail(value);
//     }
//   }, [value, isTouched]);

//   const handleBlur = () => {
//     setIsTouched(true);
//     validateEmail(value);
//   };

  return (
    <div>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e);
        //   if (isTouched) validateEmail(e.target.value);
        }}
        // onBlur={handleBlur}
        className={`w-full mt-6 px-3 py-2 bg-white text-black font-pregular rounded-full border-2 border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:outline-4 ${
          error ? 'ring-2 ring-red-500' : 'focus:ring-secondary'
        }`}
        required
      />
      {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
    </div>
  );
};

export default EmailInput;