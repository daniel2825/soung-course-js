import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'SongCourseContent',
  access: (allow) => ({
    'images/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  }),
});