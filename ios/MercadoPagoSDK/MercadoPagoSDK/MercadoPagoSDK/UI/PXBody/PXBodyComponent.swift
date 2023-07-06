//
//  PXBodyComponent.swift
//  TestAutolayout
//
//  Created by Demian Tejo on 10/19/17.
//  Copyright © 2017 Demian Tejo. All rights reserved.
//

import UIKit

internal class PXBodyComponent: PXComponentizable {

    let rejectedStatusDetailsWithBody = [PXPayment.StatusDetails.REJECTED_CALL_FOR_AUTHORIZE,
                                         PXPayment.StatusDetails.REJECTED_CARD_DISABLED,
                                         PXPayment.StatusDetails.REJECTED_INVALID_INSTALLMENTS,
                                         PXPayment.StatusDetails.REJECTED_DUPLICATED_PAYMENT,
                                         PXPayment.StatusDetails.REJECTED_INSUFFICIENT_AMOUNT,
                                         PXPayment.StatusDetails.REJECTED_MAX_ATTEMPTS,
                                         PXPayment.StatusDetails.REJECTED_HIGH_RISK,
                                         PXPayment.StatusDetails.REJECTED_CARD_HIGH_RISK,
                                         PXPayment.StatusDetails.REJECTED_BY_REGULATIONS]

    let pendingStatusDetailsWithBody = [PXPayment.StatusDetails.PENDING_CONTINGENCY, PXPayment.StatusDetails.PENDING_REVIEW_MANUAL]

    var props: PXBodyProps

    init(props: PXBodyProps) {
        self.props = props
    }

    func hasInstructions() -> Bool {
        return props.instruction != nil
    }

    func getCreditsExpectationView() -> PXCreditsExpectationView? {
        if let resultInfo = self.props.amountHelper.getPaymentData().getPaymentMethod()?.creditsDisplayInfo?.resultInfo {
            return PXCreditsExpectationView(title: resultInfo.title, subtitle: resultInfo.subtitle)
        }
        return nil
    }

    func getInstructionsComponent() -> PXInstructionsComponent? {
        if let instruction = props.instruction {
            let instructionsProps = PXInstructionsProps(instruction: instruction)
            let instructionsComponent = PXInstructionsComponent(props: instructionsProps)
            return instructionsComponent
        }
        return nil
    }

    private func getPaymentMethodIcon(paymentMethod: PXPaymentMethod) -> UIImage? {
        let defaultColor = paymentMethod.paymentTypeId == PXPaymentTypes.ACCOUNT_MONEY.rawValue && paymentMethod.paymentTypeId != PXPaymentTypes.PAYMENT_METHOD_PLUGIN.rawValue
        var paymentMethodImage: UIImage? =  ResourceManager.shared.getImageForPaymentMethod(withDescription: paymentMethod.id, defaultColor: defaultColor)
        // Retrieve image for payment plugin or any external payment method.
        if paymentMethod.paymentTypeId == PXPaymentTypes.PAYMENT_METHOD_PLUGIN.rawValue {
            paymentMethodImage = paymentMethod.getImageForExtenalPaymentMethod()
        }
        return paymentMethodImage
    }

    func getPaymentMethodComponents() -> [PXPaymentMethodComponent] {
        var paymentMethodsComponents: [PXPaymentMethodComponent] = []

        if let splitAccountMoney = props.paymentResult.splitAccountMoney, let secondPMComponent = getPaymentMethodComponent(paymentData: splitAccountMoney) {
            paymentMethodsComponents.append(secondPMComponent)
        }

        if let paymentData = props.paymentResult.paymentData, let firstPMComponent = getPaymentMethodComponent(paymentData: paymentData) {
            paymentMethodsComponents.append(firstPMComponent)
        }

        return paymentMethodsComponents
    }

    func getPaymentMethodComponent(paymentData: PXPaymentData) -> PXPaymentMethodComponent? {
        guard let paymentMethod = paymentData.paymentMethod else {
            return nil
        }

        let image = getPaymentMethodIcon(paymentMethod: paymentMethod)
        let currency = SiteManager.shared.getCurrency()
        var amountTitle: NSMutableAttributedString =  "".toAttributedString()
        var subtitle: NSMutableAttributedString?
        if let payerCost = paymentData.payerCost {
            if payerCost.installments > 1 {
                amountTitle = String(String(payerCost.installments) + "x " + Utils.getAmountFormated(amount: payerCost.installmentAmount, forCurrency: currency)).toAttributedString()
                subtitle = Utils.getAmountFormated(amount: payerCost.totalAmount, forCurrency: currency, addingParenthesis: true).toAttributedString()
            } else {
                amountTitle = Utils.getAmountFormated(amount: payerCost.totalAmount, forCurrency: currency).toAttributedString()
            }
        } else {
            // Caso account money
            if  let splitAccountMoneyAmount = paymentData.getTransactionAmountWithDiscount() {
                amountTitle = Utils.getAmountFormated(amount: splitAccountMoneyAmount, forCurrency: currency).toAttributedString()
            } else {
                amountTitle = Utils.getAmountFormated(amount: props.amountHelper.amountToPay, forCurrency: currency).toAttributedString()
            }
        }

        var pmDescription: String = ""
        let paymentMethodName = paymentMethod.name ?? ""

        let issuer = paymentData.getIssuer()
        let paymentMethodIssuerName = issuer?.name ?? ""
        var descriptionDetail: NSAttributedString?

        if paymentMethod.isCard {
            if let lastFourDigits = (paymentData.token?.lastFourDigits) {
                pmDescription = paymentMethodName + " " + "terminada en".localized + " " + lastFourDigits
            }
            if paymentMethodIssuerName.lowercased() != paymentMethodName.lowercased() && !paymentMethodIssuerName.isEmpty {
                descriptionDetail = paymentMethodIssuerName.toAttributedString()
            }
        } else {
            pmDescription = paymentMethodName
        }

        var disclaimerText: String?
        if let statementDescription = self.props.paymentResult.statementDescription {
            disclaimerText = ("En tu estado de cuenta verás el cargo como {0}".localized as NSString).replacingOccurrences(of: "{0}", with: "\(statementDescription)")
        }

        let bodyProps = PXPaymentMethodProps(paymentMethodIcon: image, title: amountTitle, subtitle: subtitle, descriptionTitle: pmDescription.toAttributedString(), descriptionDetail: descriptionDetail, disclaimer: disclaimerText?.toAttributedString(), backgroundColor: .white, lightLabelColor: ThemeManager.shared.labelTintColor(), boldLabelColor: ThemeManager.shared.boldLabelTintColor())

        return PXPaymentMethodComponent(props: bodyProps)
    }

