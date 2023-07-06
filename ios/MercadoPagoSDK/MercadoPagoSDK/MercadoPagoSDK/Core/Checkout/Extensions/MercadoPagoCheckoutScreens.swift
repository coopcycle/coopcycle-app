//
//  MercadoPagoCheckoutScreens.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 7/18/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

extension MercadoPagoCheckout {

    func showPaymentMethodsScreen() {
        viewModel.clearCollectedData()
        let paymentMethodSelectionStep = PaymentVaultViewController(viewModel: self.viewModel.paymentVaultViewModel(), callback: { [weak self] (paymentOptionSelected: PaymentMethodOption) -> Void  in
            guard let self = self else { return }
            // Clean account money paymentData on PaymentVault selection.
            // Because this flow doesn´t support split payments.
            self.viewModel.splitAccountMoney = nil

            self.viewModel.updateCheckoutModel(paymentOptionSelected: paymentOptionSelected)

            if let payerCosts = self.viewModel.paymentConfigurationService.getPayerCostsForPaymentMethod(paymentOptionSelected.getId()) {
                self.viewModel.payerCosts = payerCosts
                let defaultPayerCost = self.viewModel.checkoutPreference.paymentPreference.autoSelectPayerCost(payerCosts)
                if let defaultPC = defaultPayerCost {
                    self.viewModel.updateCheckoutModel(payerCost: defaultPC)
                }
            } else {
                self.viewModel.payerCosts = nil
            }
            if let discountConfiguration = self.viewModel.paymentConfigurationService.getDiscountConfigurationForPaymentMethod(paymentOptionSelected.getId()) {
                self.viewModel.attemptToApplyDiscount(discountConfiguration)
            } else {
                self.viewModel.applyDefaultDiscountOrClear()
            }

            self.viewModel.rootVC = false
            self.executeNextStep()
        })

        viewModel.pxNavigationHandler.pushViewController(viewController: paymentMethodSelectionStep, animated: true)
    }

    func showCardForm() {
        let cardFormStep = CardFormViewController(cardFormManager: self.viewModel.cardFormManager(), callback: { [weak self] (paymentMethods, cardToken) in
            guard let self = self else { return }

            self.viewModel.updateCheckoutModel(paymentMethods: paymentMethods, cardToken: cardToken)
            self.executeNextStep()
        })
        viewModel.pxNavigationHandler.pushViewController(viewController: cardFormStep, animated: true)
    }

    func showIdentificationScreen() {
        guard let identificationTypes = viewModel.cardFlowSupportedIdentificationTypes() else {
            let error = MPSDKError(message: "Hubo un error".localized, errorDetail: "", retry: false)
            MercadoPagoCheckoutViewModel.error = error
            showErrorScreen()
            return
        }

        let identificationStep = IdentificationViewController(identificationTypes: identificationTypes, paymentMethod: viewModel.paymentData.paymentMethod, callback: { [weak self] (identification : PXIdentification) in
            guard let self = self else { return }

            self.viewModel.updateCheckoutModel(identification: identification)
            self.executeNextStep()
            }, errorExitCallback: { [weak self] in
                self?.finish()
        })

        identificationStep.callbackCancel = { [weak self] in
            self?.viewModel.pxNavigationHandler.navigationController.popViewController(animated: true)
        }
        viewModel.pxNavigationHandler.pushViewController(viewController: identificationStep, animated: true)
    }

    func showPayerInfoFlow() {
        let payerInfoViewModel = self.viewModel.payerInfoFlow()
        let vc = PayerInfoViewController(viewModel: payerInfoViewModel) { [weak self] (payer) in
            guard let self = self else { return }

            self.viewModel.updateCheckoutModel(payer: payer)
            self.executeNextStep()
        }
        viewModel.pxNavigationHandler.pushViewController(viewController: vc, animated: true)
    }

    func showIssuersScreen() {
        let issuerViewModel = viewModel.issuerViewModel()
        let issuerStep = AdditionalStepViewController(viewModel: issuerViewModel, callback: { [weak self] (issuer) in
            guard let issuer = issuer as? PXIssuer else {
                fatalError("Cannot convert issuer to type Issuer")
            }
            self?.viewModel.updateCheckoutModel(issuer: issuer)
            self?.executeNextStep()

        })
        viewModel.pxNavigationHandler.pushViewController(viewController: issuerStep, animated: true)
    }

    func showPayerCostScreen() {
        let payerCostViewModel = viewModel.payerCostViewModel()
        let payerCostStep = AdditionalStepViewController(viewModel: payerCostViewModel, callback: { [weak self] (payerCost) in
            guard let payerCost = payerCost as? PXPayerCost else {
                fatalError("Cannot convert payerCost to type PayerCost")
            }
            self?.viewModel.updateCheckoutModel(payerCost: payerCost)
            self?.executeNextStep()
        })
        viewModel.pxNavigationHandler.pushViewController(viewController: payerCostStep, animated: true)
    }

