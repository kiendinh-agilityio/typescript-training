import { fetchAndRenderTeachers } from '@/utils';

// Define eventLoaderTeacher function with TypeScript type annotation
export const eventLoaderTeacher: () => void = () => {
  fetchAndRenderTeachers();
};
