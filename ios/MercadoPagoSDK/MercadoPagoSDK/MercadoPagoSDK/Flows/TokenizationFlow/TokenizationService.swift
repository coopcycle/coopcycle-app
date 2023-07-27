//
//  TokenizationService.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 12/04/2019.
//

import Foundation

internal class TokenizationService {
    var paymentOptionSelected: PaymentMethodOption?
    var cardToken: PXCardToken?
    var escManager: MercadoPagoESC?
    var pxNavigationHandler: PXNavigationHandler
    var needToShowLoading: Bool
    var mercadoPagoServicesAdapter: MercadoPagoServicesAdapter
    weak var resultHandler: TokenizationServiceResultHandler?

    init(paymentOptionSelected: PaymentMethodOption?, cardToken: PXCardToken?, escManager: MercadoPagoESC?, pxNavigationHandler: PXNavigationHandler, needToShowLoading: Bool, mercadoPagoServicesAdapter: MercadoPagoServicesAdapter, gatewayFlowResultHandler: TokenizationServiceResultHandler) {
        self.paymentOptionSelected = paymentOptionSelected
        self.escManager = escManager
        self.pxNavigationHandler = pxNavigationHandler
        self.needToShowLoading = needToShowLoading
        self.mercadoPagoServicesAdapter = mercadoPagoServicesAdapter
        self.resultHandler = gatewayFlowResultHandler
        self.cardToken = cardToken
    }

    func createCardToken(securityCode: String? = nil, token: PXToken? = nil) {

        // Clone token
        if let token = token, token.canBeClone() {
            guard let securityCode = securityCode else {
                return
            }
            cloneCardToken(token: token, securityCode: securityCode)
            return
        }

        // New Card Token
        guard let cardInfo = paymentOptionSelected as? PXCardInformation else {
            createNewCardToken()
            return
        }

        // Saved card with esc token
        if let escManager = escManager, escManager.hasESCEnable() {
            var savedESCCardToken: PXSavedESCCardToken

            let esc = escManager.getESC(cardId: cardInfo.getCardId(), firstSixDigits: cardInfo.getFirstSixDigits(), lastFourDigits: cardInfo.getCardLastForDigits())

            if !String.isNullOrEmpty(esc) {
                savedESCCardToken = PXSavedESCCardToken(cardId: cardInfo.getCardId(), esc: esc, requireESC: escManager.hasESCEnable())
            } else {
                savedESCCardToken = PXSavedESCCardToken(cardId: cardInfo.getCardId(), securityCode: securityCode, requireESC: escManager.hasESCEnable())
            }
            createSavedESCCardToken(savedESCCardToken: savedESCCardToken)

        // Saved card token
        } else {
            guard let securityCode = securityCode else {
                return
            }
            createSavedCardToken(cardInformation: cardInfo, securityCode: securityCode)
        }
    }

    private func createNewCardToken() {
        guard let cardToken = cardToken else {
            return
        }
        pxNavigationHandler.presentLoading()

        mercadoPagoServicesAdapter.createToken(cardToken: cardToken, callback: { (token) in
            self.resultHandler?.finishFlow(token: token)

        }, failure: { (error) in
            let error = MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.CREATE_TOKEN.rawValue)

            if error.apiException?.containsCause(code: ApiUtil.ErrorCauseCodes.INVALID_IDENTIFICATION_NUMBER.rawValue) == true {
                self.resultHandler?.finishInvalidIdentificationNumber()
            } else {
                self.resultHandler?.finishWithError(error: error, securityCode: nil)
            }
        })
    }

    private func createSavedCardToken(cardInformation: PXCardInformation, securityCode: String) {
        guard let cardInformation = paymentOptionSelected as? PXCardInformation else {
            return
        }

        if needToShowLoading {
            self.pxNavigationHandler.presentLoading()
        }

        let saveCardToken = PXSavedCardToken(card: cardInformation, securityCode: securityCode, securityCodeRequired: true)

        mercadoPagoServicesAdapter.createToken(savedCardToken: saveCardToken, callback: { (token) in

            if token.lastFourDigits.isEmpty {
                token.lastFourDigits = cardInformation.getCardLastForDigits()
            }
            self.resultHandler?.finishFlow(token: token)

        }, failure: { (error) in
            let error = MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.CREATE_TOKEN.rawValue)

            self.resultHandler?.finishWithError(error: error, securityCode: securityCode)
        })
    }

    private func createSavedESCCardToken(savedESCCardToken: PXSavedESCCardToken) {
        if needToShowLoading {
            self.pxNavigationHandler.presentLoading()
        }

        mercadoPagoServicesAdapter.createToken(savedESCCardToken: savedESCCardToken, callback: { (token) in

            if token.lastFourDigits.isEmpty {
                let cardInformation = self.paymentOptionSelected as? PXCardInformation
                token.lastFourDigits = cardInformation?.getCardLastForDigits() ?? ""
            }

            self.resultHandler?.finishFlow(token: token)

        }, failure: { (error) in
            let error = MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.CREATE_TOKEN.rawValue)
            self.trackInvalidESC(error: error, cardId: savedESCCardToken.cardId, esc_length: savedESCCardToken.esc?.count)
            self.escManager?.deleteESC(cardId: savedESCCardToken.cardId)
            self.resultHandler?.finishWithESCError()
        })
    }

    private func cloneCardToken(token: PXToken, securityCode: String) {
        pxNavigationHandler.presentLoading()
        mercadoPagoServicesAdapter.cloneToken(tokenId: token.id, securityCode: securityCode, callback: { (token) in
            self.resultHandler?.finishFlow(token: token)

        }, failure: { (error) in
            let error = MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.CREATE_TOKEN.rawValue)
            self.resultHandler?.finishWithError(error: error, securityCode: securityCode)
        })
    }
}
