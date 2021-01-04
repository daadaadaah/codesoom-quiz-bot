import axios from "axios";

interface Contents {
  _id: string;
  title: string;
  link: string;
  date: Date;
  description: string;
  author: string;
  imgUrl: string;
  tags: [string];
  count: string;
  question: string;
  category: string;
}

interface slackArgs {
  data: Contents[];
  url: string;
}

export default async ({ data, url }: slackArgs) => {
  const today = new Date()
    .toLocaleDateString()
    .replace(/\. /g, "-")
    .replace(".", "");
  const count = data.length;
  let question: string = "";

  let message: any = {
    attachments: [],
  };

  data.forEach(function (item) {
    question += "[" + item.category + "] " + item.question + "\n";
  });

  if (count <= 0) {
    return;
  }

  message.attachments.push({
    pretext: `🎯 오늘의 Daily Quiz~!  🚀 `,

    fields: [
      {
        type: "mrkdwn",
        title: "🍿 함수맛 어디까지 봐봤닝? 🍜 ",
        value: question,
      },
    ],
    footer: "Github - codesoom-quiz-bot",
  });

  await axios.post(url, message);
};