    func showReviewAndConfirmScreen() {
        let paymentFlow = viewModel.createPaymentFlow(paymentErrorHandler: self)
        let timeOut = paymentFlow.getPaymentTimeOut()
        let shouldShowAnimatedPayButton = !paymentFlow.needToShowPaymentPluginScreen()

        let reviewVC = PXReviewViewController(viewModel: viewModel.reviewConfirmViewModel(), timeOutPayButton: timeOut, shouldAnimatePayButton: shouldShowAnimatedPayButton, callbackPaymentData: { [weak self] (paymentData: PXPaymentData) in
            guard let self = self else { return }

            self.viewModel.updateCheckoutModel(paymentData: paymentData)
            self.executeNextStep()
        }, callbackConfirm: { [weak self] (paymentData: PXPaymentData) in
            guard let self = self else { return }

            self.viewModel.updateCheckoutModel(paymentData: paymentData)
            self.executeNextStep()
        }, finishButtonAnimation: {
            self.executeNextStep()
        }, changePayerInformation: { [weak self] (paymentData: PXPaymentData) in
            guard let self = self else { return }

            self.viewModel.updateCheckoutModel(paymentData: paymentData)
            self.executeNextStep()
        })

        if let changePaymentMethodAction = viewModel.lifecycleProtocol?.changePaymentMethodTapped?() {
            reviewVC.changePaymentMethodCallback = changePaymentMethodAction
        } else {
            reviewVC.changePaymentMethodCallback = nil
        }

        viewModel.pxNavigationHandler.pushViewController(viewController: reviewVC, animated: true)
    }

    func showSecurityCodeScreen() {
        let savedCardSecurityCodeViewModel = viewModel.savedCardSecurityCodeViewModel()
        let securityCodeVc = SecurityCodeViewController(viewModel: savedCardSecurityCodeViewModel, collectSecurityCodeCallback: { [weak self] (_, securityCode: String) -> Void in
            self?.getTokenizationService().createCardToken(securityCode: securityCode)
        })
        viewModel.pxNavigationHandler.pushViewController(viewController: securityCodeVc, animated: true, backToFirstPaymentVault: true)
    }

    func collectSecurityCodeForRetry() {
        let cloneTokenSecurityCodeViewModel = viewModel.cloneTokenSecurityCodeViewModel()
        let securityCodeVc = SecurityCodeViewController(viewModel: cloneTokenSecurityCodeViewModel, collectSecurityCodeCallback: { [weak self] (cardInformation: PXCardInformationForm, securityCode: String) -> Void in
            guard let token = cardInformation as? PXToken else {
                fatalError("Cannot convert cardInformation to Token")
            }
            self?.getTokenizationService().createCardToken(securityCode: securityCode, token: token)

        })
        viewModel.pxNavigationHandler.pushViewController(viewController: securityCodeVc, animated: true)
    }

    func showPaymentResultScreen() {
        if viewModel.businessResult != nil {
            showBusinessResultScreen()
            return
        }
        if viewModel.paymentResult == nil, let payment = viewModel.payment {
            viewModel.paymentResult = PaymentResult(payment: payment, paymentData: viewModel.paymentData)
        }

        var congratsViewController: MercadoPagoUIViewController
        let congratsViewControllerCallback: ( _ status: PaymentResult.CongratsState) -> Void = { [weak self] (state: PaymentResult.CongratsState) in
            guard let self = self else { return }
            self.viewModel.pxNavigationHandler.navigationController.setNavigationBarHidden(false, animated: false)
            if state == .call_FOR_AUTH {
                self.viewModel.prepareForClone()
                self.collectSecurityCodeForRetry()
            } else if state == .cancel_RETRY || state == .cancel_SELECT_OTHER {
                if let changePaymentMethodAction = self.viewModel.lifecycleProtocol?.changePaymentMethodTapped?(), state == .cancel_SELECT_OTHER {
                    changePaymentMethodAction()
                } else {
                    self.viewModel.prepareForNewSelection()
                    self.executeNextStep()
                }
            } else {
                self.finish()
            }
        }

        let resultViewModel = self.viewModel.resultViewModel()
        congratsViewController = PXNewResultViewController(viewModel: resultViewModel, callback: congratsViewControllerCallback)
        viewModel.pxNavigationHandler.pushViewController(viewController: congratsViewController, animated: false)
    }

    func showBusinessResultScreen() {
        var congratsViewController: MercadoPagoUIViewController
        let congratsViewControllerCallback: ( _ status: PaymentResult.CongratsState) -> Void = { [weak self] (_: PaymentResult.CongratsState) in
            self?.finish()
        }

        guard let businessResult = viewModel.businessResult else {
            return
        }

        let pxBusinessResultViewModel = PXBusinessResultViewModel(businessResult: businessResult, paymentData: viewModel.paymentData, amountHelper: viewModel.amountHelper, pointsAndDiscounts: viewModel.pointsAndDiscounts)

        congratsViewController = PXNewResultViewController(viewModel: pxBusinessResultViewModel, callback: congratsViewControllerCallback)
        viewModel.pxNavigationHandler.pushViewController(viewController: congratsViewController, animated: false)
    }

