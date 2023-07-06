//
//  PXReviewViewModel.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 27/2/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXReviewViewModel: NSObject {

    static let ERROR_DELTA = 0.001
    public static var CUSTOMER_ID = ""

    private weak var escProtocol: MercadoPagoESC?
    internal var amountHelper: PXAmountHelper
    var paymentOptionSelected: PaymentMethodOption?
    var advancedConfiguration: PXAdvancedConfiguration
    var userLogged: Bool

    public init(amountHelper: PXAmountHelper, paymentOptionSelected: PaymentMethodOption?, advancedConfig: PXAdvancedConfiguration, userLogged: Bool, escProtocol: MercadoPagoESC?) {
        PXReviewViewModel.CUSTOMER_ID = ""
        self.amountHelper = amountHelper
        self.paymentOptionSelected = paymentOptionSelected
        self.advancedConfiguration = advancedConfig
        self.userLogged = userLogged
        self.escProtocol = escProtocol
    }

    func shouldValidateWithBiometric(withCardId: String? = nil) -> Bool {
        // Validation is mandatory for payment methods != (credit or debit card).
        if !isPaymentMethodDebitOrCredit() { return true }

        // If escProtocol implementation is null, ESC is not supported.
        // We should´t validate with Biometric.
        guard let escImplementation = escProtocol else { return false }

        if escImplementation.hasESCEnable() {
            let savedCardIds = escImplementation.getSavedCardIds()
            // If we found cardId in ESC, we should validate with biometric.
            if let targetCardId = withCardId {
                return savedCardIds.contains(targetCardId)
            } else if let currentCard = paymentOptionSelected as? PXCardInformation {
                return savedCardIds.contains(currentCard.getCardId())
            }
        }

        // ESC is not enabled or cardId not found.
        // We should´t validate with Biometric.
        return false
    }
}

// MARK: - Logic.
extension PXReviewViewModel {
    // Logic.
    func isPaymentMethodSelectedCard() -> Bool {
        return self.amountHelper.getPaymentData().hasPaymentMethod() && self.amountHelper.getPaymentData().getPaymentMethod()!.isCard
    }

    func isPaymentMethodDebitOrCredit() -> Bool {
        guard let pMethod = amountHelper.getPaymentData().getPaymentMethod() else { return false }
        return pMethod.isDebitCard || pMethod.isCreditCard
    }

    func isPaymentMethodSelected() -> Bool {
        return self.amountHelper.getPaymentData().hasPaymentMethod()
    }

    func shouldShowPayer() -> Bool {
        if let paymentMethod = self.amountHelper.getPaymentData().getPaymentMethod() {
            return paymentMethod.isPayerInfoRequired
        }

        return false
    }

    func shouldShowTermsAndCondition() -> Bool {
        return !userLogged
    }

    func shouldShowDiscountTermsAndCondition() -> Bool {
        if self.amountHelper.discount != nil {
            return true
        }
        return false
    }

    func shouldShowCreditsTermsAndConditions() -> Bool {
        return creditsTermsAndConditions() != nil
    }

    func creditsTermsAndConditions() -> PXTermsDto? {
        return self.amountHelper.getPaymentData().getPaymentMethod()?.creditsDisplayInfo?.termsAndConditions
    }

    func getDiscountTermsAndConditionView(shouldAddMargins: Bool = true) -> PXTermsAndConditionView {
        let discountTermsAndConditionView = PXDiscountTermsAndConditionView(amountHelper: amountHelper, shouldAddMargins: shouldAddMargins)
        return discountTermsAndConditionView
    }

    func shouldShowInstallmentSummary() -> Bool {
        return isPaymentMethodSelectedCard() && self.amountHelper.getPaymentData().getPaymentMethod()!.paymentTypeId != "debit_card" && self.amountHelper.getPaymentData().hasPayerCost() && self.amountHelper.getPaymentData().getPayerCost()!.installments != 1
    }

