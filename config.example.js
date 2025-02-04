/**
 * This file is just an example of the config you need to provide, none of the values present here are real
 */

module.exports = {
  baseUrl: 'https://mydomain.com',
  port: 8080,
  landkidAdmins: ['my-bb-admin-uuid'],
  repoConfig: {
    repoOwner: 'awesome-org',
    repoName: 'cool-thing',
    uuid: '{1b3e3a62-e6ec-4548-94ff-c4db699db0af}', // This is optional but will make development startup faster
  },
  deployment: {
    secret: 'this-is-your-session-secret-key',
    redis: {
      endpoint: '127.0.0.1',
      port: '6379',
    },
    oAuth: {
      key: 'ouath-client-key-from-bitbucket',
      secret: 'ouath-secret-from-bitbucket',
    },
  },
  prSettings: {
    requiredApprovals: 1,
    canApproveOwnPullRequest: true,
    requireClosedTasks: true,
    requireGreenBuild: true,
    allowLandWhenAble: true,
  },
};
