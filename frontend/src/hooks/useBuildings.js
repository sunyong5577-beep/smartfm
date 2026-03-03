import { useQuery } from 'react-query';
import { getBuildings, getBuildingStats } from '../services/buildingService';

export const useBuildings = (params) => {
  return useQuery(['buildings', params], () => getBuildings(params).then(r => r.data), {
    keepPreviousData: true,
  });
};

export const useBuildingStats = () => {
  return useQuery('buildingStats', () => getBuildingStats().then(r => r.data));
};
