import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

const getClient = () => {
  const token = core.getInput("github-token");
  return github.getOctokit(token);
};

const getVersion = async (ref?: string): Promise<string> => {
  const octokit = getClient();
  const owner = 'icanbwell'; // TODO: replace this with the appropriate environment variable
  const repo = 'tommy-mfe-release'; // TODO: replace this with the appropriate environment variable

  const packageJson = await octokit.rest.repos.getContent({
    headers: {
      accept: 'application/vnd.github.VERSION.raw'
    },
    owner,
    path: 'package.json',
    repo,
    ref
  });

  return '' + JSON.parse(packageJson.data.toString())?.version;
};

const queryTag = async (tag: string) => {
  const owner = 'icanbwell'; // TODO: replace this with the appropriate environment variable
  const repo = 'tommy-mfe-release'; // TODO: replace this with the appropriate environment variable
  const octokit = getClient();

  const result = await octokit.rest.git.getRef({
    owner,
    ref: `tags/${tag}`,
    repo
  });
  return result.status === 200 ? tag : undefined;
};

/**
 * Determines the next available semver version number.  Compares the version from the target branch
 * with the proposed new version to infer the change type (MAJOR, MINOR, PATCH).  If the two versions
 * differ in more than one "type" category then an exception is thrown.
 * @param oldVersion The version in the target branch.
 * @param newVersion The version the developer is proposing.
 * @throws Will throw an exception if the two version numbers represent incompatible change types.
 */
const calculateNextVersion = (previousVersion: string, newVersion: string) => {
  const newPieces = newVersion.split('.');
  const previousPieces = previousVersion.split('.');
  let incremented = false;

  const incrementer = (a: number, b: number) => {
    if (a === b) {
      return a;
    }

    if (!incremented) {
      incremented = true;
      return Math.max(a, b) + 1;
    }

    throw new Error('Incompatible change types detected.');
  };

  const major = incrementer(+previousPieces[0], +newPieces[0]);
  const minor = incrementer(+previousPieces[1], +newPieces[1]);
  const patch = incrementer(+previousPieces[2], +newPieces[2]);

  return `${major}.${minor}.${patch}`;
};

export async function run() {
  const prefix = core.getInput('version-prefix') || 'v';
  //   const repo = core.getInput("repository"); // TODO: replace this with the appropriate environment variable
  //   const token = core.getInput("github-token"); // TODO: replace this with the appropriate environment variable
  const octokit = getClient();

  // get the new version number
  let newVersion = await getVersion('TECHX-540');

  // determine if the new version number is available
  const tag = await queryTag(`${prefix}${newVersion}`);

  // if it is not available
  if (tag) {
    // get the previous version number
    const previousVersion = await getVersion('main');
    newVersion = calculateNextVersion(previousVersion, newVersion);
  }

  console.log(`The new version will be ${newVersion}`);

  // publish
  // release
}

run();
