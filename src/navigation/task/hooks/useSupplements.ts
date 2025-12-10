import { useEffect, useState } from 'react';
import { useGetPricingRuleSetQuery } from '@/src/redux/api/slice';
import { PricingRule, Store } from '@/src/redux/api/types';

type SupplementWithQuantity = {
  id: number;
  type: number;
  name: string;
  price: string;
  quantity: number;
  originalRule: PricingRule;
};

export const useSupplements = (store?: Store) => {
  const [supplements, setSupplements] = useState<SupplementWithQuantity[]>([]);
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

    const deliverySupplements = pricingRulesData.rules
      .filter((rule) => rule.expression === 'false')
      .map((rule) => ({
        id: rule.id,
        type: rule.id,
        name: rule.name,
        price: rule.price,
        quantity: 0,
        originalRule: rule
      } as SupplementWithQuantity));

    setSupplements(deliverySupplements);

  }, [pricingRulesData]);

  return {
    supplements,
    isLoading: isLoadingPricingRules,
    error: pricingRulesError,
    pricingRules: pricingRulesData
  };
};
