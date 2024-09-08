import { JobSeeker } from './types';

// Function to count based on column and value
export const countByColumn = (data: JobSeeker[], column: keyof JobSeeker, value: string) => {
  return data.filter(item => item[column] === value).length;
};

// Function to filter by multiple conditions
export const countByConditions = (data: JobSeeker[], conditions: Array<[keyof JobSeeker, string]>) => {
  return data.filter(item =>
    conditions.every(([column, value]) => item[column] === value)
  ).length;
};
