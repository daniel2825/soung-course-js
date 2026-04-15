import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  Videos: a.customType({
        module_number: a.string(),
        module_title: a.string(),
        content: a.string(),
        banner_video: a.string()
      }),
  SongCourseContent: a
    .model({
      content: a.string(),
      title: a.string(),
      banner_image: a.string(),
      videos: a.ref('Videos').array()
      
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});