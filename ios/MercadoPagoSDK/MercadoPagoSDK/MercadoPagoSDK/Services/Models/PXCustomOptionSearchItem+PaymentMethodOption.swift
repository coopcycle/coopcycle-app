//
//  PXCustomOptionSearchItem+PaymentMethod.swift
//  MercadoPagoSDK
//
//  Created by Federico Bustos Fierro on 06/02/2019.
//

import UIKit

extension PXCustomOptionSearchItem: PaymentMethodOption {
    func getId() -> String {
        return self.id
    }

    func getDescription() -> String {
        return self._description ?? ""
    }

    func getComment() -> String {
        return self.comment ?? ""
    }

    func hasChildren() -> Bool {
        return false
    }

    func getChildren() -> [PaymentMethodOption]? {
        return nil
    }

    func isCard() -> Bool {
        return false
    }

    func isCustomerPaymentMethod() -> Bool {
        return true
    }

    func getPaymentType() -> String {
        return self.paymentTypeId ?? self.id
    }
}
