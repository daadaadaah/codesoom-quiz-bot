import { getQuizs } from "./services";

import fetch from "node-fetch";

import { quizs, responseGoogleshet } from "../fixture/data";

jest.mock("node-fetch", () => jest.fn());

test("getQuizs", async () => {
  ((fetch as unknown) as jest.Mock).mockImplementation(() => {
    return {
      async json() {
        return responseGoogleshet;
      },
    };
  });

  const response = await getQuizs();

  expect(response).toEqual(quizs);
});
