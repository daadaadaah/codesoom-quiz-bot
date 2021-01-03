import * as core from '@actions/core' 

import slack from './lib/slack'

import fetch from "node-fetch";
import { generateRandom } from "./utils";

(async () => {

  const spreadsheetId: string = process.env.SPREADSHEET_ID || '';

  const graphqlToken: string = process.env.GRAPHQL_SHEET_TOKEN || '';

  const offset = generateRandom(0, 41);

  const response = await fetch(`https://api.graphqlsheet.com/api/${spreadsheetId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': graphqlToken,
    },
    body: JSON.stringify({
      query: `
        {
          get (limit: 3, offset: ${offset}) {
            category
            question
          }
        }
      `
    })
  });

  const responseJSON = await response.json();

  const { get } = responseJSON.data;

  
  const WEBHOOKS = process.env.WEBHOOKS_URL;
  
  if(null == WEBHOOKS) throw new Error("⚠️ Github Secrets 에서 WEBHOOK 등록여부를 확인해주세요")

  const webhookList = WEBHOOKS.split(",")

  webhookList.map(async url => {

      // Slack webhook
      if(url.includes('hooks.slack.com')) {   
        await slack({
            data: get,
            url,
        })
        console.log("✅ 성공적으로 슬랙에 전송되었습니다")
      }
  })  

})().catch(e => {
  console.log(e)
  // core.setFailed(e)
})
