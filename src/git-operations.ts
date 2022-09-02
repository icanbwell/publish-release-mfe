import { exec } from "@actions/exec";

const git = async (args?: string[]) => {
    return await exec('git', args);
};