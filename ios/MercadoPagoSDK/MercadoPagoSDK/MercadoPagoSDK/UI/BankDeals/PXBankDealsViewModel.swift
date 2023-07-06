//
//  PXBankDealsViewModel.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 23/4/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXBankDealsViewModel: NSObject {

    let bankDeals: [PXBankDeal]

    public init(bankDeals: [PXBankDeal]) {
        self.bankDeals = bankDeals
        super.init()
    }
}

// MARK: - Logic
extension PXBankDealsViewModel {
    func getAmountOfCells() -> Int {
        return self.bankDeals.count
    }
}

// MARK: - Components builders
extension PXBankDealsViewModel {
    func getBankDealComponentForIndexPath(_ indexPath: IndexPath) -> PXBankDealComponent {
        let bankDeal = bankDeals[indexPath.row]
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

    func getBankDealDetailsViewControllerForIndexPath(_ indexPath: IndexPath) -> UIViewController {
        let bankDeal = bankDeals[indexPath.row]
        let viewModel = PXBankDealDetailsViewModel(bankDeal: bankDeal)
        return PXBankDealDetailsViewController(viewModel: viewModel)
    }
}
