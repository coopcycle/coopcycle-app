//
//  AddCardFlow.swift
//  MercadoPagoSDK
//
//  Created by Diego Flores Domenech on 6/9/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

@objc public protocol AddCardFlowProtocol {
    func addCardFlowSucceded(result: [String: Any])
    func addCardFlowFailed(shouldRestart: Bool)
}

@objcMembers
public class AddCardFlow: NSObject, PXFlow {

    public weak var delegate: AddCardFlowProtocol?

    private var productId: String?
    private let accessToken: String
    private let model = AddCardFlowModel()
    private let navigationHandler: PXNavigationHandler

    // Change in Q2 when esc info comes from backend
    private let escEnabled: Bool = true
    private let escManager: PXESCManager

    //add card flow should have 'aggregator' processing mode by default
    private lazy var mercadoPagoServicesAdapter = MercadoPagoServicesAdapter(publicKey: "APP_USR-5bd14fdd-3807-446f-babd-095788d5ed4d", privateKey: self.accessToken)

    public convenience init(accessToken: String, locale: String, navigationController: UINavigationController, shouldSkipCongrats: Bool) {
        self.init(accessToken: accessToken, locale: locale, navigationController: navigationController)
        model.skipCongrats = shouldSkipCongrats
    }

    public init(accessToken: String, locale: String, navigationController: UINavigationController) {
        self.accessToken = accessToken
        self.navigationHandler = PXNavigationHandler(navigationController: navigationController)
        MPXTracker.sharedInstance.startNewSession()
        escManager = PXESCManager(enabled: escEnabled, sessionId: MPXTracker.sharedInstance.getSessionID(), flow: "/card_association")
        super.init()
        Localizator.sharedInstance.setLanguage(string: locale)
        ThemeManager.shared.saveNavBarStyleFor(navigationController: navigationController)
        PXNotificationManager.SuscribeTo.attemptToClose(self, selector: #selector(goBack))
    }

    public func setSiteId(_ siteId: String) {
        let siteFactory = AddCardFlowSiteFactory()
        SiteManager.shared.setSite(site: siteFactory.createSite(siteId))
    }

    /**
            Set product id
        */
    open func setProductId(_ productId: String) {
        self.productId = productId
    }

    public func start() {
        self.executeNextStep()
    }

    public func setTheme(theme: PXTheme) {
        ThemeManager.shared.setTheme(theme: theme)
    }

    func executeNextStep() {
        if self.model.lastStepFailed {
            self.navigationHandler.presentLoading()
        }
        switch self.model.nextStep() {
        case .getPaymentMethods:
            self.getPaymentMethods()
        case .getIdentificationTypes:
            self.getIdentificationTypes()
        case .openCardForm:
            self.openCardForm()
        case .openIdentificationTypes:
            self.openIdentificationTypesScreen()
        case .createToken:
            self.createCardToken()
        case .associateTokenWithUser:
            self.associateTokenWithUser()
        case .showCongrats:
            self.showCongrats()
        case .finish:
            self.finish()
        default:
            break
        }
    }

    func cancelFlow() {
    }

    func finishFlow() {
    }

    func exitCheckout() {
    }

    // MARK: steps

    private func getPaymentMethods() {
        self.navigationHandler.presentLoading()
        let service = PaymentMethodsUserService(accessToken: self.accessToken, productId: self.productId)
        service.getPaymentMethods(success: { [weak self] (paymentMethods) in
            guard let self = self else { return }
            self.model.paymentMethods = paymentMethods
            self.executeNextStep()
            }, failure: { [weak self] (error) in
                guard let self = self else { return }
                self.model.lastStepFailed = true
                if error.code == ErrorTypes.NO_INTERNET_ERROR {
                    let sdkError = MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.GET_PAYMENT_METHODS.rawValue)
                    self.navigationHandler.showErrorScreen(error: sdkError, callbackCancel: { [weak self] in
                        self?.finish()
                    }, errorCallback: nil)
                } else {
                    self.showErrorScreen()
                }
        })
    }

