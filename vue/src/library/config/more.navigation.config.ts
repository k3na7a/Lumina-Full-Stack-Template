export type more_navigation = Array<{
  title: string
  children: Array<{ title: string; redirect: string }>
}>

export const MORE_NAVIGATION: more_navigation = [
  {
    title: 'general.general',
    children: [
      { title: 'navigation.subnavigation.about', redirect: 'About' },
      { title: 'navigation.subnavigation.blog', redirect: 'About' },
      { title: 'navigation.subnavigation.developers', redirect: 'About' },
      { title: 'navigation.subnavigation.jobs', redirect: 'About' },
      { title: 'navigation.subnavigation.partners', redirect: 'About' }
    ]
  },
  {
    title: 'general.help&legal',
    children: [
      { title: 'navigation.subnavigation.community', redirect: 'About' },
      { title: 'navigation.subnavigation.cookies', redirect: 'About' },
      { title: 'navigation.subnavigation.help', redirect: 'About' },
      { title: 'navigation.subnavigation.privacy', redirect: 'About' },
      { title: 'navigation.subnavigation.terms', redirect: 'About' }
    ]
  }
]
