//
//  PayerCostView.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/13/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

final class PayerCostView: UIView, PXComponent {

    fileprivate let VERTICAL_MARGIN: CGFloat = 2.0
    fileprivate let HORIZONTAL_MARGIN: CGFloat = 24.0
    fileprivate let INTER_MARGIN: CGFloat = 10.0
    fileprivate let TITLE_WIDTH_PERCENT: CGFloat = 0.5
    fileprivate let VALUE_WIDTH_PERCENT: CGFloat = 0.5

    static fileprivate let TITLE_FONT_SIZE: CGFloat = PXLayout.S_FONT
    static fileprivate let VALUE_FONT_SIZE: CGFloat = PXLayout.XL_FONT
    static fileprivate let NO_INTEREST_TEXT =  "Sin interés".localized
    static fileprivate let PAY_TEXT =  "Pagas".localized

    var noRateLabel: UILabel!
    var purchaseDetailTitle: UILabel!
    var purchaseDetailAmount: UILabel!

    var requiredHeight: CGFloat = 0.0

    init(frame: CGRect, payerCost: PXPayerCost) {
        super.init(frame: frame)
        self.purchaseDetailTitle = MPLabel(frame: CGRect(x: HORIZONTAL_MARGIN, y: VERTICAL_MARGIN, width: (self.getWeight() - 3 * HORIZONTAL_MARGIN) / 2, height: 0))
        self.purchaseDetailTitle.font = Utils.getFont(size: PayerCostView.TITLE_FONT_SIZE)
        self.purchaseDetailTitle.text = PayerCostView.PAY_TEXT
        self.purchaseDetailTitle.sizeToFit()
        if !payerCost.hasInstallmentsRate() {
            self.purchaseDetailAmount = MPLabel(frame: CGRect(x: (HORIZONTAL_MARGIN * 2) + self.purchaseDetailTitle.frame.size.width, y: VERTICAL_MARGIN, width: (self.getWeight() - 2 * HORIZONTAL_MARGIN) - self.purchaseDetailTitle.frame.size.width - INTER_MARGIN, height: 0))
            self.noRateLabel = MPLabel(frame: CGRect(x: (HORIZONTAL_MARGIN * 2) + self.purchaseDetailTitle.frame.size.width, y: VERTICAL_MARGIN * 2 + self.purchaseDetailAmount.frame.size.height, width: (self.getWeight() - 3 * HORIZONTAL_MARGIN) / 2, height: 0 ))
            self.noRateLabel.attributedText = NSAttributedString(string: MercadoPagoCheckout.showPayerCostDescription() ? PayerCostView.NO_INTEREST_TEXT: "")
            self.noRateLabel.font = Utils.getFont(size: PayerCostView.TITLE_FONT_SIZE)
            self.noRateLabel.textColor = ThemeManager.shared.noTaxAndDiscountLabelTintColor()
            self.noRateLabel.textAlignment = .right
            self.requiredHeight += self.noRateLabel.requiredHeight()
            self.addSubview(noRateLabel)
        } else {
             self.purchaseDetailAmount = MPLabel(frame: CGRect(x: (HORIZONTAL_MARGIN * 2) + self.purchaseDetailTitle.frame.size.width, y: VERTICAL_MARGIN, width: (self.getWeight() - 3 * HORIZONTAL_MARGIN) / 2, height: 0 ))

        }

        self.purchaseDetailTitle.textColor = ThemeManager.shared.boldLabelTintColor()
        self.purchaseDetailAmount.textColor = ThemeManager.shared.boldLabelTintColor()
        self.purchaseDetailTitle.textAlignment = .left
        self.purchaseDetailAmount.textAlignment = .right

        self.removeFromSuperview()
        let purchaseAmount = getInstallmentsAmount(payerCost: payerCost)
        self.purchaseDetailAmount.attributedText = purchaseAmount
        self.requiredHeight += self.purchaseDetailAmount.requiredHeight()
        if PurchaseDetailTableViewCell.separatorLine != nil {
            PurchaseDetailTableViewCell.separatorLine!.removeFromSuperview()
        }

        self.addSubview(purchaseDetailTitle)
        self.addSubview(purchaseDetailAmount)

        self.adjustViewFrames()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension PayerCostView {

    func getHeight() -> CGFloat {
        return self.requiredHeight
    }

    func getWeight() -> CGFloat {
        return self.frame.size.width
    }

    fileprivate func getInstallmentsAmount(payerCost: PXPayerCost) -> NSAttributedString {
        return Utils.getTransactionInstallmentsDescription(payerCost.installments.description, currency: SiteManager.shared.getCurrency(), installmentAmount: payerCost.installmentAmount, color: ThemeManager.shared.boldLabelTintColor(), fontSize: PayerCostView.VALUE_FONT_SIZE, baselineOffset: 8)
    }

    func adjustViewFrames() {
        let frameTitle = self.purchaseDetailTitle.frame
        let frameAmount = self.purchaseDetailAmount.frame
        self.purchaseDetailAmount.frame = CGRect(x: frameAmount.origin.x, y: frameAmount.origin.y, width: frameAmount.size.width, height: self.purchaseDetailAmount.requiredHeight())
        self.purchaseDetailAmount.sizeToFit()
        self.purchaseDetailAmount.frame = CGRect(x: getWeight() - self.purchaseDetailAmount.frame.size.width - HORIZONTAL_MARGIN, y: frameAmount.origin.y, width: self.purchaseDetailAmount.frame.size.width, height: self.purchaseDetailAmount.frame.size.height)
        self.purchaseDetailTitle.frame = CGRect(x: frameTitle.origin.x, y: frameTitle.origin.y, width: frameTitle.size.width, height: self.purchaseDetailAmount.frame.size.height)
        self.requiredHeight = self.purchaseDetailAmount.frame.size.height + 2 * VERTICAL_MARGIN

        if self.noRateLabel != nil {
            self.noRateLabel.frame = CGRect(x: -HORIZONTAL_MARGIN, y: VERTICAL_MARGIN * 2 + self.purchaseDetailAmount.frame.size.height, width: self.frame.width, height: self.noRateLabel.requiredHeight())
            self.requiredHeight += VERTICAL_MARGIN + self.noRateLabel.requiredHeight()
        }
    }
}
