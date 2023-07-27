//
//  PXSummaryComposer+Utils.swift
//  MercadoPagoSDK
//
//  Created by Federico Bustos Fierro on 14/05/2019.
//

import Foundation

extension PXSummaryComposer {
    // MARK: business
    func isConsumedDiscount() -> Bool {
        if let discountData = getDiscountData() {
            return discountData.discountConfiguration.getDiscountConfiguration().isNotAvailable
        }
        return false
    }

    func getConsumedDiscountReason() -> String? {
        guard let discountData = getDiscountData() else {
            return nil
        }
        return discountData.discountConfiguration.getDiscountConfiguration().reason?.summary?.message
    }

    func shouldDisplayChargeHelpIcon() -> Bool {
        return shouldDisplayChargesHelp
    }

    func getDiscount() -> PXDiscount? {
        if let discountData = getDiscountData() {
            return discountData.discountConfiguration.getDiscountConfiguration().discount
        }
        return nil
    }

    func shouldDisplayCharges() -> Bool {
        return getChargesAmount() > 0
    }

    func getChargesAmount() -> Double {
        return amountHelper.chargeRuleAmount
    }

    func shouldDisplayDiscount() -> Bool {
        return getDiscountData() != nil
    }

    func getDiscountData() -> (discountConfiguration: PXDiscountConfiguration, campaign: PXCampaign)? {
        if let discountConfiguration = amountHelper.paymentConfigurationService.getDiscountConfigurationForPaymentMethodOrDefault(selectedCard?.cardId),
            let campaign = discountConfiguration.getDiscountConfiguration().campaign {
            return (discountConfiguration, campaign)
        }
        return nil
    }

    // MARK: style
    func summaryColor() -> UIColor {
        return isDefaultStatusBarStyle ? UIColor.black : ThemeManager.shared.whiteColor()
    }

    func yourPurchaseSummaryTitle() -> String {
        return additionalInfoSummary?.purpose ?? "onetap_purchase_summary_title".localized
    }

    func yourPurchaseToShow() -> String {
        return Utils.getAmountFormated(amount: amountHelper.preferenceAmount, forCurrency: currency)
    }

    func discountColor() -> UIColor {
        return isDefaultStatusBarStyle ? ThemeManager.shared.noTaxAndDiscountLabelTintColor() : ThemeManager.shared.whiteColor()
    }

    func helpIcon(color: UIColor, alpha: CGFloat = 1) -> UIImage? {
        var helperImage: UIImage? =  ResourceManager.shared.getImage("helper_ico_light")
        helperImage = helperImage?.mask(color: color)?.alpha(alpha)
        return helperImage
    }
}
