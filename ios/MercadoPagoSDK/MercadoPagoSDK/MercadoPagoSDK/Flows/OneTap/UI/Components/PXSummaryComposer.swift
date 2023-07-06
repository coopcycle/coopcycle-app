//
//  PXSummaryComposer.swift
//  MercadoPagoSDK
//
//  Created by Federico Bustos Fierro on 13/05/2019.
//

import UIKit

struct PXSummaryComposer {

    //returns the composed summary items
    var summaryItems: [PXOneTapSummaryRowData] {
        return getSummaryItems()
    }

    // MARK: constants
    let isDefaultStatusBarStyle = ThemeManager.shared.statusBarStyle() == .default
    let currency = SiteManager.shared.getCurrency()
    let textTransparency: CGFloat = 1

    // MARK: initialization properties
    let amountHelper: PXAmountHelper
    let additionalInfoSummary: PXAdditionalInfoSummary?
    let selectedCard: PXCardSliderViewModel?
    let shouldDisplayChargesHelp: Bool

    init(amountHelper: PXAmountHelper,
         additionalInfoSummary: PXAdditionalInfoSummary?,
         selectedCard: PXCardSliderViewModel?,
         shouldDisplayChargesHelp: Bool = false) {
        self.amountHelper = amountHelper
        self.additionalInfoSummary = additionalInfoSummary
        self.selectedCard = selectedCard
        self.shouldDisplayChargesHelp = shouldDisplayChargesHelp
    }

    private func getSummaryItems() -> [PXOneTapSummaryRowData] {
        let summaryItems = generateSummaryItems()
        return summaryItems
    }

    private func generateSummaryItems() -> [PXOneTapSummaryRowData] {
        if selectedCard == nil {
            return getMinimalSummary()
        }

        var internalSummary = [PXOneTapSummaryRowData]()

        if shouldDisplayCharges() || shouldDisplayDiscount() {
            internalSummary.append(purchaseRow())
        }

        if shouldDisplayDiscount() {
            if isConsumedDiscount() {
                internalSummary.append(consumedDiscountRow())
            } else if let discRow = discountRow() {
                internalSummary.append(discRow)
            }
        }

        if shouldDisplayCharges() {
            internalSummary.append(chargesRow())
        }

        internalSummary.append(totalToPayRow())
        return internalSummary
    }

    private func getMinimalSummary() -> [PXOneTapSummaryRowData] {
        return [totalToPayRow()]
    }
}
