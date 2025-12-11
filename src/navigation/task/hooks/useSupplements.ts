import { useEffect, useState } from 'react';
import { useGetPricingRuleSetQuery } from '@/src/redux/api/slice';
import { PricingRule, Store } from '@/src/redux/api/types';

export type SupplementWithQuantity = PricingRule & {
  quantity: number;
};

export const useSupplements = (store?: Store) => {
  const [supplements, setSupplements] = useState<SupplementWithQuantity[]>([]);
  const {
    data: pricingRulesData,
    isLoading: isLoadingPricingRules,
    error: pricingRulesError,
  } = useGetPricingRuleSetQuery(store?.pricingRuleSet, {
    skip: !store?.pricingRuleSet,
  });

  useEffect(() => {
    if (!pricingRulesData?.rules) {
      setSupplements([]);
      return;
    }

    const deliverySupplements = pricingRulesData.rules
      .filter(rule => rule.expression === 'false')
      .map(
        rule =>
          ({
            ...rule,
            quantity: 0,
          }) as SupplementWithQuantity,
      );

    setSupplements(deliverySupplements);
  }, [pricingRulesData]);

  return {
    supplements,
    isLoading: isLoadingPricingRules,
    error: pricingRulesError,
    pricingRules: pricingRulesData,
  };
};
