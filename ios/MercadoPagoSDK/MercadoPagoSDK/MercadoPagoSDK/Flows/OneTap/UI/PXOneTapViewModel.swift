//
//  PXOneTapViewModel.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 15/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXOneTapViewModel: PXReviewViewModel {
    internal var publicKey: String = ""
    internal var privateKey: String?
    internal var siteId: String = ""
    internal var excludedPaymentTypeIds: [String] = []
    // Privates
    private var cardSliderViewModel: [PXCardSliderViewModel] = [PXCardSliderViewModel]()
    private let installmentsRowMessageFontSize = PXLayout.XS_FONT
    // Publics
    var expressData: [PXOneTapDto]?
    var paymentMethods: [PXPaymentMethod] = [PXPaymentMethod]()
    var items: [PXItem] = [PXItem]()
    var payerCompliance: PXPayerCompliance?

    var splitPaymentEnabled: Bool = false
    var splitPaymentSelectionByUser: Bool?
    var additionalInfoSummary: PXAdditionalInfoSummary?
    var disabledOption: PXDisabledOption?

    // Current flow.
    weak var currentFlow: OneTapFlow?

    public init(amountHelper: PXAmountHelper, paymentOptionSelected: PaymentMethodOption?, advancedConfig: PXAdvancedConfiguration, userLogged: Bool, disabledOption: PXDisabledOption? = nil, escProtocol: MercadoPagoESC?, currentFlow: OneTapFlow?) {
        self.disabledOption = disabledOption
        self.currentFlow = currentFlow
        super.init(amountHelper: amountHelper, paymentOptionSelected: paymentOptionSelected, advancedConfig: advancedConfig, userLogged: userLogged, escProtocol: escProtocol)
    }

    override func shouldValidateWithBiometric(withCardId: String? = nil) -> Bool {
        guard let oneTapFlow = currentFlow else { return false }
        return !oneTapFlow.needSecurityCodeValidation()
    }
}

// MARK: ViewModels Publics.
extension PXOneTapViewModel {
    func rearrangeDisabledOption(_ oneTapNodes: [PXOneTapDto], disabledOption: PXDisabledOption?) -> [PXOneTapDto] {
        guard let disabledOption = disabledOption else {return oneTapNodes}
        var rearrangedNodes = [PXOneTapDto]()
        var disabledNode: PXOneTapDto?
        for node in oneTapNodes {
            if disabledOption.isCardIdDisabled(cardId: node.oneTapCard?.cardId) || disabledOption.isPMDisabled(paymentMethodId: node.paymentMethodId) {
                disabledNode = node
            } else {
                rearrangedNodes.append(node)
            }
        }

        if let disabledNode = disabledNode {
            rearrangedNodes.append(disabledNode)
        }
        return rearrangedNodes
    }

