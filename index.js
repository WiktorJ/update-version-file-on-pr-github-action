const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');


async function run() {
	
	//const token = core.getInput('github-token', {required: true})
	const client = new github.GitHub(process.env.GITHUB_TOKEN!);
	client.repos.getContents({
		owner:	'WiktorJ',
		repo:	'tagging-test',
		path:	'VERSION'
	}).then(result => {
		console.log(result)
	})
}

run()
