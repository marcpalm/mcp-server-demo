import { Octokit } from "octokit";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN environment variable is required");
}

// Create and export the Octokit client
export const octokit: Octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