    func createCardSliderViewModel() {
        var sliderModel: [PXCardSliderViewModel] = []
        guard let oneTapNode = expressData else { return }

        // Rearrange disabled options
        let reArrangedNodes = rearrangeDisabledOption(oneTapNode, disabledOption: disabledOption)
        for targetNode in reArrangedNodes {

            //Charge rule message when amount is zero
            var chargeRuleMessage = getCardBottomMessage(paymentTypeId: targetNode.paymentTypeId, benefits: targetNode.benefits, selectedPayerCost: nil)
            let benefits = targetNode.benefits

            let statusConfig = getStatusConfig(currentStatus: targetNode.status, cardId: targetNode.oneTapCard?.cardId, paymentMethodId: targetNode.paymentMethodId)

            // Add New Card
            if let newCard = targetNode.newCard {
                let newCardData = PXAddNewMethodData(title: newCard.label, subtitle: newCard.descriptionText)

                var newOfflineData: PXAddNewMethodData?
                if let offlineMethods = targetNode.offlineMethods {
                    newOfflineData = PXAddNewMethodData(title: offlineMethods.label, subtitle: offlineMethods.descriptionText)
                }

                let emptyCard = EmptyCard(newCardData: newCardData, newOfflineData: newOfflineData)
                sliderModel.append(PXCardSliderViewModel("", "", "", emptyCard, nil, [PXPayerCost](), nil, nil, false, amountConfiguration: nil, status: statusConfig, benefits: benefits))

            } else if let offlineMethods = targetNode.offlineMethods {
                var newOfflineData: PXAddNewMethodData?
                newOfflineData = PXAddNewMethodData(title: offlineMethods.label, subtitle: offlineMethods.descriptionText)
                let emptyCard = EmptyCard(newCardData: nil, newOfflineData: newOfflineData)
                sliderModel.append(PXCardSliderViewModel("", "", "", emptyCard, nil, [PXPayerCost](), nil, nil, false, amountConfiguration: nil, status: statusConfig, benefits: benefits))
            }
            //  Account money
            if let accountMoney = targetNode.accountMoney, let paymentMethodId = targetNode.paymentMethodId {
                let displayTitle = accountMoney.cardTitle ?? ""
                let cardData = PXCardDataFactory().create(cardName: displayTitle, cardNumber: "", cardCode: "", cardExpiration: "")
                let amountConfiguration = amountHelper.paymentConfigurationService.getAmountConfigurationForPaymentMethod(accountMoney.getId())

                let viewModelCard = PXCardSliderViewModel(paymentMethodId, targetNode.paymentTypeId, "", AccountMoneyCard(), cardData, [PXPayerCost](), nil, accountMoney.getId(), false, amountConfiguration: amountConfiguration, status: statusConfig, bottomMessage: chargeRuleMessage, benefits: benefits)
                viewModelCard.setAccountMoney(accountMoneyBalance: accountMoney.availableBalance)
                let attributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.font: Utils.getFont(size: installmentsRowMessageFontSize), NSAttributedString.Key.foregroundColor: ThemeManager.shared.greyColor()]
                viewModelCard.displayMessage = NSAttributedString(string: accountMoney.sliderTitle ?? "", attributes: attributes)
                sliderModel.append(viewModelCard)
            } else if let targetCardData = targetNode.oneTapCard {
                if let cardName = targetCardData.cardUI?.name, let cardNumber = targetCardData.cardUI?.lastFourDigits, let cardExpiration = targetCardData.cardUI?.expiration, let paymentMethodId = targetNode.paymentMethodId {

                    let cardData = PXCardDataFactory().create(cardName: cardName.uppercased(), cardNumber: cardNumber, cardCode: "", cardExpiration: cardExpiration, cardPattern: targetCardData.cardUI?.cardPattern)

                    let templateCard = TemplateCard()
                    if let cardPattern = targetCardData.cardUI?.cardPattern {
                        templateCard.cardPattern = cardPattern
                    }

                    if let cardBackgroundColor = targetCardData.cardUI?.color {
                        templateCard.cardBackgroundColor = cardBackgroundColor.hexToUIColor()
                    }

                    if let cardFontColor = targetCardData.cardUI?.fontColor {
                        templateCard.cardFontColor = cardFontColor.hexToUIColor()
                    }

                    if let paymentMethodId = targetNode.paymentMethodId, let paymentMethodImage = ResourceManager.shared.getPaymentMethodCardImage(paymentMethodId: paymentMethodId.lowercased()) {
                        templateCard.cardLogoImage = paymentMethodImage
                    }

                    let amountConfiguration = amountHelper.paymentConfigurationService.getAmountConfigurationForPaymentMethod(targetCardData.cardId)
                    let defaultEnabledSplitPayment: Bool = amountConfiguration?.splitConfiguration?.splitEnabled ?? false

                    var payerCost: [PXPayerCost] = [PXPayerCost]()
                    if let pCost = amountHelper.paymentConfigurationService.getPayerCostsForPaymentMethod(targetCardData.cardId, splitPaymentEnabled: defaultEnabledSplitPayment) {
                        payerCost = pCost
                    }

                    var targetIssuerId: String = ""
                    if let issuerId = targetNode.oneTapCard?.cardUI?.issuerId {
                        targetIssuerId = issuerId
                    }

                    if let issuerImageName = targetNode.oneTapCard?.cardUI?.issuerImage {
                        templateCard.bankImage = ResourceManager.shared.getIssuerCardImage(issuerImageName: issuerImageName)
                    }

                    var showArrow: Bool = true
                    var displayMessage: NSAttributedString?
                    if let targetPaymentMethodId = targetNode.paymentTypeId, targetPaymentMethodId == PXPaymentTypes.DEBIT_CARD.rawValue {
                        showArrow = false
                        if let splitConfiguration = amountHelper.paymentConfigurationService.getSplitConfigurationForPaymentMethod(targetCardData.cardId), let totalAmount = amountHelper.paymentConfigurationService.getSelectedPayerCostsForPaymentMethod(targetCardData.cardId, splitPaymentEnabled: splitConfiguration.splitEnabled)?.totalAmount {
                            // If it's debit and has split, update split message
                            displayMessage = getSplitMessageForDebit(amountToPay: totalAmount)
                        }
                    } else if payerCost.count == 1 {
                        showArrow = false
                    } else if amountHelper.paymentConfigurationService.getPayerCostsForPaymentMethod(targetCardData.cardId) == nil {
                        showArrow = false
                    }

                    let selectedPayerCost = amountHelper.paymentConfigurationService.getSelectedPayerCostsForPaymentMethod(targetCardData.cardId, splitPaymentEnabled: defaultEnabledSplitPayment)

                    chargeRuleMessage = getCardBottomMessage(paymentTypeId: targetNode.paymentTypeId, benefits: targetNode.benefits, selectedPayerCost: selectedPayerCost)

                    let viewModelCard = PXCardSliderViewModel(paymentMethodId, targetNode.paymentTypeId, targetIssuerId, templateCard, cardData, payerCost, selectedPayerCost, targetCardData.cardId, showArrow, amountConfiguration: amountConfiguration, status: statusConfig, bottomMessage: chargeRuleMessage, benefits: benefits)

                    viewModelCard.displayMessage = displayMessage
                    sliderModel.append(viewModelCard)
                }
            } else if let consumerCredits = targetNode.oneTapCreditsInfo, let amountConfiguration = amountHelper.paymentConfigurationService.getAmountConfigurationForPaymentMethod(targetNode.paymentMethodId), let paymentMethodId = targetNode.paymentMethodId {

                let cardData = PXCardDataFactory().create(cardName: "", cardNumber: "", cardCode: "", cardExpiration: "")

                let creditsViewModel = PXCreditsViewModel(consumerCredits)

                let viewModelCard = PXCardSliderViewModel(paymentMethodId, targetNode.paymentTypeId, "", ConsumerCreditsCard(creditsViewModel, isDisabled: !targetNode.status.enabled), cardData, amountConfiguration.payerCosts ?? [], amountConfiguration.selectedPayerCost, "", true, amountConfiguration: amountConfiguration, creditsViewModel: creditsViewModel, status: statusConfig, bottomMessage: chargeRuleMessage, benefits: benefits)

                sliderModel.append(viewModelCard)
            }
        }
        cardSliderViewModel = sliderModel
    }

    func getInstallmentInfoViewModel() -> [PXOneTapInstallmentInfoViewModel] {
        var model: [PXOneTapInstallmentInfoViewModel] = [PXOneTapInstallmentInfoViewModel]()
        let sliderViewModel = getCardSliderViewModel()
        for sliderNode in sliderViewModel {
            let payerCost = sliderNode.payerCost
            let selectedPayerCost = sliderNode.selectedPayerCost
            let installment = PXInstallment(issuer: nil, payerCosts: payerCost, paymentMethodId: nil, paymentTypeId: nil)

            let disabledMessage: NSAttributedString = sliderNode.status.mainMessage?.getAttributedString(fontSize: installmentsRowMessageFontSize, textColor: ThemeManager.shared.getAccentColor()) ?? "".toAttributedString()

            let shouldShowInstallmentsHeader = sliderNode.shouldShowInstallmentsHeader()

            if !sliderNode.status.enabled {
                let disabledInfoModel = PXOneTapInstallmentInfoViewModel(text: disabledMessage, installmentData: nil, selectedPayerCost: nil, shouldShowArrow: false, status: sliderNode.status, benefits: sliderNode.benefits, shouldShowInstallmentsHeader: shouldShowInstallmentsHeader)
                model.append(disabledInfoModel)
            } else if sliderNode.paymentTypeId == PXPaymentTypes.DEBIT_CARD.rawValue {
                // If it's debit and has split, update split message
                if let amountToPay = sliderNode.selectedPayerCost?.totalAmount {
                    let displayMessage = getSplitMessageForDebit(amountToPay: amountToPay)
                    let installmentInfoModel = PXOneTapInstallmentInfoViewModel(text: displayMessage, installmentData: installment, selectedPayerCost: selectedPayerCost, shouldShowArrow: sliderNode.shouldShowArrow, status: sliderNode.status, benefits: sliderNode.benefits, shouldShowInstallmentsHeader: shouldShowInstallmentsHeader)
                    model.append(installmentInfoModel)
                }

            } else {
                if let displayMessage = sliderNode.displayMessage {
                    let installmentInfoModel = PXOneTapInstallmentInfoViewModel(text: displayMessage, installmentData: installment, selectedPayerCost: selectedPayerCost, shouldShowArrow: sliderNode.shouldShowArrow, status: sliderNode.status, benefits: sliderNode.benefits, shouldShowInstallmentsHeader: shouldShowInstallmentsHeader)
                    model.append(installmentInfoModel)
                } else {
                    let isDigitalCurrency: Bool = sliderNode.creditsViewModel != nil
                    let installmentInfoModel = PXOneTapInstallmentInfoViewModel(text: getInstallmentInfoAttrText(selectedPayerCost, isDigitalCurrency, interestFreeConfig: sliderNode.benefits?.interestFree), installmentData: installment, selectedPayerCost: selectedPayerCost, shouldShowArrow: sliderNode.shouldShowArrow, status: sliderNode.status, benefits: sliderNode.benefits, shouldShowInstallmentsHeader: shouldShowInstallmentsHeader)
                    model.append(installmentInfoModel)
                }
            }
        }
        return model
    }

    func getHeaderViewModel(selectedCard: PXCardSliderViewModel?) -> PXOneTapHeaderViewModel {

        let splitConfiguration = selectedCard?.amountConfiguration?.splitConfiguration
        let composer = PXSummaryComposer(amountHelper: amountHelper,
                                           additionalInfoSummary: additionalInfoSummary,
                                           selectedCard: selectedCard,
                                           shouldDisplayChargesHelp: shouldDisplayChargesHelp())
        updatePaymentData(composer: composer)
        let summaryData = composer.summaryItems
        // Populate header display data. From SP pref AdditionalInfo or instore retrocompatibility.
        let (headerTitle, headerSubtitle, headerImage) = getSummaryHeader(item: items.first, additionalInfoSummaryData: additionalInfoSummary)

        let headerVM = PXOneTapHeaderViewModel(icon: headerImage, title: headerTitle, subTitle: headerSubtitle, data: summaryData, splitConfiguration: splitConfiguration)
        return headerVM
    }

    func updatePaymentData(composer: PXSummaryComposer) {
        if let discountData = composer.getDiscountData() {
            let discountConfiguration = discountData.discountConfiguration
            let campaign = discountData.campaign
            let discount = discountConfiguration.getDiscountConfiguration().discount
            let consumedDiscount = discountConfiguration.getDiscountConfiguration().isNotAvailable
            amountHelper.getPaymentData().setDiscount(discount, withCampaign: campaign, consumedDiscount: consumedDiscount)
        } else {
            amountHelper.getPaymentData().clearDiscount()
        }
    }

    func getSummaryHeader(item: PXItem?, additionalInfoSummaryData: PXAdditionalInfoSummary?) -> (title: String, subtitle: String?, image: UIImage) {
        var headerImage: UIImage = UIImage()
        var headerTitle: String = ""
        var headerSubtitle: String?
        if let defaultImage = ResourceManager.shared.getImage("MPSDK_review_iconoCarrito_white") {
            headerImage = defaultImage
        }

        if let additionalSummaryData = additionalInfoSummaryData, let additionalSummaryTitle = additionalSummaryData.title, !additionalSummaryTitle.isEmpty {
            // SP and new scenario based on Additional Info Summary
            headerTitle = additionalSummaryTitle
            headerSubtitle = additionalSummaryData.subtitle
            if let headerUrl = additionalSummaryData.imageUrl {
                headerImage = PXUIImage(url: headerUrl)
            }
        } else {
            // Instore scenario. Retrocompatibility
            // To deprecate. After instore migrate current preferences.

            // Title desc from item
            if let headerTitleStr = item?._description {
                headerTitle = headerTitleStr
            } else if let headerTitleStr = item?.title {
                headerTitle = headerTitleStr
            }
            headerSubtitle = nil
            // Image from item
            if let headerUrl = item?.getPictureURL() {
                headerImage = PXUIImage(url: headerUrl)
            }
        }
        return (title: headerTitle, subtitle: headerSubtitle, image: headerImage)
    }

    func getCardSliderViewModel() -> [PXCardSliderViewModel] {
        return cardSliderViewModel
    }

    func updateCardSliderModel(at index: Int, bottomMessage: String?) {
        if cardSliderViewModel.indices.contains(index) {
            cardSliderViewModel[index].bottomMessage = bottomMessage
        }
    }

    func updateAllCardSliderModels(splitPaymentEnabled: Bool) {
        for index in cardSliderViewModel.indices {
            _ = updateCardSliderSplitPaymentPreference(splitPaymentEnabled: splitPaymentEnabled, forIndex: index)
        }
    }

    func updateCardSliderSplitPaymentPreference(splitPaymentEnabled: Bool, forIndex: Int) -> Bool {
        if cardSliderViewModel.indices.contains(forIndex) {
            if splitPaymentEnabled {
                cardSliderViewModel[forIndex].payerCost = cardSliderViewModel[forIndex].amountConfiguration?.splitConfiguration?.primaryPaymentMethod?.payerCosts ?? []
                cardSliderViewModel[forIndex].selectedPayerCost = cardSliderViewModel[forIndex].amountConfiguration?.splitConfiguration?.primaryPaymentMethod?.selectedPayerCost
                cardSliderViewModel[forIndex].amountConfiguration?.splitConfiguration?.splitEnabled = splitPaymentEnabled

                // Show arrow to switch installments
                if cardSliderViewModel[forIndex].payerCost.count > 1 {
                    cardSliderViewModel[forIndex].shouldShowArrow = true
                } else {
                    cardSliderViewModel[forIndex].shouldShowArrow = false
                }

            } else {
                cardSliderViewModel[forIndex].payerCost = cardSliderViewModel[forIndex].amountConfiguration?.payerCosts ?? []
                cardSliderViewModel[forIndex].selectedPayerCost = cardSliderViewModel[forIndex].amountConfiguration?.selectedPayerCost
                cardSliderViewModel[forIndex].amountConfiguration?.splitConfiguration?.splitEnabled = splitPaymentEnabled

                // Show arrow to switch installments
                if cardSliderViewModel[forIndex].payerCost.count > 1 {
                    cardSliderViewModel[forIndex].shouldShowArrow = true
                } else {
                    cardSliderViewModel[forIndex].shouldShowArrow = false
                }
            }
            return true
        }
        return false
    }

    func updateCardSliderViewModel(newPayerCost: PXPayerCost?, forIndex: Int) -> Bool {
        if cardSliderViewModel.indices.contains(forIndex) {
            cardSliderViewModel[forIndex].selectedPayerCost = newPayerCost
            cardSliderViewModel[forIndex].userDidSelectPayerCost = true
            return true
        }
        return false
    }

    func updateCardSliderViewModel(pxCardSliderViewModel: [PXCardSliderViewModel]) {
        self.cardSliderViewModel = pxCardSliderViewModel
    }

    func getPaymentMethod(targetId: String) -> PXPaymentMethod? {
        return paymentMethods.filter({ return $0.id == targetId }).first
    }

    func shouldDisplayChargesHelp() -> Bool {
        return getChargeRuleViewController() != nil
    }

    func getCardBottomMessage(paymentTypeId: String?, benefits: PXBenefits?, selectedPayerCost: PXPayerCost?) -> String? {
        if let chargeRuleMessage = getChargeRuleBottomMessage(paymentTypeId) {
            return chargeRuleMessage
        }

        guard let selectedInstallments = selectedPayerCost?.installments else {
            return nil
        }

        guard let reimbursementAppliedInstallments = benefits?.reimbursement?.appliedInstallments else {
            return nil
        }

        if reimbursementAppliedInstallments.contains(selectedInstallments) {
            return benefits?.reimbursement?.card?.message
        }

        return nil
    }

    func getChargeRuleBottomMessage(_ paymentTypeId: String?) -> String? {
        let chargeRule = getChargeRule(paymentTypeId: paymentTypeId)
        return chargeRule?.message
    }

    func getChargeRuleViewController() -> UIViewController? {
        let chargeRule = getChargeRule(paymentTypeId: amountHelper.getPaymentData().paymentMethod?.paymentTypeId)
        let vc = chargeRule?.detailModal
        return vc
    }

    func getChargeRule(paymentTypeId: String?) -> PXPaymentTypeChargeRule? {
        guard let rules = amountHelper.chargeRules, let paymentTypeId = paymentTypeId else {
            return nil
        }
        let filteredRules = rules.filter({
            $0.paymentTypeId == paymentTypeId
        })
        return filteredRules.first
    }

    func shouldUseOldCardForm() -> Bool {
        if let newCardVersion = expressData?.filter({$0.newCard != nil}).first?.newCard?.version {
            return newCardVersion == "v1"
        }
        return false
    }
}

