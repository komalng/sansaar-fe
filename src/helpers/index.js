export const getInitialsFromName = (name) => {
  console.log(name.split(" "))
  const tokens = name.split(' ').map(t => t[0]);
  console.log(tokens,"token")
  return tokens.join('');
}

export const toTitleCase = (name) => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};