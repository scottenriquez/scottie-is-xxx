---
title: Fantasy Football Power Rankings Markdown Generator
date: "2020-08-21T22:12:03.284Z"
description: "A CLI for creating posts for my league's fantasy football site."
tag: "Programming"
---

## Overview

`spr` is a CLI tool for generating Markdown pages in the [league Gatsby site](https://www.thewinnerisatryhard.org) for power rankings posts with Sleeper data injected. The source code is hosted on [GitHub](https://github.com/the-winner-is-a-tryhard/power-rankings-markdown-cli).

## Build Status

[![Azure Pipelines](https://dev.azure.com/scottenriquez/Sleeper%20Power%20Rankings%20Markdown%20CLI/_apis/build/status/the-winner-is-a-tryhard.power-rankings-markdown-cli?branchName=master)](https://dev.azure.com/scottenriquez/Sleeper%20Power%20Rankings%20Markdown%20CLI/_build/latest?definitionId=5&branchName=master)

## Installation and Dependencies

Clone the repository, install NPM dependencies, and create a symlink in the global folder.

```shell
git clone git@github.com:the-winner-is-a-tryhard/power-rankings-markdown-cli.git
cd power-rankings-markdown-cli
npm install
npm link
spr --version
```

The CLI source code doesn't store any secrets, so ensure that the AWS CLI is installed and that the credentials are configured at `~/.aws/credentials`.

```shell
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

If not, run `aws configure`.

## Usage

Navigate to the root folder of the league's Gatsby site, and run `spr add <WEEK_NUMBER> <AUTHOR_FIRST_NAME>`. The alias for `add` is `a`. Open the generated `index.md` file in the newly created directory (`<FIRST_NAME>-week-<WEEK_NUMBER>-power-rankings/`) to enter the power rankings text for the new post.

## Functionality

- Validates the week number and author first name
- Checks the current Git branch to ensure that the user has created a non-main branch
- Verifies that the present working directory contains a Gatsby configuration file to standardize the relative paths
- Fetches the league members and rosters from the Sleeper API
- Fetches the current avatar for each league member and copies to a CDN hosted in AWS
- Generates Markdown power rankings with the member's latest stats neatly formatted
- Creates a new directory for the post in the Gatsby website and writes the `index.md` file

## Configuration

The league-specific details exist in various JavaScript configuration files to maximize reusability. While the CLI is tightly-coupled with Gatsby, there's still much that can be reconfigured for other leagues.

### `/lib/config/gatsby.js`

```javascript
const gatsby = {
  // used to determine if the user created a new branch
  mainBranchName: "master",
  // used to determine if the user is in the root Gatsby directory
  configFileName: "gatsby-config.js",
  // used to support any changes to the default blog path for vanity URLs
  postPath: "/content/blog/posts",
  // used to defer image styling for the avatar to the Gatsby site
  avatarHTMLClass: "sleeper-avatar",
}
```

### `/lib/config/aws.js`

```javascript
const awsConfig = {
  // S3 bucket
  bucketName: "twiath-site-cdn",
  // URL base to be used for source in <img> tag
  cdnURLBase: "https://d1yqxti3jheii7.cloudfront.net",
}
```

### `/lib/config/league.js`

```javascript
const league = {
  // Sleeper league ID number
  id: "541384381865115648",
}
```

### `/lib/config/validAuthors.js`

```javascript
const authors = {
  Scottie: "Scottie Enriquez",
  Callen: "Callen Trail",
  Logan: "Logan Richardson",
  Carl: "Carl Meziere",
  Andrew: "Andrew Carlough",
  John: "John Yarrow",
  Matt: "Matt Kniowski",
  Chris: "Chris Ramsey",
  Caleb: "Caleb Trantow",
  Travis: "Travis James",
  Trond: "Trond Liu",
  Mark: "Mark Hamilton",
}
```

### `/lib/config/validWeeks.js`

```javascript
const weeks = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
}
```
