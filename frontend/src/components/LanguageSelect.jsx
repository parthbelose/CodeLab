// src/components/LanguageSelect.jsx
import React from 'react';
import { Select } from '@chakra-ui/react';

function LanguageSelect({ selectedLanguage, setLanguage }) {
  const languages = ['javascript', 'python', 'cpp', 'java'];
  
  return (
    <Select
      value={selectedLanguage}
      onChange={(e) => setLanguage(e.target.value)}
      backgroundColor="gray.800"
      color="white"
      border="1px solid #4A5568"
      mb={4}
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </Select>
  );
}

export default LanguageSelect;