    func showErrorScreen() {
        viewModel.pxNavigationHandler.showErrorScreen(error: MercadoPagoCheckoutViewModel.error, callbackCancel: finish, errorCallback: viewModel.errorCallback)
        MercadoPagoCheckoutViewModel.error = nil
    }

    func showFinancialInstitutionsScreen() {
        if let financialInstitutions = viewModel.paymentData.getPaymentMethod()?.financialInstitutions {
            viewModel.financialInstitutions = financialInstitutions

            if financialInstitutions.count == 1 {
                viewModel.updateCheckoutModel(financialInstitution: financialInstitutions[0])
                executeNextStep()
            } else {
                let financialInstitutionViewModel = viewModel.financialInstitutionViewModel()
                let financialInstitutionStep = AdditionalStepViewController(viewModel: financialInstitutionViewModel, callback: { [weak self] (financialInstitution) in
                    guard let financialInstitution = financialInstitution as? PXFinancialInstitution else {
                        fatalError("Cannot convert entityType to type EntityType")
                    }
                    self?.viewModel.updateCheckoutModel(financialInstitution: financialInstitution)
                    self?.executeNextStep()
                })

                financialInstitutionStep.callbackCancel = { [weak self] in
                    guard let self = self else { return }
                    self.viewModel.financialInstitutions = nil
                    self.viewModel.paymentData.transactionDetails?.financialInstitution = nil
                    self.viewModel.pxNavigationHandler.navigationController.popViewController(animated: true)
                }

                viewModel.pxNavigationHandler.pushViewController(viewController: financialInstitutionStep, animated: true)
            }
        }
    }

    func showEntityTypesScreen() {
        let entityTypes = viewModel.getEntityTypes()

        viewModel.entityTypes = entityTypes

        if entityTypes.count == 1 {
            viewModel.updateCheckoutModel(entityType: entityTypes[0])
            executeNextStep()
        }
        // Esto de aca abajo no deberia estar en un bloque de else del if de arriba, como en showFinancialInstitutionsScreen() ?
        let entityTypeViewModel = viewModel.entityTypeViewModel()
        let entityTypeStep = AdditionalStepViewController(viewModel: entityTypeViewModel, callback: { [weak self] (entityType) in
            guard let entityType = entityType as? EntityType else {
                fatalError("Cannot convert entityType to type EntityType")
            }

            self?.viewModel.updateCheckoutModel(entityType: entityType)
            self?.executeNextStep()
        })

        entityTypeStep.callbackCancel = {[weak self] in
            guard let self = self else { return }
            self.viewModel.entityTypes = nil
            self.viewModel.paymentData.payer?.entityType = nil
            self.viewModel.pxNavigationHandler.navigationController.popViewController(animated: true)
        }

        viewModel.pxNavigationHandler.pushViewController(viewController: entityTypeStep, animated: true)
    }

    func startOneTapFlow() {
        guard let search = viewModel.search else {
            return
        }

        let paymentFlow = viewModel.createPaymentFlow(paymentErrorHandler: self)

        if shouldUpdateOnetapFlow() {
            if let cardId = cardIdForInitFlowRefresh {
                if viewModel.customPaymentOptions?.first(where: { $0.getCardId() == cardId }) != nil {
                    viewModel.onetapFlow?.update(checkoutViewModel: viewModel, search: search, paymentOptionSelected: viewModel.paymentOptionSelected)
                } else {
                    // New card didn't return. Refresh Init again
                    refreshInitFlow(cardId: cardId)
                    return
                }
            }
        } else {
            viewModel.onetapFlow = OneTapFlow(checkoutViewModel: viewModel, search: search, paymentOptionSelected: viewModel.paymentOptionSelected, oneTapResultHandler: self)
        }

        viewModel.onetapFlow?.setCustomerPaymentMethods(viewModel.customPaymentOptions)
        viewModel.onetapFlow?.setPaymentFlow(paymentFlow: paymentFlow)

        if shouldUpdateOnetapFlow() {
            viewModel.onetapFlow?.updateOneTapViewModel(cardId: cardIdForInitFlowRefresh ?? "")
            cardIdForInitFlowRefresh = nil
        } else {
            viewModel.onetapFlow?.start()
        }
    }

    func shouldUpdateOnetapFlow() -> Bool {
        if viewModel.onetapFlow != nil,
            let cardId = cardIdForInitFlowRefresh,
            cardId.isNotEmpty,
            countInitFlowRefreshRetries <= maxInitFlowRefreshRetries {
            countInitFlowRefreshRetries += 1
            return true
        }
        // Card should not be updated or number of retries has reached max number
        cardIdForInitFlowRefresh = nil
        countInitFlowRefreshRetries = 0
        return false
    }
}
