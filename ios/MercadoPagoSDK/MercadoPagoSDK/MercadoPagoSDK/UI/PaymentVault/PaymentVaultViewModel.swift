//
//  PaymentVaultViewModel.swift
//  MercadoPagoSDK
//
//  Created by Valeria Serber on 6/12/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PaymentVaultViewModel: NSObject {

    internal var amountHelper: PXAmountHelper
    var groupName: String?
    var email: String
    var paymentMethodOptions: [PaymentMethodOption]
    var customerPaymentOptions: [CustomerPaymentMethod]?
    var paymentMethods: [PXPaymentMethod]!
    var defaultPaymentOption: PXPaymentMethodSearchItem?
    var disabledOption: PXDisabledOption?

    var displayItems = [PaymentOptionDrawable]()
    var currency: PXCurrency = SiteManager.shared.getCurrency()

    var customerId: String?

    var mercadoPagoServicesAdapter: MercadoPagoServicesAdapter!
    let advancedConfiguration: PXAdvancedConfiguration

    internal var isRoot = true

    init(amountHelper: PXAmountHelper, paymentMethodOptions: [PaymentMethodOption], customerPaymentOptions: [CustomerPaymentMethod]?, paymentMethods: [PXPaymentMethod], groupName: String? = nil, isRoot: Bool, email: String, mercadoPagoServicesAdapter: MercadoPagoServicesAdapter, callbackCancel: (() -> Void)? = nil, advancedConfiguration: PXAdvancedConfiguration, disabledOption: PXDisabledOption?) {
        self.amountHelper = amountHelper
        self.email = email
        self.groupName = groupName
        self.paymentMethodOptions = paymentMethodOptions
        self.customerPaymentOptions = customerPaymentOptions
        self.paymentMethods = paymentMethods
        self.isRoot = isRoot
        self.mercadoPagoServicesAdapter = mercadoPagoServicesAdapter
        self.advancedConfiguration = advancedConfiguration
        self.disabledOption = disabledOption
        super.init()
        self.populateDisplayItemsDrawable()
    }
}

// MARK: Logic
extension PaymentVaultViewModel {

    func shouldGetCustomerCardsInfo() -> Bool {
       return false
    }

    func hasAccountMoneyIn(customerOptions: [PXCardInformation]) -> Bool {
        for paymentOption: PXCardInformation in customerOptions {
            if paymentOption.getPaymentMethodId() == PXPaymentTypes.ACCOUNT_MONEY.rawValue {
                return true
            }
        }
        return false
    }

    func hasOnlyGroupsPaymentMethodAvailable() -> Bool {
        return (self.paymentMethodOptions.count == 1 && Array.isNullOrEmpty(self.customerPaymentOptions))
    }

    func hasOnlyCustomerPaymentMethodAvailable() -> Bool {
        return Array.isNullOrEmpty(self.paymentMethodOptions) && !Array.isNullOrEmpty(self.customerPaymentOptions) && self.customerPaymentOptions?.count == 1
    }

    func getPaymentMethodOption(row: Int) -> PaymentOptionDrawable? {
        if displayItems.indices.contains(row) {
            return displayItems[row]
        }
        return nil
    }

    func getDiscountInfo(row: Int) -> String? {
        if let paymentOption = getPaymentMethodOption(row: row) {
            let discountInfo = amountHelper.paymentConfigurationService.getDiscountInfoForPaymentMethod(paymentOption.getId())
            return discountInfo
        }
        return nil
    }

    func getCreditsInfo(row: Int) -> String? {
        if let paymentOption = getPaymentMethodOption(row: row) {
            let creditsInfo = amountHelper.paymentConfigurationService.getCreditsInfoForPaymentMethod(paymentOption.getId())
            return creditsInfo
        }
        return nil
    }

}

// MARK: Disabled methods
extension PaymentVaultViewModel {
    func isPMDisabled(paymentMethodId: String?) -> Bool {
        guard let disabledOption = disabledOption else {return false}
        return disabledOption.isPMDisabled(paymentMethodId: paymentMethodId)
    }

    func isCardIdDisabled(cardId: String?) -> Bool {
        guard let disabledOption = disabledOption else {return false}
        return disabledOption.isCardIdDisabled(cardId: cardId)
    }

    func getDisabledCardID() -> String? {
        return disabledOption?.getDisabledCardId()
    }
 }

// MARK: Drawable Builders
extension PaymentVaultViewModel {

    fileprivate func populateDisplayItemsDrawable() {

        var topPluginsDrawable = [PaymentOptionDrawable]()
        var bottomPluginsDrawable = [PaymentOptionDrawable]()
        var customerPaymentOptionsDrawable = [PaymentOptionDrawable]()
        var paymentOptionsDrawable = [PaymentOptionDrawable]()

        // Populate customer payment options.
        customerPaymentOptionsDrawable = buildCustomerPaymentOptionsAsDrawable()

        // Populate payment methods search items.
        paymentOptionsDrawable = buildPaymentMethodSearchItemsAsDrawable()

        // Fill displayItems
        displayItems.append(contentsOf: topPluginsDrawable)
        displayItems.append(contentsOf: customerPaymentOptionsDrawable)
        displayItems.append(contentsOf: paymentOptionsDrawable)
        displayItems.append(contentsOf: bottomPluginsDrawable)
    }

    fileprivate func buildCustomerPaymentOptionsAsDrawable() -> [PaymentOptionDrawable] {
        var returnDrawable = [PaymentOptionDrawable]()
        let customerPaymentMethodsCount = getCustomerPaymentMethodsToDisplayCount()
        if customerPaymentMethodsCount > 0 {
            for customerPaymentMethodIndex in 0...customerPaymentMethodsCount - 1 {
                if let customerPaymentOptions = customerPaymentOptions, customerPaymentOptions.indices.contains(customerPaymentMethodIndex) {
                    let customerPaymentOption = customerPaymentOptions[customerPaymentMethodIndex]

                    let disablePM = isPMDisabled(paymentMethodId: customerPaymentOption.getPaymentMethodId())
                    let disableCC = isCardIdDisabled(cardId: customerPaymentOption.getCardId())
                    let disableCustomerOption = disablePM || disableCC
                    if disableCustomerOption {
                        customerPaymentOption.setDisabled(true)
                    }
                    returnDrawable.append(customerPaymentOption)
                }
            }
        }
        //this line brings the disabled option to the last position in the payment method array
        returnDrawable = returnDrawable.sorted(by: { return $1.isDisabled() })
        return returnDrawable
    }

    fileprivate func buildPaymentMethodSearchItemsAsDrawable() -> [PaymentOptionDrawable] {
        var returnDrawable = [PaymentOptionDrawable]()
        for targetPaymentMethodOption in paymentMethodOptions {
            if let targetPaymentOptionDrawable = targetPaymentMethodOption as? PaymentOptionDrawable {
                returnDrawable.append(targetPaymentOptionDrawable)
            }
        }
        return returnDrawable
    }
}

// MARK: Counters
extension PaymentVaultViewModel {

    func getDisplayedPaymentMethodsCount() -> Int {
        return displayItems.count
    }

    func getCustomerPaymentMethodsToDisplayCount() -> Int {
        if !Array.isNullOrEmpty(customerPaymentOptions) && self.isRoot {
            guard let realCount = self.customerPaymentOptions?.count else {
                return 0
            }
            return realCount
        }
        return 0
    }
}
