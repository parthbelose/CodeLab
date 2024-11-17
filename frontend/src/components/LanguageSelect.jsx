import React from "react";
import { Select } from "@chakra-ui/react";

const LanguageSelect = ({ selectedLanguage, setLanguage }) => (
  <Select
    value={selectedLanguage}
    onChange={(e) => setLanguage(e.target.value)}
    bg="gray.800"
    color="white"
    borderColor="#4A5568"
    mb={4}
  >
    {["javascript", "python", "cpp", "java"].map((lang) => (
      <option key={lang} value={lang}>
        {lang}
      </option>
    ))}
  </Select>
);

export default LanguageSelect;
