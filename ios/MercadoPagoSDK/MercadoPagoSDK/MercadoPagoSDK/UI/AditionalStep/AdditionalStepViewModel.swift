//
//  AdditionalStepViewModel.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 3/3/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
import UIKit

internal class AdditionalStepViewModel {

    var bundle: Bundle? = ResourceManager.shared.getBundle()

    var screenTitle: String

    var email: String?
    var token: PXCardInformationForm?
    var paymentMethods: [PXPaymentMethod]
    var cardSectionView: Updatable?
    var cardSectionVisible: Bool
    var totalRowVisible: Bool
    var bankInterestWarningCellVisible: Bool
    var dataSource: [Cellable]
    var defaultTitleCellHeight: CGFloat = 40
    var defaultRowCellHeight: CGFloat = 80
    var callback: ((_ result: NSObject) -> Void)!
    var maxFontSize: CGFloat { return 24 }

    let amountHelper: PXAmountHelper

    var mercadoPagoServicesAdapter: MercadoPagoServicesAdapter
    let advancedConfiguration: PXAdvancedConfiguration

    init(amountHelper: PXAmountHelper, screenTitle: String, cardSectionVisible: Bool, cardSectionView: Updatable? = nil, totalRowVisible: Bool, showBankInsterestWarning: Bool = false, token: PXCardInformationForm?, paymentMethods: [PXPaymentMethod], dataSource: [Cellable], email: String? = nil, mercadoPagoServicesAdapter: MercadoPagoServicesAdapter, advancedConfiguration: PXAdvancedConfiguration) {
        self.amountHelper = amountHelper
        self.screenTitle = screenTitle
        self.token = token
        self.paymentMethods = paymentMethods
        self.cardSectionVisible = cardSectionVisible
        self.cardSectionView = cardSectionView
        self.totalRowVisible = totalRowVisible
        self.bankInterestWarningCellVisible = showBankInsterestWarning
        self.dataSource = dataSource
        self.email = email
        self.mercadoPagoServicesAdapter = mercadoPagoServicesAdapter
        self.advancedConfiguration = advancedConfiguration
    }

    func showCardSection() -> Bool {
        return cardSectionVisible
    }

    func showPayerCostDescription() -> Bool {
        return MercadoPagoCheckout.showPayerCostDescription()
    }

    func showBankInsterestCell() -> Bool {
        return self.bankInterestWarningCellVisible && MercadoPagoCheckout.showBankInterestWarning()
    }

    func showFloatingTotalRow() -> Bool {
        return false
    }

    func getTitle() -> String {
        return screenTitle
    }

    func numberOfSections() -> Int {
        return 4
    }

    func numberOfRowsInSection(section: Int) -> Int {
        switch section {

        case Sections.title.rawValue:
            return 1
        case Sections.card.rawValue:
            var rows: Int = showCardSection() ? 1 : 0
            rows = showBankInsterestCell() ? rows + 1 : rows
            return rows
        case Sections.body.rawValue:
            return numberOfCellsInBody()
        default:
            return 0
        }
    }

    func numberOfCellsInBody() -> Int {
        return dataSource.count
    }

    func heightForRowAt(indexPath: IndexPath) -> CGFloat {

        if isTitleCellFor(indexPath: indexPath) {
            return getTitleCellHeight()

        } else if isCardCellFor(indexPath: indexPath) {
            return self.getCardCellHeight()

        } else if isBankInterestCellFor(indexPath: indexPath) {
            return self.getBankInterestWarningCellHeight()

        } else if isBodyCellFor(indexPath: indexPath) {
            return self.getDefaultRowCellHeight()
        }
        return 0
    }

    func getCardSectionView() -> Updatable? {
        return cardSectionView
    }

    func getTitleCellHeight() -> CGFloat {
        return defaultTitleCellHeight
    }

    func getCardCellHeight() -> CGFloat {
        return isDigitalCurrency() ? 70 : UIScreen.main.bounds.width * 0.50
    }

    func getDefaultRowCellHeight() -> CGFloat {
        return defaultRowCellHeight
    }

    func getBankInterestWarningCellHeight() -> CGFloat {
        return BankInsterestTableViewCell.cellHeight
    }

    func isTitleCellFor(indexPath: IndexPath) -> Bool {
        return indexPath.section == Sections.title.rawValue
    }

    func isCardCellFor(indexPath: IndexPath) -> Bool {
        return indexPath.row == CardSectionCells.card.rawValue && indexPath.section == Sections.card.rawValue && showCardSection()
    }

    func isBankInterestCellFor(indexPath: IndexPath) -> Bool {
        return false
    }

    func isBodyCellFor(indexPath: IndexPath) -> Bool {
        return indexPath.section == Sections.body.rawValue && indexPath.row < numberOfCellsInBody()
    }

    enum CardSectionCells: Int {
        case card = 0
        case bankInterestWarning = 1
    }

    enum Sections: Int {
        case title = 0
        case card = 1
        case body = 2
    }

    func getScreenPath() -> String {
        return ""
    }

    func getScreenProperties() -> [String: Any] {
        return [:]
    }

    func isDigitalCurrency() -> Bool {
        if let pm = amountHelper.getPaymentData().getPaymentMethod(), pm.isDigitalCurrency {
            return true
        }
        return false
    }
}

internal class IssuerAdditionalStepViewModel: AdditionalStepViewModel {

