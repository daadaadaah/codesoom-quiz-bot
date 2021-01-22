import { postQuizsToSlack, getQuizs } from "./services";

(async () => {
  const quizs = await getQuizs();

  const response = await postQuizsToSlack({ quizs });

  if (response?.status !== 200)
    throw new Error("[" + response?.status + "] Slack 전송 실패");

  console.log("✅ 성공적으로 슬랙에 전송되었습니다.");
})().catch((e) => {
  console.log(e);
});
