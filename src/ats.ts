import * as dotenv from "dotenv";
import fs from "fs/promises";
import { AxiosError } from "axios";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

const resume = await fs.readFile("./input/resume.txt", "utf8");
const jobDescription = await fs.readFile("./input/job_description.txt", "utf8");

const prompt = `
Act as an Application Tracking System (ATS).
Compare my resume to the job description and give an overall score.
Resume:
${resume}
------------------------------------------------------------------------------------------------------------------------------Job Description:
${jobDescription}
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