    func shouldDisplayNoRate() -> Bool {
        return self.amountHelper.getPaymentData().hasPayerCost() && !self.amountHelper.getPaymentData().getPayerCost()!.hasInstallmentsRate() && self.amountHelper.getPaymentData().getPayerCost()!.installments != 1
    }

    func hasPayerCostAddionalInfo() -> Bool {
        return self.amountHelper.getPaymentData().hasPayerCost() && self.amountHelper.getPaymentData().getPayerCost()!.getCFTValue() != nil && self.amountHelper.getPaymentData().paymentMethod!.isCreditCard
    }

    func hasConfirmAdditionalInfo() -> Bool {
        return hasPayerCostAddionalInfo() || needUnlockCardComponent()
    }

    func needUnlockCardComponent() -> Bool {
        return getUnlockLink() != nil
    }

    func getDynamicViewController() -> UIViewController? {
        let filteredViewControllers = advancedConfiguration.dynamicViewControllersConfiguration.filter { (dynamicViewControllerProtocol) -> Bool in
            if dynamicViewControllerProtocol.position(store: PXCheckoutStore.sharedInstance) == PXDynamicViewControllerPosition.DID_ENTER_REVIEW_AND_CONFIRM {
                return true
            }
            return false
        }
        return filteredViewControllers.first?.viewController(store: PXCheckoutStore.sharedInstance)
    }
}

// MARK: - Getters
extension PXReviewViewModel {
    func getTotalAmount() -> Double {
        return self.amountHelper.amountToPay
    }

    func getUnlockLink() -> URL? {
        let dictionary = ResourceManager.shared.getDictionaryForResource(named: "UnlockCardLinks")
        let site = SiteManager.shared.getSiteId()
        guard let issuerID = self.amountHelper.getPaymentData().getIssuer()?.id else {
            return nil
        }
        let searchString: String = site + "_" + "\(issuerID)"

        if let link = dictionary?.value(forKey: searchString) as? String {
            return URL(string: link)
        }

        return nil
    }

    func getClearPaymentData() -> PXPaymentData {
        let newPaymentData: PXPaymentData = self.amountHelper.getPaymentData().copy() as? PXPaymentData ?? self.amountHelper.getPaymentData()
        newPaymentData.clearCollectedData()
        return newPaymentData
    }

    func getClearPayerData() -> PXPaymentData {
        let newPaymentData: PXPaymentData = self.amountHelper.getPaymentData().copy() as? PXPaymentData ?? self.amountHelper.getPaymentData()
        newPaymentData.clearPayerData()
        return newPaymentData
    }

    func getFloatingConfirmViewHeight() -> CGFloat {
        return 82 + getCustomerCreditsViewHeight() + PXLayout.getSafeAreaBottomInset() / 2
    }

    func getCustomerCreditsViewHeight() -> CGFloat {
        if shouldShowCreditsTermsAndConditions() {
            return PXTermsAndConditionView().DEFAULT_CREDITS_HEIGHT
        }
        return 0
    }

