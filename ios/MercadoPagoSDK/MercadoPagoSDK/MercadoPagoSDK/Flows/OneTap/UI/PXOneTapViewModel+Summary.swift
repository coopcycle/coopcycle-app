//
//  PXOneTapViewModel+Summary.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 22/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension PXOneTapViewModel {
    func shouldShowSummaryModal() -> Bool {
        let itemsCount = buildOneTapItemComponents().count
        return itemsCount > 0 || hasDiscount()
    }

    func hasDiscount() -> Bool {
        return amountHelper.discount != nil
    }

    func getSummaryProps() -> [PXSummaryRowProps]? {
        let currency: PXCurrency = SiteManager.shared.getCurrency()
        let itemComponentsModel = buildOneTapItemComponents()

        var props = [PXSummaryRowProps]()
        for itemComponent in itemComponentsModel {
            if let title = itemComponent.getTitle(), let amountPrice = itemComponent.getUnitAmountPrice() {

                var totalAmount: Double = amountPrice
                var titleWithQty = title
                if let qty = itemComponent.props.quantity {
                    if qty > 1 {
                        titleWithQty = "\(qty) \(title)"
                    } else {
                        titleWithQty = "\(title)"
                    }
                    totalAmount = amountPrice * Double(qty)
                }

                let formatedAmount = Utils.getAmountFormatted(amount: totalAmount, thousandSeparator: currency.getThousandsSeparatorOrDefault(), decimalSeparator: currency.getDecimalSeparatorOrDefault(), addingCurrencySymbol: currency.getCurrencySymbolOrDefault(), addingParenthesis: false)
                props.append((title: titleWithQty, subTitle: itemComponent.getDescription(), rightText: formatedAmount, backgroundColor: nil))
            }
        }
        return props
    }
}
