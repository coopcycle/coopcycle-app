//
//  NextStepHelper.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 2/3/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

extension MercadoPagoCheckoutViewModel {

    func isPaymentTypeSelected() -> Bool {

        let hasPaymentWithInvalidESC = paymentData.hasPaymentMethod() && !paymentData.hasToken() && paymentResult != nil && paymentResult!.isInvalidESC()

        if (self.paymentData.isComplete() || hasPaymentWithInvalidESC) && (self.search != nil) {
            if self.paymentOptionSelected == nil {
                self.setPaymentOptionSelected()
            }
            return true
        }

        guard let selectedType = self.paymentOptionSelected else {
                return false
        }
        return !selectedType.hasChildren()
    }
    func needCompleteCard() -> Bool {
        guard let selectedType = self.paymentOptionSelected else {
            return false
        }
        if selectedType.isCustomerPaymentMethod() {
            return false
        }
        if !selectedType.isCard() {
            return false
        }
        return self.cardToken == nil && self.paymentData.getPaymentMethod() == nil
    }

    func showConfirm() -> Bool {
        return self.paymentData.isComplete()
    }

    func showCongrats() -> Bool {
        return self.payment != nil
    }
    func needGetIdentification() -> Bool {
        guard let pm = self.paymentData.getPaymentMethod(), !pm.isBolbradesco && !pm.isPec else {
            return false
        }
        return isIdentificationNeeded() && self.identificationTypes != nil
    }

    func needToGetIdentificationTypes() -> Bool {
        return isIdentificationNeeded() && self.identificationTypes == nil
    }

    func needToGetPayerInfo() -> Bool {
        guard let pm = self.paymentData.getPaymentMethod(), pm.isBolbradesco || pm.isPec else {
            return false
        }
        return isIdentificationNeeded() && self.identificationTypes != nil
    }

    func isIdentificationNeeded() -> Bool {
        guard let pm = self.paymentData.getPaymentMethod(), let option = self.paymentOptionSelected else {
            return false
        }

        if !pm.isOnlinePaymentMethod && (pm.isIdentificationRequired || pm.isIdentificationTypeRequired || pm.isPayerInfoRequired) && (String.isNullOrEmpty(self.paymentData.payer?.identification?.number) || String.isNullOrEmpty(self.paymentData.payer?.identification?.type)) {
            return true
        }

        guard let holder = self.cardToken?.cardholder else {
            return false
        }

        if let identification = holder.identification {
            if String.isNullOrEmpty(identification.number) && pm.isIdentificationRequired && !option.isCustomerPaymentMethod() {
                return true
            }
        }
        return false
    }

    func needGetEntityTypes() -> Bool {
        guard self.paymentOptionSelected != nil else {
            return false
        }
        guard let pm = self.paymentData.getPaymentMethod() else {
            return false
        }
        if paymentData.payer?.entityType == nil && pm.isEntityTypeRequired {
            return true
        }
        return false
    }

    func needGetFinancialInstitutions() -> Bool {
        guard self.paymentOptionSelected != nil else {
            return false
        }
        guard let pm = self.paymentData.getPaymentMethod() else {
            return false
        }

        if paymentData.transactionDetails?.financialInstitution == nil && !Array.isNullOrEmpty(pm.financialInstitutions) {
           return true
        }

        return false
    }

    func needGetIssuers() -> Bool {
        guard let selectedType = self.paymentOptionSelected else {
            return false
        }
        guard let pm = self.paymentData.getPaymentMethod() else {
            return false
        }
        if selectedType.isCustomerPaymentMethod() {
            return false
        }
        if !paymentData.hasIssuer() && pm.isCard && Array.isNullOrEmpty(issuers) {
            return true
        }
        return false
    }

    func needIssuerSelectionScreen() -> Bool {
        guard let selectedType = self.paymentOptionSelected else {
            return false
        }
        guard let pm = self.paymentData.getPaymentMethod() else {
            return false
        }
        if selectedType.isCustomerPaymentMethod() {
            return false
        }
        if !paymentData.hasIssuer() && pm.isCard && !Array.isNullOrEmpty(issuers) {
            return true
        }
        return false
    }

    func needChosePayerCost() -> Bool {
        guard let pm = self.paymentData.getPaymentMethod() else {
            return false
        }
        if pm.isCard && !paymentData.hasPayerCost() && payerCosts == nil {
            return true
        }
        return false
    }

    func needPayerCostSelectionScreen() -> Bool {
        guard let pm = self.paymentData.getPaymentMethod() else {
            return false
        }
        if (pm.isCard || pm.isDigitalCurrency) && !paymentData.hasPayerCost() && payerCosts != nil {
            return true
        }
        return false
    }