    func getSummaryViewModel(amount: Double) -> Summary {

        var summary: Summary
        let charge = self.amountHelper.chargeRuleAmount

        // TODO: Check Double type precision.
        if abs(amount - (self.advancedConfiguration.reviewConfirmConfiguration.getSummaryTotalAmount() + charge)) <= PXReviewViewModel.ERROR_DELTA {
            summary = Summary(details: self.advancedConfiguration.reviewConfirmConfiguration.details)
            if self.advancedConfiguration.reviewConfirmConfiguration.details[SummaryType.PRODUCT]?.details.count == 0 { //Si solo le cambio el titulo a Productos
                summary.addAmountDetail(detail: SummaryItemDetail(amount: self.amountHelper.preferenceAmount), type: SummaryType.PRODUCT)
            }
        } else {
            summary = getDefaultSummary()
            if self.advancedConfiguration.reviewConfirmConfiguration.details[SummaryType.PRODUCT]?.details.count == 0 { //Si solo le cambio el titulo a Productos
                if let title = self.advancedConfiguration.reviewConfirmConfiguration.details[SummaryType.PRODUCT]?.title {
                    summary.updateTitle(type: SummaryType.PRODUCT, oneWordTitle: title)
                }
            }
        }

        if charge > PXReviewViewModel.ERROR_DELTA {
            if let chargesTitle = self.advancedConfiguration.reviewConfirmConfiguration.summaryTitles[SummaryType.CHARGE] {
                let chargesAmountDetail = SummaryItemDetail(name: "", amount: charge)
                let chargesSummaryDetail = SummaryDetail(title: chargesTitle, detail: chargesAmountDetail)
                summary.addSummaryDetail(summaryDetail: chargesSummaryDetail, type: SummaryType.CHARGE)
            }
        }

        if let discount = self.amountHelper.getPaymentData().discount {
            let discountAmountDetail = SummaryItemDetail(name: discount.description, amount: discount.couponAmount)

            if summary.details[SummaryType.DISCOUNT] != nil {
                summary.addAmountDetail(detail: discountAmountDetail, type: SummaryType.DISCOUNT)
            } else {
                let discountSummaryDetail = SummaryDetail(title: self.advancedConfiguration.reviewConfirmConfiguration.summaryTitles[SummaryType.DISCOUNT]!, detail: discountAmountDetail)
                summary.addSummaryDetail(summaryDetail: discountSummaryDetail, type: SummaryType.DISCOUNT)
            }
            summary.details[SummaryType.DISCOUNT]?.titleColor = ThemeManager.shared.noTaxAndDiscountLabelTintColor()
            summary.details[SummaryType.DISCOUNT]?.amountColor = ThemeManager.shared.noTaxAndDiscountLabelTintColor()
        }
        if self.amountHelper.getPaymentData().payerCost != nil {
            var interest = 0.0

            if (self.amountHelper.getPaymentData().discount?.couponAmount) != nil {
                interest = self.amountHelper.amountToPay - (self.amountHelper.preferenceAmountWithCharges - self.amountHelper.amountOff)
            } else {
                interest = self.amountHelper.amountToPay - self.amountHelper.preferenceAmountWithCharges
            }

            if interest > PXReviewViewModel.ERROR_DELTA {
                let interestAmountDetail = SummaryItemDetail(amount: interest)
                if summary.details[SummaryType.CHARGE] != nil {
                    summary.addAmountDetail(detail: interestAmountDetail, type: SummaryType.CHARGE)
                } else {
                    let interestSummaryDetail = SummaryDetail(title: self.advancedConfiguration.reviewConfirmConfiguration.summaryTitles[SummaryType.CHARGE]!, detail: interestAmountDetail)
                    summary.addSummaryDetail(summaryDetail: interestSummaryDetail, type: SummaryType.CHARGE)
                }
            }
        }
        if let disclaimer = self.advancedConfiguration.reviewConfirmConfiguration.getDisclaimerText() {
            summary.disclaimer = disclaimer
            summary.disclaimerColor = self.advancedConfiguration.reviewConfirmConfiguration.getDisclaimerTextColor()
        }
        return summary
    }

    func getDefaultSummary() -> Summary {
        let productSummaryDetail = SummaryDetail(title: self.advancedConfiguration.reviewConfirmConfiguration.summaryTitles[SummaryType.PRODUCT]!, detail: SummaryItemDetail(amount: self.amountHelper.preferenceAmount))

        return Summary(details: [SummaryType.PRODUCT: productSummaryDetail])
    }
}

// MARK: - Components builders.
extension PXReviewViewModel {

