const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');


async function run() {
	const token = core.getInput('repo-token', {required: true})
	const client = new github.GitHub(token);
	client.repos.getContents({
		owner:	'WiktorJ',
		repo:	'tagging-test',
		path:	'VERSION'
	}).then(result => {
		console.log(result)
	})
}

run()
