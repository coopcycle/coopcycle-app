//
//  PXInstallments+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 30/07/2018.
//

import Foundation

internal extension PXInstallment {
    func numberOfPayerCostToShow(_ maxNumberOfInstallments: Int = 0) -> Int {
        var count = 0
        if maxNumberOfInstallments == 0 {
            return self.payerCosts.count
        }
        for pc in payerCosts {
            if pc.installments > maxNumberOfInstallments {
                return count
            }
            count += 1
        }
        return count
    }

    func containsInstallment(_ installment: Int) -> PXPayerCost? {
        for pc in payerCosts where pc.installments == installment {
            return pc
        }
        return nil
    }
}
