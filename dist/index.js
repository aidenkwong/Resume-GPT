var _a;
import * as dotenv from "dotenv";
import fs from "fs/promises";
import { AxiosError } from "axios";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();
const config = JSON.parse(await fs.readFile("./input/config.json", "utf8"));
const resume = await fs.readFile("./input/resume.txt", "utf8");
const jobDescription = await fs.readFile("./input/job_description.txt", "utf8");
const defaultPrompt = await fs.readFile("./input/default_prompt.txt", "utf8");
const customPrompt = await fs.readFile(`./input/${config.customPromptFilename}`, "utf8");
const prompt = `
Act as applying for a job. This is the resume.
"""
${resume}
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
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
try {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature,
        max_tokens,
    });
    if (response.data.choices[0].text) {
        await fs.writeFile(`./output/${new Date().toISOString()}_cover-letter.txt`, response.data.choices[0].text);
    }
}
catch (error) {
    if (error instanceof AxiosError) {
        console.error((_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
    }
    else {
        console.error(error);
    }
}
