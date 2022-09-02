import * as core from "@actions/core";
import * as exec from "@actions/exec";

// steps:
// - uses: actions/checkout@v3
// - uses: actions/setup-node@v1
//   with:
//     always-auth: true
//     node-version: 16.x
//     registry-url: https://npm.pkg.github.com
//     scope: ${{ inputs.scope }}
// - id: publish
//   # this will only run if the PR has been merged and will not run if the PR was closed without being merged
//   if: github.event.pull_request.merged == true
//   run: ${{ github.action_path }}/entrypoint.sh
//   shell: bash
//   env:
//     NODE_AUTH_TOKEN: ${{ inputs.auth-token }}
//     PREFIX: ${{ inputs.version-prefix }}
// - id: release
//   # this will only run if the PR has been merged and will not run if the PR was closed without being merged
//   if: github.event.pull_request.merged == true
//   uses: ncipollo/release-action@v1
//   with:
//     generateReleaseNotes: true
//     tag: ${{ steps.publish.outputs.version }}

export async function run() {
  const prefix = core.getInput("version-prefix");

  // get the new version number
  const {stdout: ls} = await exec.getExecOutput(
    'ls',
    [],
    {ignoreReturnCode: true, silent: true}
  );
  console.log('ls', ls);

  const {stdout: pwd} = await exec.getExecOutput(
    'pwd',
    [],
    {ignoreReturnCode: true, silent: true}
  );
  console.log('pwd', pwd);
  // determine if the new version number is available

  // if it is not available
  // get the previous version number
  // determine whether this was a MAJOR, MINOR, or PATCH bump
  // find the next available version for the given change type

  // publish
  // release
}

run