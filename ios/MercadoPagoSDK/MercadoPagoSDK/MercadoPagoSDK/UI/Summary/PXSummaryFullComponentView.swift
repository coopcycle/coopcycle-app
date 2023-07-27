//
//  PXSummaryFullComponentView.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 1/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXSummaryFullComponentView: PXComponentView {

    fileprivate let summary: Summary!

    fileprivate let SMALL_MARGIN_HEIGHT: CGFloat = 8.0
    fileprivate let MEDIUM_MARGIN_HEIGHT: CGFloat = 12.0
    fileprivate let LARGE_MARGIN_HEIGHT: CGFloat = 28.0
    fileprivate let HORIZONTAL_MARGIN: CGFloat = 24.0
    fileprivate let DETAILS_HEIGHT: CGFloat = 18.0
    fileprivate let TOTAL_HEIGHT: CGFloat = 24.0
    fileprivate let PAYER_COST_HEIGHT: CGFloat = 20.0
    fileprivate let DISCLAIMER_HEIGHT: CGFloat = 20.0
    fileprivate let DISCLAIMER_FONT_SIZE: CGFloat = PXLayout.XXXS_FONT
    fileprivate static let TOTAL_TITLE = "Total".localized
    fileprivate let customSummaryTitle: String
    fileprivate var requiredHeight: CGFloat = PXLayout.L_MARGIN
    private let amountHelper: PXAmountHelper

    init(width: CGFloat, summaryViewModel: Summary, amountHelper: PXAmountHelper, backgroundColor: UIColor, customSummaryTitle: String) {
        self.summary = summaryViewModel
        self.customSummaryTitle = customSummaryTitle
        self.amountHelper = amountHelper
        super.init()
        self.frame = CGRect(x: 0, y: requiredHeight, width: width, height: 0)
        self.addDetailsViews(typeDetailDictionary: summary.details)
        let payerCost = amountHelper.getPaymentData().payerCost
        if payerCost != nil && (payerCost?.installments)! > 1 {
            self.addSmallMargin()
            self.addLine()
            self.addSmallMargin()
            self.addPayerCost(payerCost: payerCost!)
            self.addSmallMargin()
            self.addLine()
            self.addSmallMargin()
            self.addTotalView(totalAmount: (payerCost?.totalAmount)!)
        } else {
            self.addSmallMargin()
            if shouldAddTotal() {
                self.addLine()
                self.addSmallMargin()
                self.addTotalView(totalAmount: amountHelper.amountToPay)
            }
        }
        self.addMediumMargin()
        if let disclaimer = summary.disclaimer {
            self.addDisclaimerView(text: disclaimer, color: summary.disclaimerColor)
            self.addMediumMargin()
        }

        self.backgroundColor = backgroundColor
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func getHeight() -> CGFloat {
        return requiredHeight
    }
}

extension PXSummaryFullComponentView {

    internal func shouldAddTotal() -> Bool {
        return self.summary.details.count > 1
    }

    fileprivate func addDetailsViews(typeDetailDictionary: [SummaryType: SummaryDetail]) {
        let summaryTypes = [SummaryType.PRODUCT, SummaryType.DISCOUNT, SummaryType.CHARGE, SummaryType.TAXES, SummaryType.ARREARS, SummaryType.SHIPPING]
        for type in summaryTypes {
            let frame = CGRect(x: 0.0, y: requiredHeight, width: self.frame.size.width, height: DETAILS_HEIGHT)

            if let detail = typeDetailDictionary[type] {

                var value: Double = detail.getTotalAmount()
                if type == SummaryType.DISCOUNT {
                    value *= (-1)
                }

                var titleValueView = TitleValueView(frame: frame, titleText: detail.title, valueDouble: value, colorTitle: detail.titleColor, colorValue: detail.amountColor, valueEnable: true)

                if type == SummaryType.PRODUCT {
                    titleValueView = TitleValueView(frame: frame, titleText: customSummaryTitle, valueDouble: value, colorTitle: detail.titleColor, colorValue: detail.amountColor, valueEnable: true)
                }

                self.addSmallMargin()
                self.addSubview(titleValueView)
                requiredHeight += titleValueView.getHeight()
            }
        }
    }

    fileprivate func addTotalView(totalAmount: Double) {
        let frame = CGRect(x: 0.0, y: requiredHeight, width: self.frame.size.width, height: DETAILS_HEIGHT)
        let titleValueView = TitleValueView(frame: frame, titleText: PXSummaryFullComponentView.TOTAL_TITLE, valueDouble: totalAmount, valueEnable: true)
        requiredHeight += titleValueView.getHeight()
        self.addSubview(titleValueView)
    }

    internal func addPayerCost(payerCost: PXPayerCost) {
        let payerCostView = PayerCostView(frame: CGRect(x: 0, y: requiredHeight, width: self.frame.size.width, height: PAYER_COST_HEIGHT), payerCost: payerCost)
        self.addSubview(payerCostView)
        payerCostView.frame = CGRect(x: 0, y: requiredHeight, width: self.frame.size.width, height: payerCostView.getHeight())
        requiredHeight += payerCostView.getHeight()
    }

    fileprivate func addDisclaimerView(text: String, color: UIColor) {
        let disclaimerView = DisclaimerView(frame: CGRect(x: 0, y: requiredHeight, width: self.frame.size.width, height: DISCLAIMER_HEIGHT), disclaimerText: text, colorText: color, disclaimerFontSize: DISCLAIMER_FONT_SIZE)
        self.addSubview(disclaimerView)
        self.requiredHeight += disclaimerView.getHeight()
    }

    fileprivate func iterateEnum<T: Hashable>(_: T.Type) -> AnyIterator<T> {
        var index = 0
        return AnyIterator {
            let next = withUnsafeBytes(of: &index) { $0.load(as: T.self) }
            if next.hashValue != index { return nil }
            index += 1
            return next
        }
    }

    fileprivate func addSmallMargin() {
        self.addMargin(height: SMALL_MARGIN_HEIGHT)
    }

    fileprivate func addMediumMargin() {
        self.addMargin(height: MEDIUM_MARGIN_HEIGHT)
    }

    fileprivate func addLargeMargin() {
        self.addMargin(height: LARGE_MARGIN_HEIGHT)
    }

    fileprivate func addMargin(height: CGFloat) {
        self.requiredHeight += height
    }

    fileprivate func addLine() {
        self.addLine(posY: self.requiredHeight, horizontalMargin: HORIZONTAL_MARGIN, width: self.frame.size.width - 2 * HORIZONTAL_MARGIN, height: 1)
        self.requiredHeight += 1.0
    }
}
