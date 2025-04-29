import React, { createContext, useState } from 'react';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [idCourse, setIdCourse] = useState(null);
  return (
    <CourseContext.Provider value={{ idCourse, setIdCourse }}>
      {children}
    </CourseContext.Provider>
  );
};
