//
//  OneTapFlow.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 09/05/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class OneTapFlow: NSObject, PXFlow {
    var model: OneTapFlowModel
    let pxNavigationHandler: PXNavigationHandler

    weak var resultHandler: PXOneTapResultHandlerProtocol?

    let advancedConfig: PXAdvancedConfiguration

    init(checkoutViewModel: MercadoPagoCheckoutViewModel, search: PXInitDTO, paymentOptionSelected: PaymentMethodOption?, oneTapResultHandler: PXOneTapResultHandlerProtocol) {
        pxNavigationHandler = checkoutViewModel.pxNavigationHandler
        resultHandler = oneTapResultHandler
        advancedConfig = checkoutViewModel.getAdvancedConfiguration()
        model = OneTapFlowModel(checkoutViewModel: checkoutViewModel, search: search, paymentOptionSelected: paymentOptionSelected)
        super.init()
        model.oneTapFlow = self
    }

    func update(checkoutViewModel: MercadoPagoCheckoutViewModel, search: PXInitDTO, paymentOptionSelected: PaymentMethodOption?) {
        model = OneTapFlowModel(checkoutViewModel: checkoutViewModel, search: search, paymentOptionSelected: paymentOptionSelected)
        model.oneTapFlow = self
    }

    deinit {
        #if DEBUG
        print("DEINIT FLOW - \(self)")
        #endif
    }

    func setPaymentFlow(paymentFlow: PXPaymentFlow) {
        model.paymentFlow = paymentFlow
    }

    func start() {
        executeNextStep()
    }

    func executeNextStep() {
        switch self.model.nextStep() {
        case .screenReviewOneTap:
            self.showReviewAndConfirmScreenForOneTap()
        case .screenSecurityCode:
            self.showSecurityCodeScreen()
        case .serviceCreateESCCardToken:
            self.getTokenizationService().createCardToken()
        case .screenKyC:
            self.showKyCScreen()
        case .payment:
            self.startPaymentFlow()
        case .finish:
            self.finishFlow()
        }
        print("")
    }

    func refreshInitFlow(cardId: String) {
        resultHandler?.refreshInitFlow(cardId: cardId)
    }

    // Cancel one tap and go to checkout
    func cancelFlow() {
        model.search.deleteCheckoutDefaultOption()
        resultHandler?.cancelOneTap()
    }

    // Cancel one tap and go to checkout
    func cancelFlowForNewPaymentSelection() {
        model.search.deleteCheckoutDefaultOption()
        resultHandler?.cancelOneTapForNewPaymentMethodSelection()
    }

    // Finish one tap and continue with checkout
    func finishFlow() {
        if let paymentResult = model.paymentResult {
            resultHandler?.finishOneTap(paymentResult: paymentResult, instructionsInfo: model.instructionsInfo, pointsAndDiscounts: model.pointsAndDiscounts)
        } else if let businessResult = model.businessResult {
            resultHandler?.finishOneTap(businessResult: businessResult, paymentData: model.paymentData, splitAccountMoney: model.splitAccountMoney, pointsAndDiscounts: model.pointsAndDiscounts)
        } else {
            resultHandler?.finishOneTap(paymentData: model.paymentData, splitAccountMoney: model.splitAccountMoney, pointsAndDiscounts: model.pointsAndDiscounts)
        }
    }

    // Exit checkout
    func exitCheckout() {
        resultHandler?.exitCheckout()
    }

    func setCustomerPaymentMethods(_ customPaymentMethods: [CustomerPaymentMethod]?) {
        model.customerPaymentOptions = customPaymentMethods
    }

    func needSecurityCodeValidation() -> Bool {
        model.readyToPay = true
        return model.nextStep() == .screenSecurityCode
    }
}

extension OneTapFlow {
    /// Returns a auto selected payment option from a paymentMethodSearch object. If no option can be selected it returns nil
    ///
    /// - Parameters:
    ///   - search: payment method search item
    /// - Returns: selected payment option if possible
    static func autoSelectOneTapOption(search: PXInitDTO, customPaymentOptions: [CustomerPaymentMethod]?, amountHelper: PXAmountHelper) -> PaymentMethodOption? {
        var selectedPaymentOption: PaymentMethodOption?
        if search.hasCheckoutDefaultOption() {
            // Check if can autoselect customer card
            guard let customerPaymentMethods = customPaymentOptions else {
                return nil
            }

            if let suggestedAccountMoney = search.oneTap?.first?.accountMoney {
                selectedPaymentOption = suggestedAccountMoney
            } else if let firstPaymentMethodId = search.oneTap?.first?.paymentMethodId {
                let customOptionsFound = customerPaymentMethods.filter { return $0.getPaymentMethodId() == firstPaymentMethodId }
                if let customerPaymentMethod = customOptionsFound.first {
                    // Check if one tap response has payer costs
                    if let expressNode = search.getPaymentMethodInExpressCheckout(targetId: customerPaymentMethod.getId()).expressNode,
                        let selected = selectPaymentMethod(expressNode: expressNode, customerPaymentMethod: customerPaymentMethod, amountHelper: amountHelper) {
                        selectedPaymentOption = selected
                    }
                }
            }
        }
        return selectedPaymentOption
    }

    static func selectPaymentMethod(expressNode: PXOneTapDto, customerPaymentMethod: CustomerPaymentMethod, amountHelper: PXAmountHelper) -> PaymentMethodOption? {

        // payment method id and payment type id must coincide between the express node and the customer payment method to continue
        if expressNode.paymentMethodId != customerPaymentMethod.getPaymentMethodId() ||
            expressNode.paymentTypeId != customerPaymentMethod.getPaymentTypeId() {
            return nil
        }

        var selectedPaymentOption: PaymentMethodOption?
        // the selected payment option is a one tap card, therefore has the required node and has related payer costs
        if let expressPaymentMethod = expressNode.oneTapCard, amountHelper.paymentConfigurationService.getSelectedPayerCostsForPaymentMethod(expressPaymentMethod.cardId) != nil {
            selectedPaymentOption = customerPaymentMethod
        }

        // the selected payment option is the credits option
        if expressNode.oneTapCreditsInfo != nil {
            selectedPaymentOption = customerPaymentMethod
        }
        return selectedPaymentOption
    }

    func getCustomerPaymentOption(forId: String) -> PaymentMethodOption? {
        guard let customerPaymentMethods = model.customerPaymentOptions else {
            return nil
        }
        let customOptionsFound = customerPaymentMethods.filter { return $0.id == forId }
        return customOptionsFound.first
    }
}