// MARK: Privates.
extension PXOneTapViewModel {

    private func getInstallmentInfoAttrText(_ payerCost: PXPayerCost?, _ isDigitalCurrency: Bool = false, interestFreeConfig: PXInstallmentsConfiguration?) -> NSMutableAttributedString {
        let text: NSMutableAttributedString = NSMutableAttributedString(string: "")

        if let payerCostData = payerCost {
            // First attr
            let currency = SiteManager.shared.getCurrency()
            let firstAttributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.font: Utils.getSemiBoldFont(size: installmentsRowMessageFontSize), NSAttributedString.Key.foregroundColor: ThemeManager.shared.boldLabelTintColor()]
            let amountDisplayStr = Utils.getAmountFormated(amount: payerCostData.installmentAmount, forCurrency: currency).trimmingCharacters(in: .whitespaces)
            let firstText = "\(payerCostData.installments)x \(amountDisplayStr)"
            let firstAttributedString = NSAttributedString(string: firstText, attributes: firstAttributes)
            text.append(firstAttributedString)

            // Second attr
            if let interestFreeConfig = interestFreeConfig, interestFreeConfig.appliedInstallments.contains(payerCostData.installments), let rowMessage = interestFreeConfig.installmentRow?.getAttributedString(fontSize: installmentsRowMessageFontSize) {
                text.append(String.SPACE.toAttributedString())
                text.append(rowMessage)
            }

            // Third attr
            if let cftDisplayStr = payerCostData.getCFTValue() {
                if (payerCostData.hasCFTValue() && (payerCostData.installments != 1)) || isDigitalCurrency {
                    let thirdAttributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.font: Utils.getFont(size: installmentsRowMessageFontSize), NSAttributedString.Key.foregroundColor: ThemeManager.shared.greyColor()]
                    let thirdText = " CFT: \(cftDisplayStr)"
                    let thirdAttributedString = NSAttributedString(string: thirdText, attributes: thirdAttributes)
                    text.append(thirdAttributedString)
                }

            }
        }
        return text
    }

    func getSplitMessageForDebit(amountToPay: Double) -> NSAttributedString {
        var amount: String = ""
        let attributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.font: Utils.getSemiBoldFont(size: installmentsRowMessageFontSize), NSAttributedString.Key.foregroundColor: ThemeManager.shared.boldLabelTintColor()]

        amount = Utils.getAmountFormated(amount: amountToPay, forCurrency: SiteManager.shared.getCurrency())
        return NSAttributedString(string: amount, attributes: attributes)
    }

    func getStatusConfig(currentStatus: PXStatus, cardId: String?, paymentMethodId: String?) -> PXStatus {
        guard let disabledOption = disabledOption else { return currentStatus }

        if disabledOption.isCardIdDisabled(cardId: cardId) || disabledOption.isPMDisabled(paymentMethodId: paymentMethodId) {
            return disabledOption.getStatus() ?? currentStatus
        } else {
            return currentStatus
        }
    }

    func getExternalViewControllerForSubtitle() -> UIViewController? {
        return advancedConfiguration.dynamicViewControllersConfiguration.filter({
            $0.position(store: PXCheckoutStore.sharedInstance) == .DID_TAP_ONETAP_HEADER
        }).first?.viewController(store: PXCheckoutStore.sharedInstance)
    }

    func getOfflineMethods() -> PXOfflineMethods? {
        guard let expressData = expressData else {
            return nil
        }
        for node in expressData {
            if let offlineMethods = node.offlineMethods {
                return offlineMethods
            }
        }
        return nil
    }
}
