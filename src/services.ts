import fetch from "node-fetch";

import { generateRandom } from "./utils";

interface Quiz {
  question: string;
  category: string;
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
