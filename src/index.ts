import * as dotenv from "dotenv";
import fs from "fs/promises";
import { AxiosError } from "axios";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

export interface Config {
  useInfoFile: boolean;
  infoFile: string;
  isDefaultPrompt: boolean;
  customPromptFilename: string;
}

const config: Config = JSON.parse(
  await fs.readFile("./input/config.json", "utf8")
);
const useInfoFile = config.useInfoFile;
const resumeOrInfo = useInfoFile
  ? await fs.readFile("./input/info.txt", "utf8")
  : await fs.readFile("./input/resume.txt", "utf8");
const jobDescription = await fs.readFile("./input/job_description.txt", "utf8");
const defaultPrompt = await fs.readFile("./input/default_prompt.txt", "utf8");
const customPrompt = await fs.readFile(
  `./input/${config.customPromptFilename}`,
  "utf8"
);

const prompt = `
Act as applying for a job. 
${useInfoFile ? "Below is the information about me" : "This is my resume"}
"""
${resumeOrInfo}
"""
This is the job description.
"""
${jobDescription}
"""
${config.isDefaultPrompt ? defaultPrompt : customPrompt}
`;
const temperature = 0;
const max_tokens = 500;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);
try {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature,
    max_tokens
  });
  if (response.data.choices[0].text) {
    await fs.writeFile(
      `./output/${new Date().toISOString()}_cover-letter.txt`,
      response.data.choices[0].text
    );
  }
} catch (error: unknown) {
  if (error instanceof AxiosError) {
    console.error(error.response?.data);
  } else {
    console.error(error);
  }
}
