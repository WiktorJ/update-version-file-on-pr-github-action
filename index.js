const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');
const process = require("process");
const fs = require("fs");

async function run() {
	
	const token = core.getInput('token', {required: true})
	const client = new github.GitHub(token);
	const result = await client.repos.getContents({
		owner:	'WiktorJ',
		repo:	'tagging-test',
		path:	'VERSION'
	})

	const version = Buffer.from(result.data.content, 'base64').toString()
	console.log(version)
	const newVersion = semver.inc(version, 'patch')
	console.log(newVersion)

	const GITHUB_EVENT_PATH = process.env.GITHUB_EVENT_PATH;
	if (!GITHUB_EVENT_PATH) {
	throw new Error("Environment variable GITHUB_EVENT_PATH not set!");
	}

	const eventDataStr = await readFile(GITHUB_EVENT_PATH);
	const eventData = JSON.parse(eventDataStr);
//	console.log(eventData);

	const current_branch_version = await client.repos.getContents({
		owner:	'WiktorJ',
		repo:	'tagging-test',
		path:	'VERSION',
		ref: eventData.pull_request.head.ref
	})
	const sha = current_branch_version.data.sha
	const labels = eventData.pull_request.labels
	client.repos.createOrUpdateFile({
		owner:  'WiktorJ',
		repo:   'tagging-test',
		path:   'VERSION',
		message: 'Version updated to: ' + newVersion,
		content: Buffer.from(newVersion).toString('base64'),
		sha: sha,
		branch: eventData.pull_request.head.ref,
		committer: {
			name: 'version_update_action',
			email: 'some@email.com'
		}
	})


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
