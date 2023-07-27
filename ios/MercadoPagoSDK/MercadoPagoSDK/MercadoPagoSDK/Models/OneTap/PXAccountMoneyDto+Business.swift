//
//  PXAccountMoneyDto+Business.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 12/12/18.
//

import Foundation

/// :nodoc:
extension PXAccountMoneyDto: PaymentMethodOption {

    func getPaymentType() -> String {
        return PXPaymentTypes.ACCOUNT_MONEY.rawValue
    }

    func getId() -> String {
        return PXPaymentTypes.ACCOUNT_MONEY.rawValue
    }

    func getDescription() -> String {
        if let desc = sliderTitle {
            return desc
        }
        return ""
    }

    func getComment() -> String {
        return ""
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
        return false
    }
}