    private func getIdentificationTypes() {
        self.mercadoPagoServicesAdapter.getIdentificationTypes(callback: { [weak self] identificationTypes in
            guard let self = self else { return }
            self.model.identificationTypes = identificationTypes
            self.executeNextStep()
        }, failure: { [weak self] error in
            guard let self = self else { return }
            self.model.lastStepFailed = true
            if error.code == ErrorTypes.NO_INTERNET_ERROR {
                let sdkError = MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.GET_IDENTIFICATION_TYPES.rawValue)
                self.navigationHandler.showErrorScreen(error: sdkError, callbackCancel: { [weak self] in
                    self?.finish()
                }, errorCallback: nil)
            } else {
                if let status = error.userInfo["status"] as? Int, status == 404 {
                    self.model.identificationTypes = []
                    self.model.lastStepFailed = false
                    self.executeNextStep()
                } else {
                    self.showErrorScreen()
                }
            }
        })
    }

    private func openCardForm() {
        guard let paymentMethods = self.model.paymentMethods else {
            return
        }
        let cardFormViewModel = CardFormViewModel(paymentMethods: paymentMethods, guessedPaymentMethods: nil, customerCard: nil, token: nil, mercadoPagoServicesAdapter: nil, bankDealsEnabled: false)
        let cardFormViewController = CardFormViewController(cardFormManager: cardFormViewModel, callback: { [weak self] (paymentMethods, cardToken) in
            guard let self = self else { return }
            self.model.cardToken = cardToken
            self.model.selectedPaymentMethod = paymentMethods.first
            self.executeNextStep()
        })
        self.navigationHandler.pushViewController(cleanCompletedCheckouts: false, targetVC: cardFormViewController, animated: true)
    }

    private func openIdentificationTypesScreen() {
        guard let identificationTypes = self.model.supportedIdentificationTypes() else {
            self.showErrorScreen()
            return
        }
        let identificationViewController = IdentificationViewController(identificationTypes: identificationTypes, paymentMethod: model.selectedPaymentMethod, callback: { [weak self] (identification) in
            guard let self = self else { return }
            self.model.cardToken?.cardholder?.identification = identification
            self.executeNextStep()
            }, errorExitCallback: { [weak self] in
                self?.showErrorScreen()
        })
        self.navigationHandler.pushViewController(cleanCompletedCheckouts: false, targetVC: identificationViewController, animated: true)
    }

    private func createCardToken() {
        guard let cardToken = self.model.cardToken else {
            return
        }
        cardToken.requireESC = escEnabled
        self.navigationHandler.presentLoading()

        self.mercadoPagoServicesAdapter.createToken(cardToken: cardToken, callback: { [weak self] (token) in
            guard let self = self else { return }
            self.model.tokenizedCard = token
            if let esc = token.esc {
                self.escManager.saveESC(firstSixDigits: token.firstSixDigits, lastFourDigits: token.lastFourDigits, esc: esc)
            }
            self.executeNextStep()
            }, failure: { [weak self] (error) in
                guard let self = self else { return }
                let reachabilityManager = PXReach()
                if reachabilityManager.connectionStatus().description == ReachabilityStatus.offline.description {
                    self.model.lastStepFailed = true
                    let sdkError = MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.CREATE_TOKEN.rawValue)
                    self.navigationHandler.showErrorScreen(error: sdkError, callbackCancel: { [weak self] in
                        self?.finish()
                    }, errorCallback: nil)
                } else {
                    self.showErrorScreen()
                }
        })
    }

    private func associateTokenWithUser() {
        guard let selectedPaymentMethod = self.model.selectedPaymentMethod, let token = self.model.tokenizedCard else {
            return
        }
        let associateCardService = AssociateCardService(accessToken: self.accessToken, productId: productId)
        associateCardService.associateCardToUser(paymentMethod: selectedPaymentMethod, cardToken: token, success: { [weak self] (json) in
            guard let self = self else { return }
            self.navigationHandler.dismissLoading()
            self.model.associateCardResult = json
            self.executeNextStep()
            }, failure: { [weak self] (error) in
                guard let self = self else { return }
                if error.code == ErrorTypes.NO_INTERNET_ERROR {
                    self.model.lastStepFailed = true
                    let sdkError = MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.ASSOCIATE_TOKEN.rawValue)
                    self.navigationHandler.showErrorScreen(error: sdkError, callbackCancel: { [weak self] in
                        self?.finish()
                    }, errorCallback: nil)
                } else {
                    self.showErrorScreen()
                }
        })
    }

    private func showCongrats() {
        let viewModel = PXResultAddCardSuccessViewModel(buttonCallback: { [weak self] in
            self?.executeNextStep()
        })
        let congratsVc = PXResultViewController(viewModel: viewModel) { [weak self]  (_)  in
            self?.finish()
        }
        self.navigationHandler.pushViewController(cleanCompletedCheckouts: false, targetVC: congratsVc, animated: true)
    }

    private func finish() {
        if let associateCardResult = self.model.associateCardResult {
            self.delegate?.addCardFlowSucceded(result: associateCardResult)
        } else {
            self.delegate?.addCardFlowFailed(shouldRestart: false)
        }
        ThemeManager.shared.applyAppNavBarStyle(navigationController: self.navigationHandler.navigationController)
    }

    private func showErrorScreen() {
        let viewModel = PXResultAddCardFailedViewModel(buttonCallback: { [weak self] in
            self?.reset()
            }, linkCallback: { [weak self] in
                self?.finish()
        })
        let failVc = PXResultViewController(viewModel: viewModel) { [weak self]  (_)  in
            self?.finish()
        }
        self.navigationHandler.pushViewController(cleanCompletedCheckouts: false, targetVC: failVc, animated: true)
    }

    private func reset() {
        PXNotificationManager.Post.cardFormReset()
        if let cardForm = self.navigationHandler.navigationController.viewControllers.filter({ $0 is CardFormViewController }).first {
            self.navigationHandler.navigationController.popToViewController(cardForm, animated: true)
            self.model.reset()
        } else {
            self.delegate?.addCardFlowFailed(shouldRestart: true)
            ThemeManager.shared.applyAppNavBarStyle(navigationController: self.navigationHandler.navigationController)
        }
        self.navigationHandler.navigationController.setNavigationBarHidden(false, animated: true)
    }

    @objc private func goBack() {
        PXNotificationManager.UnsuscribeTo.attemptToClose(self)
        self.navigationHandler.popViewController(animated: true)
        ThemeManager.shared.applyAppNavBarStyle(navigationController: self.navigationHandler.navigationController)
    }

}
