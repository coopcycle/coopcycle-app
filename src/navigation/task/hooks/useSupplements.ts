import { useEffect, useState } from 'react';
import { useGetPricingRuleSetQuery } from '@/src/redux/api/slice';

export const useSupplements = (store) => {
  const [supplements, setSupplements] = useState([]);
  const {
    data: pricingRulesData,
    isLoading: isLoadingPricingRules,
    error: pricingRulesError
  } = useGetPricingRuleSetQuery(store?.pricingRuleSet, {
    skip: !store?.pricingRuleSet
  });

  useEffect(() => {
    if (!pricingRulesData?.rules) {
      setSupplements([]);
      return;
    }
    
    const deliverySupplements = pricingRulesData.rules // ARE THESE THE SUPPLEMENTS?
      .filter((rule) => (rule.target === 'DELIVERY' || rule.target === 'TASK'))
      .map((rule) => ({
        id: rule.id,
        type: rule.id,
        name: rule.name,
        price: rule.price,
        quantity: 0,
        originalRule: rule
      }));
    
    setSupplements(deliverySupplements);
    
  }, [pricingRulesData]);

  return {
    supplements,
    isLoading: isLoadingPricingRules,
    error: pricingRulesError,
    pricingRules: pricingRulesData
  };
};