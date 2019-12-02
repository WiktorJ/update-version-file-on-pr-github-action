const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');


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
}

run()