    let cardViewRect = CGRect(x: 0, y: 0, width: 100, height: 30)

    init(amountHelper: PXAmountHelper, token: PXCardInformationForm?, paymentMethod: PXPaymentMethod, dataSource: [Cellable], mercadoPagoServicesAdapter: MercadoPagoServicesAdapter, advancedConfiguration: PXAdvancedConfiguration) {
        super.init(amountHelper: amountHelper, screenTitle: "¿Quién emitió tu tarjeta?".localized, cardSectionVisible: true, cardSectionView: CardFrontView(frame: self.cardViewRect), totalRowVisible: false, token: token, paymentMethods: [paymentMethod], dataSource: dataSource, mercadoPagoServicesAdapter: mercadoPagoServicesAdapter, advancedConfiguration: advancedConfiguration)
    }

    override func getScreenProperties() -> [String: Any] {
        var properties: [String: Any] = [:]
        properties["payment_method_id"] = paymentMethods.first?.getPaymentIdForTracking()
        properties["payment_method_type"] = paymentMethods.first?.getPaymentTypeForTracking()
        var dic: [Any] = []
        for issuerObj in dataSource {
            if let issuer = issuerObj as? PXIssuer {
                dic.append(issuer.getIssuerForTracking())
            }
        }
        properties["available_banks"] = dic

        return properties
    }

    override func getScreenPath() -> String {
        return TrackingPaths.Screens.getIssuersPath()
    }

}

internal class PayerCostAdditionalStepViewModel: AdditionalStepViewModel {

    let cardViewRect = CGRect(x: 0, y: 0, width: 100, height: 30)

    init(amountHelper: PXAmountHelper, token: PXCardInformationForm?, paymentMethod: PXPaymentMethod, dataSource: [Cellable], email: String? = nil, mercadoPagoServicesAdapter: MercadoPagoServicesAdapter, advancedConfiguration: PXAdvancedConfiguration) {
        super.init(amountHelper: amountHelper, screenTitle: "¿En cuántas cuotas?".localized, cardSectionVisible: true, cardSectionView: CardFrontView(frame: self.cardViewRect), totalRowVisible: true, showBankInsterestWarning: true, token: token, paymentMethods: [paymentMethod], dataSource: dataSource, email: email, mercadoPagoServicesAdapter: mercadoPagoServicesAdapter, advancedConfiguration: advancedConfiguration)
    }

    override func showFloatingTotalRow() -> Bool {
        return true
    }

    override func getDefaultRowCellHeight() -> CGFloat {
        return 60
    }

    override func isBankInterestCellFor(indexPath: IndexPath) -> Bool {
        return indexPath.row == CardSectionCells.bankInterestWarning.rawValue && indexPath.section == Sections.card.rawValue && showBankInsterestCell()
    }

    override func getScreenProperties() -> [String: Any] {
        var properties: [String: Any] = [:]
        properties["payment_method_id"] = paymentMethods.first?.getPaymentIdForTracking()
        properties["payment_method_type"] = paymentMethods.first?.getPaymentTypeForTracking()
        if let token = token as? PXCardInformation {
            properties["card_id"] =  token.getCardId()
        }
        if let issuer = amountHelper.getPaymentData().issuer {
            properties["issuer_id"] = Int64(issuer.id)
        }
        var dic: [Any] = []
        for installmentObj in dataSource {
            if let payerCost = installmentObj as? PXPayerCost {
                dic.append(payerCost.getPayerCostForTracking())
            }
        }
        properties["available_installments"] = dic
        return properties
    }

    override func getScreenPath() -> String {
        return TrackingPaths.Screens.getInstallmentsPath()
    }

}

internal class FinancialInstitutionViewModel: AdditionalStepViewModel {

    init(amountHelper: PXAmountHelper, token: PXCardInformationForm?, paymentMethod: PXPaymentMethod, dataSource: [Cellable], mercadoPagoServicesAdapter: MercadoPagoServicesAdapter, advancedConfiguration: PXAdvancedConfiguration) {
        super.init(amountHelper: amountHelper, screenTitle: "¿Cuál es tu banco?".localized, cardSectionVisible: false, cardSectionView: nil, totalRowVisible: false, token: token, paymentMethods: [paymentMethod], dataSource: dataSource, mercadoPagoServicesAdapter: mercadoPagoServicesAdapter, advancedConfiguration: advancedConfiguration)
    }
}

internal class EntityTypeViewModel: AdditionalStepViewModel {
    override var maxFontSize: CGFloat { return 21 }

    let cardViewRect = CGRect(x: 0, y: 0, width: 100, height: 30)

    init(amountHelper: PXAmountHelper, token: PXCardInformationForm?, paymentMethod: PXPaymentMethod, dataSource: [Cellable], mercadoPagoServicesAdapter: MercadoPagoServicesAdapter, advancedConfiguration: PXAdvancedConfiguration) {
        super.init(amountHelper: amountHelper, screenTitle: "¿Cuál es el tipo de persona?".localized, cardSectionVisible: true, cardSectionView: IdentificationCardView(frame: self.cardViewRect), totalRowVisible: false, token: token, paymentMethods: [paymentMethod], dataSource: dataSource, mercadoPagoServicesAdapter: mercadoPagoServicesAdapter, advancedConfiguration: advancedConfiguration)
    }
}
