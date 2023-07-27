//
//  MercadoPagoCheckout+OneTapResultHandler.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 03/07/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension MercadoPagoCheckout: PXOneTapResultHandlerProtocol {
    func finishOneTap(paymentData: PXPaymentData, splitAccountMoney: PXPaymentData?, pointsAndDiscounts: PXPointsAndDiscounts?) {
        viewModel.updateCheckoutModel(paymentData: paymentData)
        viewModel.splitAccountMoney = splitAccountMoney
        viewModel.pointsAndDiscounts = pointsAndDiscounts
        executeNextStep()
    }

    func refreshInitFlow(cardId: String) {
        cardIdForInitFlowRefresh = cardId
        viewModel.checkoutPreference.setCardId(cardId: "cards")
        viewModel.prepareForNewSelection()
        viewModel.refreshInitFlow()
    }

    func cancelOneTap() {
        viewModel.prepareForNewSelection()
        executeNextStep()
    }

    func cancelOneTapForNewPaymentMethodSelection() {
        viewModel.checkoutPreference.setCardId(cardId: "cards")
        viewModel.prepareForNewSelection()
        executeNextStep()
    }

    func exitCheckout() {
        finish()
    }

    func finishOneTap(paymentResult: PaymentResult, instructionsInfo: PXInstructions?, pointsAndDiscounts: PXPointsAndDiscounts?) {
        setPaymentResult(paymentResult: paymentResult)
        viewModel.instructionsInfo = instructionsInfo
        viewModel.pointsAndDiscounts = pointsAndDiscounts
        executeNextStep()
    }

    func finishOneTap(businessResult: PXBusinessResult, paymentData: PXPaymentData, splitAccountMoney: PXPaymentData?, pointsAndDiscounts: PXPointsAndDiscounts?) {
        viewModel.businessResult = businessResult
        viewModel.paymentData = paymentData
        viewModel.splitAccountMoney = splitAccountMoney
        viewModel.pointsAndDiscounts = pointsAndDiscounts
        executeNextStep()
    }
}
