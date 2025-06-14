const getAvatar = (first: string, last: string) => {
  return `https://ui-avatars.com/api/?name=${[first, last].join('+')}`
}

export default getAvatar
