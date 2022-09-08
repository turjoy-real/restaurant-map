import { useAppSelector } from './hooks';

const useAuthData = () => {
  const auth = useAppSelector((state) => state.Auth);
  return auth;
};

export default useAuthData;