    func buildPaymentMethodComponent(withAction: PXAction?) -> PXPaymentMethodComponent? {

        guard let pm = self.amountHelper.getPaymentData().getPaymentMethod() else {
            return nil
        }

        let issuer = self.amountHelper.getPaymentData().getIssuer()
        let paymentMethodName = pm.name ?? ""
        let paymentMethodIssuerName = issuer?.name ?? ""

        let image = PXImageService.getIconImageFor(paymentMethod: pm)
        var title = NSAttributedString(string: "")
        var subtitle: NSAttributedString? = pm.paymentMethodDescription?.toAttributedString()
        var accreditationTime: NSAttributedString?
        var action = withAction
        let backgroundColor = ThemeManager.shared.detailedBackgroundColor()
        let lightLabelColor = ThemeManager.shared.labelTintColor()
        let boldLabelColor = ThemeManager.shared.boldLabelTintColor()

        if pm.isDigitalCurrency {
            title = paymentMethodName.toAttributedString()
            accreditationTime = nil
        } else if pm.isCard {
            if let lastFourDigits = (self.amountHelper.getPaymentData().token?.lastFourDigits) {
                let text = paymentMethodName + " " + "terminada en".localized + " " + lastFourDigits
                title = text.toAttributedString()
            }
        } else {
            title = paymentMethodName.toAttributedString()
            if let accreditationMessage = pm.getAccreditationTimeMessage() {
                accreditationTime = Utils.getAccreditationTimeAttributedString(from: accreditationMessage)
            }
        }

        if paymentMethodIssuerName.lowercased() != paymentMethodName.lowercased() && !paymentMethodIssuerName.isEmpty {
            subtitle = paymentMethodIssuerName.toAttributedString()
        }

        if !self.advancedConfiguration.reviewConfirmConfiguration.isChangeMethodOptionEnabled() {
            action = nil
        }

        let props = PXPaymentMethodProps(paymentMethodIcon: image, title: title, subtitle: subtitle, descriptionTitle: nil, descriptionDetail: accreditationTime, disclaimer: nil, action: action, backgroundColor: backgroundColor, lightLabelColor: lightLabelColor, boldLabelColor: boldLabelColor)

        return PXPaymentMethodComponent(props: props)
    }

    func buildSummaryComponent(width: CGFloat) -> PXSummaryComponent {

        var customTitle = "Productos".localized
        let totalAmount: Double = self.amountHelper.preferenceAmountWithCharges
        if let prefDetail = advancedConfiguration.reviewConfirmConfiguration.details[SummaryType.PRODUCT], !prefDetail.title.isEmpty {
            customTitle = prefDetail.title
        } else {
            if self.amountHelper.preference.items.count == 1 {
                if let itemTitle = self.amountHelper.preference.items.first?.title, itemTitle.count > 0 {
                    customTitle = itemTitle
                }
            }
        }

        let props = PXSummaryComponentProps(summaryViewModel: getSummaryViewModel(amount: totalAmount), amountHelper: amountHelper, width: width, customTitle: customTitle, textColor: ThemeManager.shared.boldLabelTintColor(), backgroundColor: ThemeManager.shared.highlightBackgroundColor())

        return PXSummaryComponent(props: props)
    }

    func buildTitleComponent() -> PXReviewTitleComponent {
        let props = PXReviewTitleComponentProps(titleColor: ThemeManager.shared.getTitleColorForReviewConfirmNavigation(), backgroundColor: ThemeManager.shared.highlightBackgroundColor())
        return PXReviewTitleComponent(props: props)
    }

    func buildPayerComponent() -> PXPayerComponent? {

        if let payer = self.amountHelper.getPaymentData().payer,
            let payerIdType = payer.identification?.type,
            let payerIdNumber = payer.identification?.number,
            let payerDisplayText = displayText(for: payer),
            let mask = Utils.getMasks(forId: PXIdentificationType(id: payerIdType, name: nil, minLength: 0, maxLength: 0, type: nil)).first,
            let numberMasked = mask.textMasked(payerIdNumber)?.description {
                        let identification = NSAttributedString(string: "\(payerIdType): \(numberMasked)")
                        let fulltName = NSAttributedString(string: payerDisplayText)

                        let payerIcon = ResourceManager.shared.getImage("MPSDK_review_iconoPayer")
                        let props = PXPayerProps(payerIcon: payerIcon, identityfication: identification, fulltName: fulltName, backgroundColor: ThemeManager.shared.detailedBackgroundColor(), nameLabelColor: ThemeManager.shared.boldLabelTintColor(), identificationLabelColor: ThemeManager.shared.labelTintColor(), separatorColor: ThemeManager.shared.lightTintColor())
                        return PXPayerComponent(props: props)
        }

        return nil
    }

