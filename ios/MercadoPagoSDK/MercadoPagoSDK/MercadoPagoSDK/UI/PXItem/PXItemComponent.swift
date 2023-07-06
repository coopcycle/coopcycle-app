//
//  PXItemComponent.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 3/1/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

class PXItemComponent: PXComponentizable {

    public func render() -> UIView {
        return PXItemRenderer().render(self)
    }

    var props: PXItemComponentProps

    init(props: PXItemComponentProps) {
        self.props = props
    }
}

// MARK: Getters/ Setterss
extension PXItemComponent {
    func shouldShowTitle() -> Bool {
        return !String.isNullOrEmpty(props.title)
    }

    func getTitle() -> String? {
        return props.title
    }

    func shouldShowDescription() -> Bool {
        return !String.isNullOrEmpty(props.description)
    }

    func getDescription() -> String? {
        return props.itemDescription
    }

    func shouldShowQuantity() -> Bool {
        guard let quantity = props.quantity else {
            return false
        }
        return quantity > 0
    }

    func getQuantity() -> String? {
        guard let quantity = props.quantity?.stringValue else {
            return nil
        }
        return "\(props.quantityTitle) \(quantity)"
    }

    func shouldShowUnitAmount() -> Bool {

        return props.unitAmount != nil
    }

    func getUnitAmountTitle() -> String? {
        return props.amountTitle
    }

    func getUnitAmountPrice() -> Double? {
        return props.unitAmount
    }
}
