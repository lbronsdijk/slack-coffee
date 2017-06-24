![Slack Coffee Logo](https://d3vv6lp55qjaqc.cloudfront.net/items/1t1Q3Q1g3m2I3H2V0C21/coffee2.png)
========


## Slack Coffee ☕️
Slack Coffee is an app build for Slack channels. It tells you if your coffee is good to go, to hot to drink, or when it becomes a Iced Coffee (before it is to late).

#### Install
Install packages with NPM (or Yarn):
`npm install` or `yarn install`

Setup a `.env` configuration file, which is based on `.env.dist`. Don't forget to set all values.

Run the Slack Coffee server:
`npm dev`

#### Slack command
You need to create your own command within your Slack app to use Slack Coffee. Use `/command/coffee` as endpoint.

When created, you can use the `/coffee` command within a Slack channel everytime you want.

#### Slack notifications
All notifications will be send by default to a pre defined channel called `slack-coffee`. However, you can change this within your `.env` configuration file.