    private func displayText(for payer: PXPayer) -> String? {
        var displayText: String?
        if let typeRaw = payer.identification?.type, let type = BoletoType(rawValue: typeRaw) {
            switch type {
            case .cpf:
                    if let name = payer.firstName, let lastName = payer.lastName {
                        displayText = "\(name.uppercased()) \(lastName.uppercased())"
                    }
            case .cnpj:
                    if let legalName = payer.legalName {
                        displayText = legalName.uppercased()
                    }
            }
        }
        return displayText
    }
}

// MARK: Item component
extension PXReviewViewModel {

    // HotFix: TODO - Move to OneTapViewModel
    func buildOneTapItemComponents() -> [PXItemComponent] {
        var pxItemComponents = [PXItemComponent]()
        if advancedConfiguration.reviewConfirmConfiguration.hasItemsEnabled() {
            for item in self.amountHelper.preference.items {
                if let itemComponent = buildOneTapItemComponent(item: item) {
                    pxItemComponents.append(itemComponent)
                }
            }
        }
        return pxItemComponents
    }

    func buildItemComponents() -> [PXItemComponent] {
        var pxItemComponents = [PXItemComponent]()
        if advancedConfiguration.reviewConfirmConfiguration.hasItemsEnabled() { // Items can be disable
            for item in self.amountHelper.preference.items {
                if let itemComponent = buildItemComponent(item: item) {
                    pxItemComponents.append(itemComponent)
                }
            }
        }
        return pxItemComponents
    }

    fileprivate func shouldShowQuantity(item: PXItem) -> Bool {
        return item.quantity > 1 // Quantity must not be shown if it is 1
    }

    fileprivate func shouldShowPrice(item: PXItem) -> Bool {
        return amountHelper.preference.hasMultipleItems() || item.quantity > 1 // Price must not be shown if quantity is 1 and there are no more products
    }

    fileprivate func shouldShowCollectorIcon() -> Bool {
        return !amountHelper.preference.hasMultipleItems() && advancedConfiguration.reviewConfirmConfiguration.getCollectorIcon() != nil
    }

    fileprivate func buildItemComponent(item: PXItem) -> PXItemComponent? {
        if item.quantity == 1 && String.isNullOrEmpty(item._description) && !amountHelper.preference.hasMultipleItems() { // Item must not be shown if it has no description and it's one
            return nil
        }

        let itemQuantiy = getItemQuantity(item: item)
        let itemPrice = getItemPrice(item: item)
        let itemTitle = getItemTitle(item: item)
        let itemDescription = getItemDescription(item: item)
        let collectorIcon = getCollectorIcon()
        let amountTitle = advancedConfiguration.reviewConfirmConfiguration.getAmountTitle()
        let quantityTile = advancedConfiguration.reviewConfirmConfiguration.getQuantityLabel()

        let itemTheme: PXItemComponentProps.ItemTheme = (backgroundColor: ThemeManager.shared.detailedBackgroundColor(), boldLabelColor: ThemeManager.shared.boldLabelTintColor(), lightLabelColor: ThemeManager.shared.labelTintColor())

        let itemProps = PXItemComponentProps(imageURL: item.pictureUrl, title: itemTitle, description: itemDescription, quantity: itemQuantiy, unitAmount: itemPrice, amountTitle: amountTitle, quantityTitle: quantityTile, collectorImage: collectorIcon, itemTheme: itemTheme)
        return PXItemComponent(props: itemProps)
    }

