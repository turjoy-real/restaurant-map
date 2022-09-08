import { useAppSelector } from './hooks';

const useCompanyData = () => {
  const company = useAppSelector((state) => state.Company);
  return company;
};

export default useCompanyData;
