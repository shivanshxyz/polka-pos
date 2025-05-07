import { redirect } from 'react-router';

export const loader = () => {
  return redirect('/');
};

export default function Home() {
  return null;
} 