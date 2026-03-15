import bcrypt from 'bcrypt';

export const hashValue = async (value: string, saltsRounds: number = 10): Promise<string> => {
  const salt = await bcrypt.genSalt(saltsRounds);
  return bcrypt.hash(value, salt);
};

export const compareHashValue = async (value: string, hashValue: string): Promise<boolean> => {
  return await bcrypt.compare(value, hashValue);
};
