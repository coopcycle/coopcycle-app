//
//  PXBankDealDetailsViewModel.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 24/4/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXBankDealDetailsViewModel: NSObject {

    let bankDeal: PXBankDeal

    public init(bankDeal: PXBankDeal) {
        self.bankDeal = bankDeal
        super.init()
    }

}

// MARK: - Getters
extension PXBankDealDetailsViewModel {
    func getLegalsText() -> String? {
        return bankDeal.legals
    }
}

// MARK: - Components builders
extension PXBankDealDetailsViewModel {
    func getBankDealComponent() -> PXBankDealComponent {
        let imageUrl = bankDeal.picture?.url
        let placeholder = bankDeal.issuer?.name

        var subtitle = ""
        if let dateString = Utils.getShortFormatedStringDate(bankDeal.dateExpired) {
            let expirationDateFormat = "bank_deal_details_date_format".localized
            subtitle = String(format: expirationDateFormat, dateString).replacingOccurrences(of: "{0}", with: dateString)
        }

        let props = PXBankDealComponentProps(imageUrl: imageUrl, placeholder: placeholder, title: bankDeal.recommendedMessage, subtitle: subtitle)
        let component = PXBankDealComponent(props: props)
        return component
    }
}
