import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Heading, Grid, Button, Flex } from '@chakra-ui/react';
import CodeEditor from './components/CodeEditor';
import OutputScreen from './components/OutputScreen';
import InputScreen from './components/InputScreen';
import LanguageSelect from './components/LanguageSelect';
import ProblemStatement from './components/ProblemStatement';
import WhiteBoard from './components/WhiteBoard';
import axios from 'axios';

function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [problem, setProblem] = useState('');
  const [socket, setSocket] = useState(null);

  // Component visibility states
  const [isWhiteBoardVisible, setIsWhiteBoardVisible] = useState(true);
  const [isProblemStatementVisible, setIsProblemStatementVisible] = useState(true);


  const runCode = async () => {
    
    try {
      const response = await axios.post(
        'http://localhost:3000/editor/executecode',{
          code,language,input
        }
      );
      console.log(response.data);
      setOutput(response.data.stdout)
    } catch (error) {
      console.error(error);
    }
  };

  const generateCode = async () => {
    try {
      const response = await axios.post("http://localhost:3000/editor/generateCode", {
        problem: problem,
        code: code,
      });
      setCode(response.data.code);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.900" color="gray.300" p={6}>
        <Heading mb={6} textAlign="center" color="white">
          CodeLab
        </Heading>

        <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
          {/* Problem Statement with Toggle */}
          <Box>
            <Flex justify="space-between" align="center" mb={2}>
              <Heading size="md">Problem Statement</Heading>
              <Button size="sm" onClick={() => setIsProblemStatementVisible(!isProblemStatementVisible)}>
                {isProblemStatementVisible ? 'Minimize' : 'Show'}
              </Button>
            </Flex>
            {isProblemStatementVisible && <ProblemStatement problem={problem} setProblem={setProblem} />}
          </Box>

          {/* Whiteboard with Toggle */}
          <Box>
            <Flex justify="space-between" align="center" mb={2}>
              <Heading size="md">Whiteboard</Heading>
              <Button size="sm" onClick={() => setIsWhiteBoardVisible(!isWhiteBoardVisible)}>
                {isWhiteBoardVisible ? 'Minimize' : 'Show'}
              </Button>
            </Flex>
            {isWhiteBoardVisible && <WhiteBoard />}
          </Box>
        </Grid>

        <Grid templateColumns="1fr 1fr" gap={6}>
          <Box>
            <Heading size="md" mb={2}>Code Editor</Heading>
            <LanguageSelect selectedLanguage={language} setLanguage={setLanguage} />
            <CodeEditor language={language} code={code} setCode={setCode} />
            <Flex justify="space-between" mt={4}>
              <Button colorScheme="teal" onClick={runCode}>Run Code</Button>
              <Button colorScheme="blue" onClick={generateCode}>Generate Code</Button>
            </Flex>
          </Box>

          <Box>
            <Heading size="md" mb={2}>Input</Heading>
            <InputScreen input={input} setInput={setInput} />
            <Heading size="md" mt={6} mb={2}>Output</Heading>
            <OutputScreen output={output} />
          </Box>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;