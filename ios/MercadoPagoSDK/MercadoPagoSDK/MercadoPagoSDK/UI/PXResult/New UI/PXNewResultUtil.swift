//
//  PXNewResultUtil.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 19/09/2019.
//

import Foundation
import MLBusinessComponents

class PXNewResultUtil {

    //HEADER DATA
    class func getDataForHeaderView(color: UIColor?, title: String, icon: UIImage?, iconURL: String?, badgeImage: UIImage?, closeAction: (() -> Void)?) -> PXNewResultHeaderData {

        return PXNewResultHeaderData(color: color, title: title, icon: icon, iconURL: iconURL, badgeImage: badgeImage, closeAction: closeAction)
    }

    //RECEIPT DATA
    class func getDataForReceiptView(paymentId: String?) -> PXNewCustomViewData? {
        guard let paymentId = paymentId else {
            return nil
        }

        let attributedTitle = NSAttributedString(string: "Operación".localized + " #" + paymentId, attributes: PXNewCustomView.titleAttributes)

        let date = Date()
        let attributedSubtitle = NSAttributedString(string: Utils.getFormatedStringDate(date, addTime: true), attributes: PXNewCustomView.subtitleAttributes)

        let icon = ResourceManager.shared.getImage("receipt_icon")

        let data = PXNewCustomViewData(firstString: attributedTitle, secondString: attributedSubtitle, thirdString: nil, icon: icon, iconURL: nil, action: nil, color: nil)
        return data
    }

    //POINTS DATA
    class func getDataForPointsView(points: PXPoints?) -> MLBusinessLoyaltyRingData? {
        guard let points = points else {
            return nil
        }
        let data = PXRingViewData(points: points)
        return data
    }

    //DISCOUNTS DATA
    class func getDataForDiscountsView(discounts: PXDiscounts?) -> MLBusinessDiscountBoxData? {
        guard let discounts = discounts else {
            return nil
        }
        let data = PXDiscountsBoxData(discounts: discounts)
        return data
    }

    //DISCOUNTS ACCESSORY VIEW
    class func getDataForDiscountsAccessoryViewData(discounts: PXDiscounts?) -> ResultViewData? {
        guard let discounts = discounts else {
            return nil
        }

        let dataService = MLBusinessAppDataService()
        if dataService.isMpAlreadyInstalled() {
            let button = PXOutlinedSecondaryButton()
            button.buttonTitle = discounts.discountsAction.label

            button.add(for: .touchUpInside) {
                //open deep link
                PXDeepLinkManager.open(discounts.discountsAction.target)
                MPXTracker.sharedInstance.trackEvent(path: TrackingPaths.Events.Congrats.getSuccessTapSeeAllDiscountsPath())
            }
            return ResultViewData(view: button, verticalMargin: PXLayout.M_MARGIN, horizontalMargin: PXLayout.L_MARGIN)
        } else {
            let downloadAppDelegate = PXDownloadAppData(discounts: discounts)
            let downloadAppView = MLBusinessDownloadAppView(downloadAppDelegate)
            downloadAppView.addTapAction { (deepLink) in
                //open deep link
                PXDeepLinkManager.open(deepLink)
                MPXTracker.sharedInstance.trackEvent(path: TrackingPaths.Events.Congrats.getSuccessTapDownloadAppPath())
            }
            return ResultViewData(view: downloadAppView, verticalMargin: PXLayout.M_MARGIN, horizontalMargin: PXLayout.L_MARGIN)
        }
    }

    //CROSS SELLING VIEW
    class func getDataForCrossSellingView(crossSellingItems: [PXCrossSellingItem]?) -> [MLBusinessCrossSellingBoxData]? {
        guard let crossSellingItems = crossSellingItems else {
            return nil
        }
        var data = [MLBusinessCrossSellingBoxData]()
        for item in crossSellingItems {
            data.append(PXCrossSellingItemData(item: item))
        }
        return data
    }
}

// MARK: Payment Method Logic
extension PXNewResultUtil {
    //PAYMENT METHOD ICON
    class func getPaymentMethodIcon(paymentMethod: PXPaymentMethod) -> UIImage? {
        let defaultColor = paymentMethod.paymentTypeId == PXPaymentTypes.ACCOUNT_MONEY.rawValue && paymentMethod.paymentTypeId != PXPaymentTypes.PAYMENT_METHOD_PLUGIN.rawValue
        var paymentMethodImage: UIImage? =  ResourceManager.shared.getImageForPaymentMethod(withDescription: paymentMethod.id, defaultColor: defaultColor)
        // Retrieve image for payment plugin or any external payment method.
        if paymentMethod.paymentTypeId == PXPaymentTypes.PAYMENT_METHOD_PLUGIN.rawValue {
            paymentMethodImage = paymentMethod.getImageForExtenalPaymentMethod()
        }
        return paymentMethodImage
    }

    //PAYMENT METHOD DATA
    class func getDataForPaymentMethodView(paymentData: PXPaymentData, amountHelper: PXAmountHelper) -> PXNewCustomViewData? {
        guard let paymentMethod = paymentData.paymentMethod else {
            return nil
        }

        let image = getPaymentMethodIcon(paymentMethod: paymentMethod)
        let currency = SiteManager.shared.getCurrency()