    // HotFix: TODO - Move to OneTapViewModel
    private func buildOneTapItemComponent(item: PXItem) -> PXItemComponent? {
        let itemQuantiy = item.quantity
        let itemPrice = item.unitPrice
        let itemTitle = item.title
        let itemDescription = item._description

        let itemTheme: PXItemComponentProps.ItemTheme = (backgroundColor: ThemeManager.shared.detailedBackgroundColor(), boldLabelColor: ThemeManager.shared.boldLabelTintColor(), lightLabelColor: ThemeManager.shared.labelTintColor())

        let itemProps = PXItemComponentProps(imageURL: item.pictureUrl, title: itemTitle, description: itemDescription, quantity: itemQuantiy, unitAmount: itemPrice, amountTitle: "", quantityTitle: "", collectorImage: nil, itemTheme: itemTheme)
        return PXItemComponent(props: itemProps)
    }
}

// MARK: Item getters
extension PXReviewViewModel {
    fileprivate func getItemTitle(item: PXItem) -> String? { // Return item real title if it has multiple items, if not return description
        if amountHelper.preference.hasMultipleItems() {
            return item.title
        }
        return item._description
    }

    fileprivate func getItemDescription(item: PXItem) -> String? { // Returns only if it has multiple items
        if amountHelper.preference.hasMultipleItems() {
            return item._description
        }
        return nil
    }

    fileprivate func getItemQuantity(item: PXItem) -> Int? {
        if  !shouldShowQuantity(item: item) {
            return nil
        }
        return item.quantity
    }

    fileprivate func getItemPrice(item: PXItem) -> Double? {
        if  !shouldShowPrice(item: item) {
            return nil
        }
        return item.unitPrice
    }

    fileprivate func getCollectorIcon() -> UIImage? {
        if !shouldShowCollectorIcon() {
            return nil
        }
        return advancedConfiguration.reviewConfirmConfiguration.getCollectorIcon()
    }
}

// MARK: Custom Views
extension PXReviewViewModel {
    func buildTopDynamicCustomViews() -> [UIView]? {
        if let reviewScreenDynamicViewsConfiguration = advancedConfiguration.reviewConfirmDynamicViewsConfiguration, let dynamicCustomViews = reviewScreenDynamicViewsConfiguration.topCustomViews(store: PXCheckoutStore.sharedInstance) {
            return buildComponentViews(dynamicCustomViews)
        }
        return nil
    }

    func buildBottomDynamicCustomViews() -> [UIView]? {
        if let reviewScreenDynamicViewsConfiguration = advancedConfiguration.reviewConfirmDynamicViewsConfiguration, let dynamicCustomViews = reviewScreenDynamicViewsConfiguration.bottomCustomViews(store: PXCheckoutStore.sharedInstance) {
            return buildComponentViews(dynamicCustomViews)
        }
        return nil
    }

    func buildTopCustomView() -> UIView? {
        if let customView = advancedConfiguration.reviewConfirmConfiguration.getTopCustomView() {
            return buildComponentView(customView)
        }
        return nil
    }

    func buildBottomCustomView() -> UIView? {
        if let customView = advancedConfiguration.reviewConfirmConfiguration.getBottomCustomView() {
            return buildComponentView(customView)
        }
        return nil
    }

    private func buildComponentViews(_ customViews: [UIView]) -> [UIView] {
        var componentViews: [UIView] = []
        for customView in customViews {
            let componentView = buildComponentView(customView)
            componentViews.append(componentView)
        }
        return componentViews
    }

    private func buildComponentView(_ customView: UIView) -> UIView {
        let componentView = UIView()
        componentView.translatesAutoresizingMaskIntoConstraints = false
        customView.translatesAutoresizingMaskIntoConstraints = false
        PXLayout.setHeight(owner: customView, height: customView.frame.height).isActive = true
        componentView.addSubview(customView)
        PXLayout.centerHorizontally(view: customView).isActive = true
        PXLayout.pinTop(view: customView).isActive = true
        PXLayout.pinBottom(view: customView).isActive = true
        PXLayout.matchWidth(ofView: customView).isActive = true
        return componentView
    }
}
