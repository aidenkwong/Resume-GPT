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
const info = await fs.readFile("./input/resume.txt", "utf8");
const jobDescription = await fs.readFile("./input/job_description.txt", "utf8");

const prompt = `
"""
${info}
"""
The above is my personal information and below is the job description.
"""
${jobDescription}
"""
Based on the things in common in my personal information and the job description, write a resume for me. Don't include things that doesn't exist in my information.
`;
const temperature = 1;
const max_tokens = 2048;

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