    func needSecurityCode() -> Bool {
        guard let pmSelected = self.paymentOptionSelected else {
            return false
        }

        guard let pm = self.paymentData.getPaymentMethod() else {
            return false
        }

        let hasInstallmentsIfNeeded = paymentData.hasPayerCost() || !(pm.isCreditCard || pm.isDebitCard)
        let paymentOptionSelectedId = pmSelected.getId()
        let isCustomerCard = pmSelected.isCustomerPaymentMethod() &&
            paymentOptionSelectedId != PXPaymentTypes.ACCOUNT_MONEY.rawValue &&
            paymentOptionSelectedId != PXPaymentTypes.CONSUMER_CREDITS.rawValue

        if  isCustomerCard && !paymentData.hasToken() && hasInstallmentsIfNeeded && !hasSavedESC() {
            if let customOptionSearchItem = search?.payerPaymentMethods.first(where: { $0.id == paymentOptionSelectedId}) {
                return customOptionSearchItem.escStatus != PXESCStatus.APPROVED.rawValue
            } else {
                return true
            }
        }

        return false
    }

    func needCreateToken() -> Bool {

        guard let pm = self.paymentData.getPaymentMethod() else {
            return false
        }

        //Note: this is being used only for new cards, saved cards tokenization is
        //made in MercadoPagoCheckout#collectSecurityCode().
        let hasInstallmentsIfNeeded = self.paymentData.getPayerCost() != nil || !pm.isCreditCard

        let newCard = !paymentData.hasToken() && pm.isCard && self.cardToken != nil
        let savedCardWithESC = !paymentData.hasToken() && pm.isCard && hasSavedESC() && hasInstallmentsIfNeeded

        return (newCard || savedCardWithESC)
    }

    func needReviewAndConfirm() -> Bool {
        guard self.paymentOptionSelected != nil else {
            return false
        }

        if readyToPay {
            return false
        }

        if paymentResult != nil {
            return false
        }

        if self.isCheckoutComplete() {
            return false
        }

        if self.initWithPaymentData && paymentData.isComplete() {
            initWithPaymentData = false
            return true
        }

        if paymentData.isComplete() {
            return true
        }
        return false
    }

    func needOneTapFlow() -> Bool {
        guard let search = self.search else {
            return false
        }

        if readyToPay {
            return false
        }

        if paymentResult != nil {
            return false
        }

        if self.isCheckoutComplete() {
            return false
        }

        if paymentData.isComplete() {
            return false
        }

        // MoneyIn default card - OneTap safe business check.
        if amountHelper.preference.paymentPreference.cardId != nil {
            return false
        }

        if let paymentMethodSelected = OneTapFlow.autoSelectOneTapOption(search: search, customPaymentOptions: customPaymentOptions, amountHelper: amountHelper) {
            updateCheckoutModel(paymentOptionSelected: paymentMethodSelected)
            return true
        }

        if let oneTap = search.oneTap, !oneTap.isEmpty {
            return true
        }

        return false
    }

    func shouldShowCongrats() -> Bool {
        if self.businessResult != nil {
            return true
        }
        if let paymentResult = self.paymentResult, paymentResult.isInvalidESC() {
            return false
        }
        if self.payment != nil || self.paymentResult != nil {
            self.setIsCheckoutComplete(isCheckoutComplete: true)
            return true
        }
        return false
    }

    func shouldExitCheckout() -> Bool {
        return self.isCheckoutComplete()
    }

    func needToCreatePayment() -> Bool {
        if paymentData.isComplete() {
            return readyToPay
        }
        return false
    }

    func setPaymentOptionSelected() {
        guard let paymentMethod = self.paymentData.getPaymentMethod() else {
            return
        }
        let paymentMethodWithESC = paymentData.hasPaymentMethod() && savedESCCardToken != nil
        if (self.paymentData.hasCustomerPaymentOption() || paymentMethodWithESC) && self.customPaymentOptions != nil {
            // Account_money o customer cards
            let customOption = Utils.findCardInformationIn(customOptions: self.customPaymentOptions!, paymentData: self.paymentData, savedESCCardToken: savedESCCardToken)
            self.paymentOptionSelected = customOption as? PaymentMethodOption
        } else if !paymentMethod.isOnlinePaymentMethod {
            // Medios off
            if let paymentTypeId = PXPaymentTypes(rawValue: paymentMethod.paymentTypeId) {
                self.paymentOptionSelected = Utils.findPaymentMethodSearchItemInGroups(self.search!, paymentMethodId: paymentMethod.id, paymentTypeId: paymentTypeId)
            }
        } else {
            // Tarjetas, efectivo, crédito, debito
            if let paymentTypeId = PXPaymentTypes(rawValue: paymentMethod.paymentTypeId) {
                self.paymentOptionSelected = Utils.findPaymentMethodTypeId(self.search!.groups, paymentTypeId: paymentTypeId)
            }
        }
    }

    func hasSavedESC() -> Bool {
        guard let pmSelected = self.paymentOptionSelected else {
            return false
        }

        if let card = pmSelected as? PXCardInformation {
            return escManager?.getESC(cardId: card.getCardId(), firstSixDigits: card.getFirstSixDigits(), lastFourDigits: card.getCardLastForDigits()) == nil ? false : true
        }
        return false
    }

    func needToInitFlow() -> Bool {
        if let initialFlow = initFlow, (initialFlow.getStatus() == .ready
            || initialFlow.getStatus() == .running) {
            return true
        } else {
            if initFlow == nil {
                return true
            }
        }
        return false
    }
}
