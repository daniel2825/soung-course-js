import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  SongCourseContent: a
    .model({
      banner_image: a.string(),
      title: a.string()
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});