import { postQuizsToSlack, getQuizs } from "./services";

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

test("postQuizsToSlack with quiz", async () => {
  ((fetch as unknown) as jest.Mock).mockReturnValue({
    status: 200,
  });

  const response = await postQuizsToSlack({ quizs });

  expect(response?.status).toEqual(200);
});

test("postQuizsToSlack without quiz", async () => {
  ((fetch as unknown) as jest.Mock).mockReturnValue({
    status: 200,
    message: "퀴즈가 없습니다",
  });

  const response = await postQuizsToSlack({ quizs: [] });

  expect(response).toEqual({
    status: 200,
    message: "퀴즈가 없습니다",
  });
});