        let firstString: NSAttributedString = getPMFirstString(currency: currency, paymentData: paymentData, amountHelper: amountHelper)
        let secondString: NSAttributedString? = getPMSecondString(paymentData: paymentData)
        let thirdString: NSAttributedString? = getPMThirdString(paymentData: paymentData)

        let data = PXNewCustomViewData(firstString: firstString, secondString: secondString, thirdString: thirdString, icon: image, iconURL: nil, action: nil, color: .white)
        return data
    }

    // PM First String
    class func getPMFirstString(currency: PXCurrency, paymentData: PXPaymentData, amountHelper: PXAmountHelper) -> NSAttributedString {

        let totalAmountAttributes: [NSAttributedString.Key: Any] = [
            NSAttributedString.Key.font: Utils.getSemiBoldFont(size: PXLayout.XS_FONT),
            NSAttributedString.Key.foregroundColor: UIColor.black.withAlphaComponent(0.45)
        ]

        let interestRateAttributes: [NSAttributedString.Key: Any] = [
            NSAttributedString.Key.font: Utils.getSemiBoldFont(size: PXLayout.XS_FONT),
            NSAttributedString.Key.foregroundColor: ThemeManager.shared.noTaxAndDiscountLabelTintColor()
        ]

        let discountAmountAttributes: [NSAttributedString.Key: Any] = [
            NSAttributedString.Key.font: Utils.getSemiBoldFont(size: PXLayout.XS_FONT),
            NSAttributedString.Key.foregroundColor: UIColor.black.withAlphaComponent(0.45),
            NSAttributedString.Key.strikethroughStyle: NSUnderlineStyle.single.rawValue
        ]

        let firstString: NSMutableAttributedString = NSMutableAttributedString()

        if let payerCost = paymentData.payerCost {
            if payerCost.installments > 1 {
                let titleString = String(payerCost.installments) + "x " + Utils.getAmountFormated(amount: payerCost.installmentAmount, forCurrency: currency)
                let attributedTitle = NSAttributedString(string: titleString, attributes: PXNewCustomView.titleAttributes)
                firstString.append(attributedTitle)

                // Installment Rate
                if payerCost.installmentRate == 0.0 {
                    let interestRateString = " " + "Sin interés".localized.lowercased()
                    let attributedInsterest = NSAttributedString(string: interestRateString, attributes: interestRateAttributes)
                    firstString.appendWithSpace(attributedInsterest)
                }

                // Total Amount
                let totalString = Utils.getAmountFormated(amount: payerCost.totalAmount, forCurrency: currency, addingParenthesis: true)
                let attributedTotal = NSAttributedString(string: totalString, attributes: totalAmountAttributes)
                firstString.appendWithSpace(attributedTotal)
            } else {
                let titleString = Utils.getAmountFormated(amount: payerCost.totalAmount, forCurrency: currency)
                let attributedTitle = NSAttributedString(string: titleString, attributes: PXNewCustomView.titleAttributes)
                firstString.append(attributedTitle)
            }
        } else {
            // Caso account money

            if let splitAccountMoneyAmount = paymentData.getTransactionAmountWithDiscount() {
                let string = Utils.getAmountFormated(amount: splitAccountMoneyAmount, forCurrency: currency)
                let attributed = NSAttributedString(string: string, attributes: PXNewCustomView.titleAttributes)
                firstString.append(attributed)
            } else {
                let string = Utils.getAmountFormated(amount: amountHelper.amountToPay, forCurrency: currency)
                let attributed = NSAttributedString(string: string, attributes: PXNewCustomView.titleAttributes)
                firstString.append(attributed)
            }
        }

        // Discount
        if let discount = paymentData.getDiscount(), let transactionAmount = paymentData.transactionAmount {
            let transactionAmount = Utils.getAmountFormated(amount: transactionAmount.doubleValue, forCurrency: currency)
            let attributedAmount = NSAttributedString(string: transactionAmount, attributes: discountAmountAttributes)

            firstString.appendWithSpace(attributedAmount)

            let discountString = discount.getDiscountDescription()
            let attributedString = NSAttributedString(string: discountString, attributes: interestRateAttributes)

            firstString.appendWithSpace(attributedString)
        }

        return firstString
    }

    // PM Second String
    class func getPMSecondString(paymentData: PXPaymentData) -> NSAttributedString? {
        guard let paymentMethod = paymentData.paymentMethod else {
            return nil
        }
        var pmDescription: String = ""
        let paymentMethodName = paymentMethod.name ?? ""

        if paymentMethod.isCard {
            if let lastFourDigits = (paymentData.token?.lastFourDigits) {
                pmDescription = paymentMethodName + " " + "terminada en".localized + " " + lastFourDigits
            }
        } else {
            pmDescription = paymentMethodName
        }

        let attributedSecond = NSMutableAttributedString(string: pmDescription, attributes: PXNewCustomView.subtitleAttributes)
        return attributedSecond
    }

    // PM Third String
    class func getPMThirdString(paymentData: PXPaymentData) -> NSAttributedString? {
        guard let paymentMethod = paymentData.paymentMethod else {
            return nil
        }
        let paymentMethodName = paymentMethod.name ?? ""
        if let issuer = paymentData.getIssuer(), let issuerName = issuer.name, !issuerName.isEmpty, issuerName.lowercased() != paymentMethodName.lowercased() {
            let issuerAttributedString = NSMutableAttributedString(string: issuerName, attributes: PXNewCustomView.subtitleAttributes)
            
            return issuerAttributedString
        }
        return nil
    }
}
