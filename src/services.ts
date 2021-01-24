import fetch from "node-fetch";

import { generateRandom } from "./utils";

interface Quiz {
  question: string;
  category: string;
}

interface slackArgs {
  quizs: Quiz[];
}

export const getQuizs = async (): Promise<Quiz[]> => {
  const spreadsheetId: string = process.env.SPREADSHEET_ID || "";

  const graphqlToken: string = process.env.GRAPHQL_SHEET_TOKEN || "";

  const url = `https://api.graphqlsheet.com/api/${spreadsheetId}`;

  const offset = generateRandom(0, 41);

  const header = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: graphqlToken,
    },
    body: JSON.stringify({
      query: `
        {
          get (limit: 2, offset: ${offset}) {
            category
            question
          }
        }
      `,
    }),
  };

  const response = await fetch(url, header);

  const result = await response.json();

  return result.data.get;
};

export const postQuizsToSlack = async ({ quizs }: slackArgs) => {
  if (quizs.length === 0) {
    return {
      status: 200,
      message: "퀴즈가 없습니다",
    };
  }

  const url = process.env.WEBHOOKS_URL || "";

  let question: string = "";

  let message: any = {
    attachments: [],
  };

  quizs.forEach(
    (quiz) => (question += "[" + quiz.category + "] " + quiz.question + "\n")
  );

  message.attachments.push({
    pretext: `🎯 오늘의 Daily Quiz~!  🚀 `,
    fields: [
      {
        type: "mrkdwn",
        title: "🍲 우려먹는 코드숨 React 🎃 ",
        value: question,
      },
    ],
    footer: "Github - codesoom-quiz-bot",
  });

  const header = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  };

  const response = await fetch(url, header);

  return response;
};
