export const generateRandom = (min: number, max: number): number => {
  const ranNum = Math.floor(Math.random()*(max-min+1)) + min;
  return ranNum;  
}

