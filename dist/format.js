var _a;
import * as dotenv from "dotenv";
import fs from "fs/promises";
import { AxiosError } from "axios";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();
const resume = await fs.readFile("./input/resume.txt", "utf8");
const prompt = `
"""
${resume}
"""



This above is my resume. Return a well formatted version of it.
`;
const temperature = 0;
const max_tokens = 3000;
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
        await fs.writeFile(`./output/${new Date().toISOString()}_formatted_resume_text.txt`, response.data.choices[0].text);
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