    func hasBodyError() -> Bool {
        return isPendingWithBody() || isRejectedWithBody()
    }

    func getBodyErrorComponent() -> PXErrorComponent {
        let status = props.paymentResult.status
        let statusDetail = props.paymentResult.statusDetail
        let amount = props.paymentResult.paymentData?.payerCost?.totalAmount ?? props.amountHelper.amountToPay
        let paymentMethodName = props.paymentResult.paymentData?.paymentMethod?.name

        let title = getErrorTitle(status: status, statusDetail: statusDetail)
        let message = getErrorMessage(status: status,
                                      statusDetail: statusDetail,
                                      amount: amount,
                                      paymentMethodName: paymentMethodName)

        let errorProps = PXErrorProps(title: title.toAttributedString(), message: message?.toAttributedString(), secondaryTitle: nil, action: nil)
        let errorComponent = PXErrorComponent(props: errorProps)
        return errorComponent
    }

    func getErrorTitle(status: String, statusDetail: String) -> String {
        if status == PXPayment.Status.REJECTED &&
            statusDetail == PXPayment.StatusDetails.REJECTED_CALL_FOR_AUTHORIZE {
            return PXResourceProvider.getTitleForCallForAuth()
        }
        return PXResourceProvider.getTitleForErrorBody()
    }

    func getErrorMessage(status: String, statusDetail: String, amount: Double, paymentMethodName: String?) -> String? {
        if status == PXPayment.Status.PENDING || status == PXPayment.Status.IN_PROCESS {
            switch statusDetail {
            case PXPayment.StatusDetails.PENDING_CONTINGENCY:
                return PXResourceProvider.getDescriptionForErrorBodyForPENDING_CONTINGENCY()
            case PXPayment.StatusDetails.PENDING_REVIEW_MANUAL:
                return PXResourceProvider.getDescriptionForErrorBodyForPENDING_REVIEW_MANUAL()
            default:
                return nil
            }
        } else if status == PXPayment.Status.REJECTED {
            switch statusDetail {
            case PXPayment.StatusDetails.REJECTED_CALL_FOR_AUTHORIZE:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_CALL_FOR_AUTHORIZE(amount)
            case PXPayment.StatusDetails.REJECTED_CARD_DISABLED:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_CARD_DISABLED(paymentMethodName)
            case PXPayment.StatusDetails.REJECTED_INSUFFICIENT_AMOUNT:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_INSUFFICIENT_AMOUNT()
            case PXPayment.StatusDetails.REJECTED_OTHER_REASON:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_OTHER_REASON()
            case PXPayment.StatusDetails.REJECTED_BY_BANK:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_BY_BANK()
            case PXPayment.StatusDetails.REJECTED_INSUFFICIENT_DATA:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_INSUFFICIENT_DATA()
            case PXPayment.StatusDetails.REJECTED_DUPLICATED_PAYMENT:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_DUPLICATED_PAYMENT()
            case PXPayment.StatusDetails.REJECTED_MAX_ATTEMPTS:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_MAX_ATTEMPTS()
            case PXPayment.StatusDetails.REJECTED_HIGH_RISK:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_HIGH_RISK()
            case PXPayment.StatusDetails.REJECTED_CARD_HIGH_RISK:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_CARD_HIGH_RISK()
            case PXPayment.StatusDetails.REJECTED_BY_REGULATIONS:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_BY_REGULATIONS()
            case PXPayment.StatusDetails.REJECTED_INVALID_INSTALLMENTS:
                return PXResourceProvider.getDescriptionForErrorBodyForREJECTED_INVALID_INSTALLMENTS()
            default:
                return nil
            }
        }
        return nil
    }

    func isPendingWithBody() -> Bool {
        let hasPendingStatus = props.paymentResult.status == PXPayment.Status.PENDING || props.paymentResult.status == PXPayment.Status.IN_PROCESS
        return hasPendingStatus && pendingStatusDetailsWithBody.contains(props.paymentResult.statusDetail)
    }

    func isRejectedWithBody() -> Bool {
        return props.paymentResult.status == PXPayment.Status.REJECTED && rejectedStatusDetailsWithBody.contains(props.paymentResult.statusDetail)
    }

    func render() -> UIView {
        return PXBodyRenderer().render(self)
    }

}

internal class PXBodyProps {
    let paymentResult: PaymentResult
    let instruction: PXInstruction?
    let amountHelper: PXAmountHelper
    let callback : (() -> Void)

    init(paymentResult: PaymentResult, amountHelper: PXAmountHelper, instruction: PXInstruction?, callback:  @escaping (() -> Void)) {
        self.paymentResult = paymentResult
        self.instruction = instruction
        self.amountHelper = amountHelper
        self.callback = callback
    }
}
