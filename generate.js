#!/bin/env node
async function getIssues() {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
      }
    };
    var request = require('request');
    request('https://api.github.com/repos/lotosbin/lotosbin.github.io/issues?labels=published', options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error || `${response.statusCode}`)
      }
    })
  })
}
async function issueToArticle(issue) {
  var moment = require('moment');
  var fileName = `${moment(issue.created_at).format('YYYY-MM-DD')}-${issue.id}-${issue.title}`
  var title = issue.title;
  var body = issue.body;
  var content = `---
commentId: ${issue.id}
---
  # ${title} \r\n ${body}`
  return { fileName, content }
}
const fs = require('fs');
async function writeArticleToFile(article) {
  return new Promise((resolve, reject) => {
    var filePath = `_posts/${article.fileName}.markdown`;
    fs.writeFile(filePath, `${article.content}`, function (err) {
      if (err) {
        console.log(err);
        reject(err);
        return
      }

      console.log(`generate file ${filePath}`);
      resolve({ filePath })
    });
  })
}
var main = async () => {
  var issues = await getIssues();
  for (i in issues) {
    var issue = issues[i];
    var article = await issueToArticle(issue);
    await writeArticleToFile(article);
  }
}
main()