const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');
const process = require("process");
const fs = require("fs");

async function run() {
	
	const token = core.getInput('token', {required: true})
	const client = new github.GitHub(token);
	client.repos.getContents({
		owner:	'WiktorJ',
		repo:	'tagging-test',
		path:	'VERSION'
	}).then(result => {
		const sha = result.data.sha
		const version = Buffer.from(result.data.content, 'base64').toString()
		console.log(version)
		const newVersion = semver.inc(version, 'minor')
		console.log(newVersion)
	})
	const GITHUB_EVENT_PATH = process.env.GITHUB_EVENT_PATH;
	if (!GITHUB_EVENT_PATH) {
 	throw new Error("Environment variable GITHUB_EVENT_PATH not set!");
	}

	const eventDataStr = await readFile(GITHUB_EVENT_PATH);
	const eventData = JSON.parse(eventDataStr);
	console.log(eventData)
}

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf8" }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


run()
