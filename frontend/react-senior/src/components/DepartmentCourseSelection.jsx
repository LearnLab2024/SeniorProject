import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests

const DepartmentCourseSelection = ({ onSelect }) => {
  const [courseId, setCourseId] = useState('');
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/courses') 
      .then((response) => {
        console.log(response.data);
        setCourseOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleSelect = () => {
    onSelect(courseId);
  };

  return (
    <div>
        <div>
          <label htmlFor="courseId" className="font-pmedium text-gray-100 block mb-2">
            Course ID
          </label>
          <select
            id="courseId"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full px-3 py-2 bg-black-200 text-white font-pregular rounded focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          >
            <option value="">Select Course ID</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
    
      <button
        onClick={handleSelect}
        className="w-80 mx-8 py-2 bg-gradient-to-r from-button-from to-button-to text-black font-psemibold border-2 border-secondary rounded-full hover:opacity-90 transition duration-300 flex items-center justify-center"
      >
        Select
      </button>
    </div>
  );
};

export default DepartmentCourseSelection;
