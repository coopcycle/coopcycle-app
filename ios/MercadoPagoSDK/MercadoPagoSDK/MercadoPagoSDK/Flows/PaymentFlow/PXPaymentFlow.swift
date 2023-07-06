//
//  PaymentFlow.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 26/06/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal final class PXPaymentFlow: NSObject, PXFlow {
    let model: PXPaymentFlowModel
    weak var resultHandler: PXPaymentResultHandlerProtocol?
    weak var paymentErrorHandler: PXPaymentErrorHandlerProtocol?

    var pxNavigationHandler: PXNavigationHandler

    init(paymentPlugin: PXSplitPaymentProcessor?, mercadoPagoServicesAdapter: MercadoPagoServicesAdapter, paymentErrorHandler: PXPaymentErrorHandlerProtocol, navigationHandler: PXNavigationHandler, amountHelper: PXAmountHelper, checkoutPreference: PXCheckoutPreference?, escManager: MercadoPagoESC?) {
        model = PXPaymentFlowModel(paymentPlugin: paymentPlugin, mercadoPagoServicesAdapter: mercadoPagoServicesAdapter, escManager: escManager)
        self.paymentErrorHandler = paymentErrorHandler
        self.pxNavigationHandler = navigationHandler
        self.model.amountHelper = amountHelper
        self.model.checkoutPreference = checkoutPreference
    }

    func setData(amountHelper: PXAmountHelper, checkoutPreference: PXCheckoutPreference, resultHandler: PXPaymentResultHandlerProtocol) {
        self.model.amountHelper = amountHelper
        self.model.checkoutPreference = checkoutPreference
        self.resultHandler = resultHandler

        if let discountToken = amountHelper.paymentConfigurationService.getAmountConfigurationForPaymentMethod(amountHelper.getPaymentData().token?.cardId)?.discountToken, amountHelper.splitAccountMoney == nil {
            self.model.amountHelper?.getPaymentData().discount?.id = discountToken.stringValue
            self.model.amountHelper?.getPaymentData().campaign?.id = discountToken
        }
    }

    func setProductIdForPayment(_ productId: String) {
        model.productId = productId
    }

    deinit {
        #if DEBUG
            print("DEINIT FLOW - \(self)")
        #endif
    }

    func start() {
        executeNextStep()
    }

    func executeNextStep() {
        switch self.model.nextStep() {
        case .createDefaultPayment:
            createPayment()
        case .createPaymentPlugin:
            createPaymentWithPlugin(plugin: model.paymentPlugin)
        case .createPaymentPluginScreen:
            showPaymentProcessor(paymentProcessor: model.paymentPlugin)
        case .getPointsAndDiscounts:
            getPointsAndDiscounts()
        case .getInstructions:
            getInstructions()
        case .finish:
            finishFlow()
        }
    }

    func getPaymentTimeOut() -> TimeInterval {
        let instructionTimeOut: TimeInterval = model.isOfflinePayment() ? 15 : 0
        if let paymentPluginTimeOut = model.paymentPlugin?.paymentTimeOut?(), paymentPluginTimeOut > 0 {
            return paymentPluginTimeOut + instructionTimeOut
        } else {
            return model.mercadoPagoServicesAdapter.getTimeOut() + instructionTimeOut
        }
    }

    func needToShowPaymentPluginScreen() -> Bool {
        return model.needToShowPaymentPluginScreenForPaymentPlugin()
    }

    func hasPaymentPluginScreen() -> Bool {
        return model.hasPluginPaymentScreen()
    }

    func finishFlow() {
        if let paymentResult = model.paymentResult {
            self.resultHandler?.finishPaymentFlow(paymentResult: (paymentResult), instructionsInfo: model.instructionsInfo, pointsAndDiscounts: model.pointsAndDiscounts)
            return
        } else if let businessResult = model.businessResult {
            self.resultHandler?.finishPaymentFlow(businessResult: businessResult, pointsAndDiscounts: model.pointsAndDiscounts)
            return
        }
    }

    func cancelFlow() {}

    func exitCheckout() {}

    func cleanPayment() {
        model.cleanData()
    }
}

/** :nodoc: */
extension PXPaymentFlow: PXPaymentProcessorErrorHandler {
    func showError() {
        let error = MPSDKError(message: "Hubo un error".localized, errorDetail: "", retry: false)
        error.requestOrigin = ApiUtil.RequestOrigin.CREATE_PAYMENT.rawValue
        resultHandler?.finishPaymentFlow(error: error)
    }

    func showError(error: MPSDKError) {
        resultHandler?.finishPaymentFlow(error: error)
    }
}
